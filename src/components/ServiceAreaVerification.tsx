import React, { useState, useEffect } from 'react';
import { ServiceAreaVerificationData, ServiceAreaResult } from '../types';
import { ServiceAreaValidator, parseLocationRequestsFromData, convertStateAbbreviation } from '../utils/serviceAreaValidator';
import { parseExcelFile, isExcelFile } from '../utils/excelParser';
import { parseCSV } from '../utils/csvParser';
import { geocodeAddress, GeocodingResult } from '../utils/mapboxGeocoding';
import { FileUpload } from './FileUpload';
import { formatCurrency, formatPercentage, formatStatus, formatContainerSize, formatNumber } from '../utils/formatters';
import { MapPin, Upload, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { CONTAINER_SIZES, FREQUENCY_OPTIONS, EQUIPMENT_TYPES, MATERIAL_TYPES } from '../data/divisions';

interface ServiceAreaVerificationProps {
  onVerificationComplete: (verification: ServiceAreaVerificationData) => void;
  onContinue?: () => void;
  onFileNameUpdate: (fileName: string) => void;
}

export function ServiceAreaVerification({ onVerificationComplete, onContinue, onFileNameUpdate }: ServiceAreaVerificationProps) {
  const [verificationMode, setVerificationMode] = useState<'single' | 'bulk'>('single');
  const [editableResults, setEditableResults] = useState<ServiceAreaResult[]>([]);
  const [hasManualOverrides, setHasManualOverrides] = useState(false);
  const [singleLocationData, setSingleLocationData] = useState({
    address: '',
    city: '',
    state: 'TX',
    zipCode: '',
    companyName: '',
    equipmentType: 'Front-Load Container',
    containerSize: '',
    frequency: '',
    materialType: 'Solid Waste',
    binQuantity: 1,
    latitude: null as number | null,
    longitude: null as number | null
  });
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [results, setResults] = useState<ServiceAreaResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [validator] = useState(() => new ServiceAreaValidator());
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Loading service area data...');

  // Geocoding state
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingProgress, setGeocodingProgress] = useState(0);
  
  // Manual review workflow state
  const [selectedManualReviewId, setSelectedManualReviewId] = useState<string | null>(null);
  const [loadingActions, setLoadingActions] = useState<Record<string, 'approving' | 'rejecting' | null>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    isOpen: boolean;
    locationId: string;
    action: 'approve' | 'reject';
    locationName: string;
  } | null>(null);
  
  // Single location form state
  const [singleLocationData, setSingleLocationData] = useState({
    companyName: '',
    address: '',
    city: '',
    state: 'Texas',
    zipCode: '',
    equipmentType: 'Front-Load Container',
    containerSize: '8YD',
    frequency: '1x/week',
    materialType: 'Solid Waste',
    binQuantity: 1
  });

  const validator = new ServiceAreaValidator();

  // Initialize Google Places Autocomplete
  React.useEffect(() => {
    const initializeAutocomplete = () => {
      if (!addressInputRef || !window.google?.maps?.places) {
        return false;
      }
      
      const autocompleteInstance = new window.google.maps.places.Autocomplete(addressInputRef, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address', 'geometry']
      });

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        
        if (place.address_components) {
          let streetNumber = '';
          let route = '';
          let city = '';
          let state = '';
          let zipCode = '';
          
          place.address_components.forEach((component) => {
            const types = component.types;
            
            if (types.includes('street_number')) {
              streetNumber = component.long_name;
            }
            if (types.includes('route')) {
              route = component.long_name;
            }
            if (types.includes('locality')) {
              city = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            }
            if (types.includes('postal_code')) {
              zipCode = component.short_name;
            }
          });
          
          const fullAddress = `${streetNumber} ${route}`.trim();
          
          setSingleLocationData(prev => ({
            ...prev,
            address: fullAddress,
            city: city,
            state: state || 'Texas',
            zipCode: zipCode
          }));
        }
      });
      
      setAutocomplete(autocompleteInstance);
      return true;
    };

    // Try to initialize immediately
    if (!initializeAutocomplete()) {
      // If not ready, retry every 500ms for up to 10 seconds
      let retryCount = 0;
      const maxRetries = 20;
      
      const retryInterval = setInterval(() => {
        retryCount++;
        
        if (initializeAutocomplete() || retryCount >= maxRetries) {
          clearInterval(retryInterval);
        }
      }, 500);
      
      // Cleanup interval on unmount
      return () => clearInterval(retryInterval);
    }
  }, [addressInputRef]);
  
  // Get container size options based on equipment type
  const getContainerSizeOptions = () => {
    if (singleLocationData.equipmentType === 'Front-Load Container') {
      return [
        { value: '2YD', label: '2 Yard' },
        { value: '4YD', label: '4 Yard' },
        { value: '6YD', label: '6 Yard' },
        { value: '8YD', label: '8 Yard' },
        { value: '10YD', label: '10 Yard' }
      ];
    }
    if (singleLocationData.equipmentType === 'Compactor') {
      return [
        { value: '15YD', label: '15 Yard' },
        { value: '20YD', label: '20 Yard' },
        { value: '30YD', label: '30 Yard' },
        { value: '35YD', label: '35 Yard' },
        { value: '40YD', label: '40 Yard' }
      ];
    }
    if (singleLocationData.equipmentType === 'Roll-off') {
      return [
        { value: '20YD', label: '20 Yard' },
        { value: '30YD', label: '30 Yard' },
        { value: '40YD', label: '40 Yard' }
      ];
    }
    return CONTAINER_SIZES;
  };

 const loadServiceAreaData = async () => {
    try {
      setLoadingStatus('Loading GeoJSON polygon data...');
      
      // Load GeoJSON data
      const geoJsonResponse = await fetch('/data/division-polygons.json');
      if (!geoJsonResponse.ok) {
        throw new Error(`Failed to load GeoJSON: ${geoJsonResponse.status} ${geoJsonResponse.statusText}`);
      }
      
      const geoJsonText = await geoJsonResponse.text();
      let geoJsonData;
      try {
        geoJsonData = JSON.parse(geoJsonText);
      } catch (parseError) {
        console.error('❌ GeoJSON parse error:', parseError);
        console.error('❌ Response text:', geoJsonText.substring(0, 200));
        throw new Error(`Invalid GeoJSON format: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
      }
      
      validator.setGeoJsonData(geoJsonData);
      
      setLoadingStatus('Loading service boundaries CSV...');
      
      // Load CSV data
      const csvResponse = await fetch('/data/service-areas.csv');
      if (!csvResponse.ok) {
        throw new Error(`Failed to load CSV: ${csvResponse.status} ${csvResponse.statusText}`);
      }
      const csvText = await csvResponse.text();
      
      // Validate CSV content
      if (csvText.trim().startsWith('<!DOCTYPE') || csvText.trim().startsWith('<html')) {
        throw new Error('CSV file returned HTML content - check file path');
      }
      
      const csvData = parseServiceBoundariesCSV(csvText);
      validator.setServiceBoundaries(csvData);
      
      setLoadingStatus('Loading franchise fee data...');
      
      // Load franchise fee data
      const franchiseFeeResponse = await fetch('/data/FF - Sheet1 copy copy.csv');
      if (!franchiseFeeResponse.ok) {
        console.warn('⚠️ Franchise fee data not found, continuing without city-specific fees');
      } else {
        const franchiseFeeText = await franchiseFeeResponse.text();
        const franchiseFeeData = parseFranchiseFeeCSV(franchiseFeeText);
        validator.setFranchiseFeeData(franchiseFeeData);
        console.log('✅ Franchise fee data loaded:', franchiseFeeData);
      }
      
      setDataLoaded(true);
      setLoadingStatus('Service area data loaded successfully');
      
      console.log('✅ Service area data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading service area data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setLoadingStatus(`Error loading data: ${errorMessage}`);
      
      // Show user-friendly error in the UI
      setDataLoaded(false);
    }
  };

  const parseServiceBoundariesCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        
        headers.forEach((header, i) => {
          row[header.toLowerCase().replace(/[^a-z0-9]/g, '')] = values[i] || '';
        });
        
        return row;
      });
  };

  const parseFranchiseFeeCSV = (csvText: string): Record<string, number> => {
    const lines = csvText.split('\n');
    const franchiseFeeMap: Record<string, number> = {};
    
    // Skip header row and process data
    lines.slice(1).forEach(line => {
      if (!line.trim()) return;
      
      const [city, franchiseFee] = line.split(',').map(v => v.trim().replace(/"/g, ''));
      if (city && franchiseFee) {
        // Parse percentage value (remove % symbol and convert to number)
        const feeValue = parseFloat(franchiseFee.replace('%', '')) || 0;
        const normalizedCity = city.toLowerCase().trim();
        franchiseFeeMap[normalizedCity] = feeValue;
        
        console.log(`📊 Franchise fee loaded: ${city} -> ${feeValue}%`);
      }
    });
    
    return franchiseFeeMap;
  };
      // Geocode all addresses before processing
      setGeocodingProgress(0);
      
      for (let i = 0; i < locationRequests.length; i++) {
        const request = locationRequests[i];
        setGeocodingProgress(Math.round(((i + 1) / locationRequests.length) * 50)); // First 50% for geocoding
        
        try {
          const fullAddress = `${request.address}, ${request.city}, ${request.state} ${request.zipCode}`;
          
          const geocodingResult = await geocodeAddress(fullAddress);
          
          if (geocodingResult) {
            request.latitude = geocodingResult.latitude;
            request.longitude = geocodingResult.longitude;
          } else {
            request.latitude = null;
            request.longitude = null;
          }
          
          // Rate limiting: 100ms delay between requests for Mapbox
          if (i < locationRequests.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
        } catch (error) {
          request.latitude = null;
          request.longitude = null;
        }
      }
      
  };
        
        const result = await validator.validateLocation(
          request.id,
          request.address,
          request.city,
          request.state,
          request.zipCode,
          request.companyName,
          request.latitude,
          request.longitude,
          request.equipmentType,
          request.containerSize,
          request.frequency,
          request.materialType,
          request.addOns,
          request.binQuantity
        );
        
        results.push(result);
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      const verification: ServiceAreaVerificationData = {
        totalProcessed: results.length,
        serviceableCount: results.filter(r => r.status === 'serviceable').length,
        notServiceableCount: results.filter(r => r.status === 'not-serviceable').length,
        manualReviewCount: results.filter(r => r.status === 'manual-review').length,
        results
      };
      
      setVerificationResults(verification);
      onVerificationComplete(verification);
      onFileNameUpdate(file.name);
      
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please check the format and try again.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [onVerificationComplete, onFileNameUpdate]);

  const handleSingleLocationSubmit = () => {
    if (!singleLocationData.address || !singleLocationData.city) {
      alert('Please fill in all required fields (Address, City)');
      return;
    }

    setIsGeocoding(true);
    
    const processLocation = async () => {
      try {
        // Geocode the address first
        const fullAddress = `${singleLocationData.address}, ${singleLocationData.city}, ${singleLocationData.state} ${singleLocationData.zipCode}`;
        
        const geocodingResult = await geocodeAddress(fullAddress);
        
        let latitude: number | null = null;
        let longitude: number | null = null;
        
        if (geocodingResult) {
          latitude = geocodingResult.latitude;
          longitude = geocodingResult.longitude;
        }
        
        // Validate the location
        const result = await validator.validateLocation(
          'single-location-1',
          singleLocationData.address,
          singleLocationData.city,
          singleLocationData.state,
          singleLocationData.zipCode,
          singleLocationData.companyName,
          latitude,
          longitude,
          singleLocationData.equipmentType,
          singleLocationData.containerSize,
          singleLocationData.frequency,
          singleLocationData.materialType,
          [],
          singleLocationData.binQuantity
        );
        
        const verification: ServiceAreaVerificationData = {
          totalProcessed: 1,
          serviceableCount: result.status === 'serviceable' ? 1 : 0,
          notServiceableCount: result.status === 'not-serviceable' ? 1 : 0,
          manualReviewCount: result.status === 'manual-review' ? 1 : 0,
          results: [result]
        };
        
        setVerificationResults(verification);
        onVerificationComplete(verification);
        onFileNameUpdate(`Single Location - ${singleLocationData.companyName || 'Unknown'}`);
        
      } catch (error) {
        console.error('Error processing single location:', error);
        alert('Error processing location. Please try again.');
      } finally {
        setIsGeocoding(false);
      }
    };
    
    processLocation();
  };

   {/* Bulk Upload Mode */}
      {verificationMode === 'bulk' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Location Verification</h3>
          
          <FileUpload
            onFileUpload={setBulkFile}
            title="Upload Location File"
            description="Upload CSV or Excel file with location data (include latitude/longitude columns for best results)"
            uploadedFile={bulkFile}
            onClearFile={clearBulkFile}
          />

          {bulkFile && (
            <div className="mt-4">
              <button
                onClick={handleBulkVerification}
                disabled={processing || !dataLoaded}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? (
                  <>
                    <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Verify All Locations
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {editableResults.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Verification Results</h3>
            <div className="flex space-x-3">
              {hasManualOverrides && (
                <button
                  onClick={applyManualOverrides}
                  className="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Apply Changes
                </button>
              )}
              <button
                onClick={exportResults}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </button>
            </div>
          </div>

          {hasManualOverrides && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800 font-medium">
                ⚠️ You have made manual changes to the verification results. Click "Apply Changes" to update the verification data.
              </p>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{editableResults.length}</div>
              <div className="text-sm text-blue-700">Total Processed</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {editableResults.filter(r => r.status === 'serviceable').length}
              </div>
              <div className="text-sm text-green-700">Serviceable</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {editableResults.filter(r => r.status === 'manual-review').length}
              </div>
              <div className="text-sm text-yellow-700">Manual Review</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {editableResults.filter(r => r.status === 'not-serviceable').length}
              </div>
              <div className="text-sm text-red-700">Not Serviceable</div>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {editableResults.map((result) => (
              <div
                key={result.id}
                className={`p-4 rounded-lg border ${
                  result.status === 'serviceable'
                    ? 'bg-green-50 border-green-200'
                    : result.status === 'manual-review'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {result.status === 'serviceable' ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : result.status === 'manual-review' ? (
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      <h4 className="font-medium text-gray-900">
                        {result.companyName || 'Unknown Company'}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div>
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-700 mb-2">Address Information</h5>
                          <div className="space-y-1 text-gray-600">
                            <p><span className="font-medium">Street:</span> {result.address}</p>
                            <p><span className="font-medium">City:</span> {result.city}</p>
                            <p><span className="font-medium">State:</span> {result.state}</p>
                            <p><span className="font-medium">Zip Code:</span> {result.zipCode}</p>
                          </div>
                        </div>
                        {(result.latitude && result.longitude) && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-700 mb-2">Coordinates</h5>
                            <div className="text-xs text-gray-500 space-y-1">
                              <p><span className="font-medium">Latitude:</span> {result.latitude.toFixed(6)}</p>
                              <p><span className="font-medium">Longitude:</span> {result.longitude.toFixed(6)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
      const updatedVerification: ServiceAreaVerificationData = {
        totalProcessed: updatedResults.length,
        serviceableCount: updatedResults.filter(r => r.status === 'serviceable').length,
        notServiceableCount: updatedResults.filter(r => r.status === 'not-serviceable').length,
        manualReviewCount: updatedResults.filter(r => r.status === 'manual-review').length,
        results: updatedResults
      };
      
      setVerificationResults(updatedVerification);
      onVerificationComplete(updatedVerification);
      
    } catch (error) {
      console.error(`Error ${action}ing location:`, error);
      alert(`Error ${action}ing location. Please try again.`);
    } finally {
      setLoadingActions(prev => ({ ...prev, [locationId]: null }));
      setShowConfirmDialog(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'serviceable':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'not-serviceable':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'manual-review':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'serviceable':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'not-serviceable':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'manual-review':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  if (isProcessing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Service Area Verification</h3>
            <p className="text-gray-600 mb-4">
              {processingProgress < 50 ? 'Geocoding addresses...' : 'Validating service areas...'}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">{processingProgress}% complete</p>
          </div>
        </div>
      </div>
    );
  }

  if (isGeocoding) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Location</h3>
            <p className="text-gray-600">Geocoding address and validating service area...</p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationResults) {
    const manualReviewResults = verificationResults.results.filter(r => r.status === 'manual-review');

    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Continue Button - Always shown after verification */}
        {onContinue && (
          <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-600 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {verificationResults.manualReviewCount === 0
                    ? '✅ All locations verified!'
                    : `⚠️ ${verificationResults.manualReviewCount} location(s) require manual review`
                  }
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {verificationResults.manualReviewCount === 0
                    ? 'Ready to proceed to pricing setup'
                    : 'You can review and approve/reject locations below, or continue to pricing setup'
                  }
                </p>
              </div>
              <button
                onClick={onContinue}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Pricing →
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Area Verification Results</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Processed</p>
                    <p className="text-2xl font-bold text-gray-900">{verificationResults.totalProcessed}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-600">Serviceable</p>
                    <p className="text-2xl font-bold text-green-900">{verificationResults.serviceableCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-red-600">Not Serviceable</p>
                    <p className="text-2xl font-bold text-red-900">{verificationResults.notServiceableCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Manual Review</p>
                    <p className="text-2xl font-bold text-yellow-900">{verificationResults.manualReviewCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Review Section */}
          {manualReviewResults.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Locations Requiring Manual Review ({manualReviewResults.length})
              </h3>
              <div className="space-y-4">
                {manualReviewResults.map((result) => (
                  <div key={result.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                          <h4 className="font-medium text-gray-900">{result.companyName || 'Unknown Company'}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {result.address}, {result.city}, {result.state} {result.zipCode}
                        </p>
                        <p className="text-sm text-yellow-700 mb-3">{result.reason}</p>
                        
                        {result.equipmentType && (
                          <div className="text-xs text-gray-500 space-y-1">
                            <p><span className="font-medium">Equipment:</span> {result.equipmentType} - {result.containerSize}</p>
                            <p><span className="font-medium">Frequency:</span> {result.frequency}</p>
                            <p><span className="font-medium">Material:</span> {result.materialType}</p>
                            {result.binQuantity && <p><span className="font-medium">Quantity:</span> {result.binQuantity}</p>}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setShowConfirmDialog({
                            isOpen: true,
                            locationId: result.id,
                            action: 'approve',
                            locationName: result.companyName || 'Unknown Company'
                          })}
                          disabled={loadingActions[result.id] !== null}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingActions[result.id] === 'approving' ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <ThumbsUp className="w-3 h-3 mr-1" />
                          )}
                          Approve
                        </button>
                        
                        <button
                          onClick={() => setShowConfirmDialog({
                            isOpen: true,
                            locationId: result.id,
                            action: 'reject',
                            locationName: result.companyName || 'Unknown Company'
                          })}
                          disabled={loadingActions[result.id] !== null}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingActions[result.id] === 'rejecting' ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <ThumbsDown className="w-3 h-3 mr-1" />
                          )}
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Results Table */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">All Verification Results</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Original Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bin Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Container Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipment Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Add-ons/Extras
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Division
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Region
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Franchise Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {verificationResults.results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(result.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(result.status)}`}>
                            {result.status === 'serviceable' ? 'serviceable' : 'not serviceable'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {`${result.address}, ${result.city}, ${result.state} ${result.zipCode}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.binQuantity || 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.containerSize || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.equipmentType || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.materialType || 'Solid Waste'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.frequency || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.addOns && result.addOns.length > 0 ? 
                          (Array.isArray(result.addOns) ? result.addOns.join(', ') : result.addOns) : 
                          ''
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.division || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.serviceRegion || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.franchiseFee !== undefined && result.franchiseFee !== null ? `${result.franchiseFee}%` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {result.status === 'serviceable' ? '' : (result.reason || 'Unknown reason')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

   {/* Manual Override Button */}
                  <div className="ml-4">
                    <button
                      onClick={() => toggleLocationStatus(result.id)}
                      className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                        result.status === 'serviceable'
                          ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                          : result.status === 'manual-review'
                          ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                          : 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                      }`}
                      data-location-id={result.id}
                      title={
                        result.status === 'serviceable' ? 'Mark as not serviceable' : 
                        result.status === 'manual-review' ? 'Mark as serviceable' :
                        'Mark for manual review'
                      }
                    >
                      {result.status === 'serviceable' ? (
                        <>
                          <XCircle className="h-4 w-4 mr-1" />
                          Mark Not Serviceable
                        </>
                      ) : result.status === 'manual-review' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Serviceable
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Mark for Review
                        </>
                      )}
                    </button>
                  </div>
              Franchised cities (like Mansfield) will use their specific municipal contract pricing automatically.
                </div>
              </div>
            ))}
          </div>

          {editableResults.filter(r => r.status === 'serviceable').length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              {hasManualOverrides && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You have manual overrides pending. Make sure to click "Apply Changes" above to save your modifications before continuing.
                  </p>
                </div>
              )}
              <button
                onClick={onContinue}
                disabled={hasManualOverrides}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors ${
                  hasManualOverrides 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Continue to Pricing Setup
                <MapPin className="h-5 w-5 ml-2" />
              </button>
              
              {editableResults.filter(r => r.status === 'manual-review').length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md relative group">
                  <p className="text-sm text-yellow-800">
                    <strong className="cursor-help">⚠️ Manual Review Required:</strong> {editableResults.filter(r => r.status === 'manual-review').length} location(s) require manual review before proceeding with quote generation.
                  </p>
                  
                  {/* Manual Review Locations Hover Tooltip */}
                  <div className="absolute bottom-full left-0 mb-2 w-full max-w-4xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="bg-white border-2 border-yellow-300 rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto">
                      <div className="flex items-center mb-3 pb-2 border-b border-yellow-200">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                        <h4 className="text-lg font-semibold text-yellow-800">
                          Locations Requiring Manual Review
                        </h4>
                        <span className="ml-auto bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                          {editableResults.filter(r => r.status === 'manual-review').length} locations
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {editableResults
                          .filter(r => r.status === 'manual-review')
                          .map((location, index) => (
                            <div
                              key={location.id}
                              data-location-id={location.id}
                              className="bg-white border border-yellow-200 rounded-lg p-4 shadow-sm"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 bg-yellow-200 text-yellow-800 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                                      {index + 1}
                                    </div>
                                    <h5 className="font-semibold text-gray-900 truncate">
                                      {location.companyName || `Location ${index + 1}`}
                                    </h5>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div>
                                      <p className="text-gray-600 mb-1">
                                        <span className="font-medium">Address:</span>
                                      </p>
                                      <p className="text-gray-900 leading-tight">
                                        {location.address}
                                      </p>
                                      <p className="text-gray-900">
                                        {location.city}, {location.state} {location.zipCode}
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <p className="text-gray-600 mb-1">
                                        <span className="font-medium">Review Reason:</span>
                                      </p>
                                      <p className="text-yellow-700 font-medium">
                                        {location.failureReason || 'Manual review required'}
                                      </p>
                                      
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Area Verification</h2>
          <p className="text-gray-600">
            Upload a file with location data or add a single location to verify service availability.
          </p>
        </div>

        <div className="p-6">
          {!showSingleLocationForm ? (
            <div className="space-y-6">
              {/* File Upload Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Location Data</h3>
                <FileUpload
                  onFileUpload={handleFileUpload}
                  accept=".csv,.xlsx,.xls"
                  title="Upload Location Data"
                  description="Upload a CSV or Excel file with location data including addresses, company names, and service requirements."
                />
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Single Location Button */}
              <div className="text-center">
                <button
                  onClick={() => setShowSingleLocationForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Single Location
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Single Location Form */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add Single Location</h3>
                  <button
                    onClick={() => setShowSingleLocationForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={singleLocationData.companyName}
                      onChange={(e) => setSingleLocationData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter company name"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      ref={setAddressInputRef}
                      type="text"
                      value={singleLocationData.address}
                      onChange={(e) => setSingleLocationData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter street address"
                      required
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={singleLocationData.city}
                      onChange={(e) => setSingleLocationData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      value={singleLocationData.state}
                      onChange={(e) => setSingleLocationData(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Texas">Texas</option>
                      <option value="Oklahoma">Oklahoma</option>
                      <option value="Arkansas">Arkansas</option>
                      <option value="Louisiana">Louisiana</option>
                    </select>
                  </div>

                  {/* ZIP Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={singleLocationData.zipCode}
                      onChange={(e) => setSingleLocationData(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter ZIP code"
                    />
                  </div>

                  {/* Equipment Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Equipment Type
                    </label>
                    <select
                      value={singleLocationData.equipmentType}
                      onChange={(e) => {
                        setSingleLocationData(prev => ({ 
                          ...prev, 
                          equipmentType: e.target.value,
                          containerSize: '8YD' // Reset to default when equipment type changes
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {EQUIPMENT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Container Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Container Size
                    </label>
                    <select
                      value={singleLocationData.containerSize}
                      onChange={(e) => setSingleLocationData(prev => ({ ...prev, containerSize: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {getContainerSizeOptions().map(size => (
                        <option key={size.value} value={size.value}>{size.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Frequency
                    </label>
                    <select
                      value={singleLocationData.frequency}
                      onChange={(e) => setSingleLocationData(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {FREQUENCY_OPTIONS.map(freq => (
                        <option key={freq.value} value={freq.value}>{freq.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Material Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material Type
                    </label>
                    <select
                      value={singleLocationData.materialType}
                      onChange={(e) => setSingleLocationData(prev => ({ ...prev, materialType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {MATERIAL_TYPES.map(material => (
                        <option key={material.value} value={material.value}>{material.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Bin Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bin Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={singleLocationData.binQuantity}
                      onChange={(e) => setSingleLocationData(prev => ({ ...prev, binQuantity: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSingleLocationSubmit}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Verify Location
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
