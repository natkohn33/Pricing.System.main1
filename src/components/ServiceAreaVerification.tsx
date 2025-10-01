import React, { useState, useCallback } from 'react';
import { ServiceAreaVerificationData, ServiceAreaResult } from '../types';
import { parseExcelFile, isExcelFile } from '../utils/excelParser';
import { parseCSV } from '../utils/csvParser';
import { ServiceAreaValidator } from '../utils/serviceAreaValidator';
import { parseServiceRequests, detectColumns, detectCSVHeaderRow } from '../utils/csvParser';
import { geocodeAddress, GeocodingResult } from '../utils/mapboxGeocoding';
import { FileUpload } from './FileUpload';
import { MapPin, Upload, CheckCircle, XCircle, AlertTriangle, ArrowRight, Plus, Trash2, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { CONTAINER_SIZES, FREQUENCY_OPTIONS, EQUIPMENT_TYPES, MATERIAL_TYPES } from '../data/divisions';

interface ServiceAreaVerificationProps {
  onVerificationComplete: (verification: ServiceAreaVerificationData) => void;
  onContinue: () => void;
  onFileNameUpdate: (fileName: string) => void;
}

export function ServiceAreaVerification({ onVerificationComplete, onContinue, onFileNameUpdate }: ServiceAreaVerificationProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [verificationResults, setVerificationResults] = useState<ServiceAreaVerificationData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showSingleLocationForm, setShowSingleLocationForm] = useState(false);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [addressInputRef, setAddressInputRef] = useState<HTMLInputElement | null>(null);
  
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
  
  // Override state
  const [selectedOverrideId, setSelectedOverrideId] = useState<string | null>(null);
  const [showOverrideDialog, setShowOverrideDialog] = useState<{
    isOpen: boolean;
    locationId: string;
    locationName: string;
    locationAddress: string;
    originalFailureReason: string;
  } | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideJustification, setOverrideJustification] = useState('');
  
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
        console.log('🗺️ Google Maps API not ready yet, retrying...');
        return false;
      }

      console.log('🗺️ Initializing Google Places Autocomplete...');
      
      const autocompleteInstance = new window.google.maps.places.Autocomplete(addressInputRef, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address', 'geometry']
      });

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        console.log('📍 Place selected:', place);
        
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
          
          console.log('📍 Google Places autocomplete result:', {
            fullAddress,
            city,
            state,
            zipCode
          });
        }
      });
      
      setAutocomplete(autocompleteInstance);
      console.log('✅ Google Places Autocomplete initialized successfully');
      return true;
    };

    // Try to initialize immediately
    if (!initializeAutocomplete()) {
      // If not ready, retry every 500ms for up to 10 seconds
      let retryCount = 0;
      const maxRetries = 20;
      
      const retryInterval = setInterval(() => {
        retryCount++;
        console.log(`🔄 Retry ${retryCount}/${maxRetries} - Attempting to initialize Google Places Autocomplete...`);
        
        if (initializeAutocomplete() || retryCount >= maxRetries) {
          clearInterval(retryInterval);
          if (retryCount >= maxRetries) {
            console.warn('⚠️ Failed to initialize Google Places Autocomplete after maximum retries');
          }
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
        { value: '3YD', label: '3 Yard' },
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

  const parseLocationRequestsFromData = (data: string[][], fileName: string) => {
    // Detect header row and columns
    const headerRowIndex = detectCSVHeaderRow(data);
    const csvData = data.slice(headerRowIndex);
    const headers = csvData[0];
    const columnMapping = detectColumns(headers);
    
    // Parse service requests using the detected structure
    const locationRequests = parseServiceRequests(csvData, columnMapping, headerRowIndex);
    return locationRequests;
  };

  const handleFileUpload = useCallback(async (file: File) => {
    setUploadedFile(file);
    onFileNameUpdate(file.name);
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      let data: string[][];
      
      if (isExcelFile(file)) {
        console.log('📊 Processing Excel file...');
        const excelResult = await parseExcelFile(file);
        data = excelResult.data;
      } else {
        console.log('📄 Processing CSV file...');
        const text = await file.text();
        data = parseCSV(text);
      }
      
      console.log('📋 Parsed data:', {
        rows: data.length,
        columns: data[0]?.length || 0,
        headers: data[0],
        sampleData: data.slice(0, 3)
      });
      
      // Parse location requests
      const locationRequests = parseLocationRequestsFromData(data, file.name);
      setGeocodingProgress(0);
      
      for (let i = 0; i < locationRequests.length; i++) {
        const request = locationRequests[i];
        setGeocodingProgress(Math.round(((i + 1) / locationRequests.length) * 50)); // First 50% for geocoding
        
        try {
          const fullAddress = `${request.address}, ${request.city}, ${request.state} ${request.zipCode}`;
          console.log(`🗺️ Geocoding ${i + 1}/${locationRequests.length}: ${fullAddress}`);
          
          const geocodingResult = await geocodeAddress(fullAddress);
          
          if (geocodingResult) {
            request.latitude = geocodingResult.latitude;
            request.longitude = geocodingResult.longitude;
            console.log(`✅ Geocoded: ${fullAddress} -> [${geocodingResult.latitude}, ${geocodingResult.longitude}]`);
          } else {
            console.warn(`❌ Failed to geocode: ${fullAddress}`);
            request.latitude = null;
            request.longitude = null;
          }
          
          // Rate limiting: 100ms delay between requests for Mapbox (much faster than Nominatim)
          if (i < locationRequests.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
        } catch (error) {
          console.error(`❌ Geocoding error for ${request.address}:`, error);
          request.latitude = null;
          request.longitude = null;
        }
      }
      
      console.log('🗺️ Batch geocoding complete with Mapbox');
      
      // Process each location
      const results: ServiceAreaResult[] = [];
      
      for (let i = 0; i < locationRequests.length; i++) {
        const request = locationRequests[i];
        setProcessingProgress(50 + Math.round(((i + 1) / locationRequests.length) * 50)); // Second 50% for validation
        
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
      
      console.log('✅ Service area verification complete:', {
        total: verification.totalProcessed,
        serviceable: verification.serviceableCount,
        notServiceable: verification.notServiceableCount,
        manualReview: verification.manualReviewCount
      });
      
    } catch (error) {
      console.error('❌ Error processing file:', error);
      console.error('❌ Error details:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined
      });
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
        console.log('🌍 Geocoding single location:', fullAddress);
        
        const geocodingResult = await geocodeAddress(fullAddress);
        
        let latitude: number | null = null;
        let longitude: number | null = null;
        
        if (geocodingResult) {
          latitude = geocodingResult.latitude;
          longitude = geocodingResult.longitude;
          console.log('✅ Single location geocoded:', {
            address: fullAddress,
            coordinates: [latitude, longitude],
            displayName: geocodingResult.displayName
          });
        } else {
          console.warn('❌ Failed to geocode single location:', fullAddress);
        }
        
        // Proceed with validation using geocoded coordinates
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
        onFileNameUpdate('Single Location Entry');
        
      } catch (error) {
        console.error('❌ Error processing single location:', error);
        alert('Error processing location. Please check the address and try again.');
      } finally {
        setIsGeocoding(false);
      }
    };

    processLocation();
  };

  // Manual review workflow functions
  const handleManualReviewClick = (locationId: string) => {
    setSelectedManualReviewId(selectedManualReviewId === locationId ? null : locationId);
  };

  const handleApproveLocation = async (locationId: string) => {
    const location = verificationResults?.results.find(r => r.id === locationId);
    if (!location) return;

    setShowConfirmDialog({
      isOpen: true,
      locationId,
      action: 'approve',
      locationName: location.companyName || location.address
    });
  };

  const handleRejectLocation = async (locationId: string) => {
    const location = verificationResults?.results.find(r => r.id === locationId);
    if (!location) return;

    setShowConfirmDialog({
      isOpen: true,
      locationId,
      action: 'reject',
      locationName: location.companyName || location.address
    });
  };

  const confirmAction = async () => {
    if (!showConfirmDialog || !verificationResults) return;

    const { locationId, action } = showConfirmDialog;
    
    setLoadingActions(prev => ({ ...prev, [locationId]: action === 'approve' ? 'approving' : 'rejecting' }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the location status
      const updatedResults = verificationResults.results.map(result => {
        if (result.id === locationId) {
          return {
            ...result,
            status: action === 'approve' ? 'serviceable' as const : 'not-serviceable' as const,
            failureReason: action === 'reject' ? 'Manually rejected during review' : undefined,
            division: action === 'approve' ? (result.division || 'Manual Approval') : undefined
          };
        }
        return result;
      });

      // Recalculate counts
      const updatedVerification: ServiceAreaVerificationData = {
        totalProcessed: updatedResults.length,
        serviceableCount: updatedResults.filter(r => r.status === 'serviceable').length,
        notServiceableCount: updatedResults.filter(r => r.status === 'not-serviceable').length,
        manualReviewCount: updatedResults.filter(r => r.status === 'manual-review').length,
        results: updatedResults
      };

      setVerificationResults(updatedVerification);
      onVerificationComplete(updatedVerification);
      setSelectedManualReviewId(null);
      
      console.log(`✅ Location ${action === 'approve' ? 'approved' : 'rejected'}:`, locationId);
      
    } catch (error) {
      console.error(`❌ Error ${action === 'approve' ? 'approving' : 'rejecting'} location:`, error);
      alert(`Failed to ${action} location. Please try again.`);
    } finally {
      setLoadingActions(prev => ({ ...prev, [locationId]: null }));
      setShowConfirmDialog(null);
    }
  };

  const cancelAction = () => {
    setShowConfirmDialog(null);
  };

  // Override functions
  const handleOverrideClick = (locationId: string) => {
    setSelectedOverrideId(selectedOverrideId === locationId ? null : locationId);
  };

  const handleOverrideLocation = async (locationId: string) => {
    const location = verificationResults?.results.find(r => r.id === locationId);
    if (!location) return;

    setShowOverrideDialog({
      isOpen: true,
      locationId,
      locationName: location.companyName || location.address,
      locationAddress: `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`,
      originalFailureReason: location.failureReason || 'Unknown reason'
    });
  };

  const confirmOverride = async () => {
    if (!showOverrideDialog || !verificationResults) return;

    const { locationId } = showOverrideDialog;
    
    setLoadingActions(prev => ({ ...prev, [locationId]: 'approving' }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the location status
      const updatedResults = verificationResults.results.map(result => {
        if (result.id === locationId) {
          return {
            ...result,
            status: 'serviceable' as const,
            failureReason: undefined,
            division: 'Override Approval',
            overrideReason,
            overrideJustification: overrideReason === 'Other' ? overrideJustification : undefined
          };
        }
        return result;
      });

      // Recalculate counts
      const updatedVerification: ServiceAreaVerificationData = {
        totalProcessed: updatedResults.length,
        serviceableCount: updatedResults.filter(r => r.status === 'serviceable').length,
        notServiceableCount: updatedResults.filter(r => r.status === 'not-serviceable').length,
        manualReviewCount: updatedResults.filter(r => r.status === 'manual-review').length,
        results: updatedResults
      };

      setVerificationResults(updatedVerification);
      onVerificationComplete(updatedVerification);
      setSelectedOverrideId(null);
      
      console.log(`✅ Location override approved:`, locationId);
      
    } catch (error) {
      console.error(`❌ Error overriding location:`, error);
      alert(`Failed to override location. Please try again.`);
    } finally {
      setLoadingActions(prev => ({ ...prev, [locationId]: null }));
      setShowOverrideDialog(null);
      setOverrideReason('');
      setOverrideJustification('');
    }
  };

  const cancelOverride = () => {
    setShowOverrideDialog(null);
    setOverrideReason('');
    setOverrideJustification('');
  };

  const clearFile = () => {
    setUploadedFile(null);
    setVerificationResults(null);
    onFileNameUpdate('');
  };

  const handleEquipmentTypeChange = (equipmentType: string) => {
    setSingleLocationData(prev => ({
      ...prev,
      equipmentType,
      // Reset container size when equipment type changes to ensure valid combination
      containerSize: equipmentType === 'Front-Load Container' ? '8YD' :
                   equipmentType === 'Compactor' ? '15YD' : 
                   equipmentType === 'Roll-off' ? '20YD' : '8YD'
    }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <MapPin className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Service Area Verification</h2>
            <p className="text-gray-600 mt-1">
              Verify service availability for your locations and gather service requirements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bulk Upload Option */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Bulk Upload</h3>
            <p className="text-gray-600 text-sm">
              Upload a CSV or Excel file with multiple locations for bulk verification
            </p>
            
            {!uploadedFile ? (
              <FileUpload
                onFileUpload={handleFileUpload}
                title="Upload Location Data"
                description="CSV or Excel file with addresses, service requirements, and location details"
                uploadedFile={uploadedFile}
                onClearFile={clearFile}
              />
            ) : (
              <FileUpload
                onFileUpload={handleFileUpload}
                title="Location Data Uploaded"
                description="File processed successfully"
                uploadedFile={uploadedFile}
                onClearFile={clearFile}
              />
            )}
          </div>

          {/* Single Location Option */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Single Location</h3>
            <p className="text-gray-600 text-sm">
              Enter details for a single location manually
            </p>
            
            <button
              onClick={() => setShowSingleLocationForm(!showSingleLocationForm)}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              {showSingleLocationForm ? 'Hide' : 'Show'} Single Location Form
            </button>
          </div>
        </div>

        {/* Single Location Form */}
        {showSingleLocationForm && (
          <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Single Location Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={singleLocationData.companyName}
                  onChange={(e) => setSingleLocationData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  ref={setAddressInputRef}
                  type="text"
                  value={singleLocationData.address}
                  onChange={(e) => setSingleLocationData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  id="address-autocomplete-input"
                  placeholder="Enter street address"
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Start typing to see address suggestions from Google Places
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={singleLocationData.city}
                  onChange={(e) => setSingleLocationData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  value={singleLocationData.state}
                  onChange={(e) => setSingleLocationData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Texas">Texas</option>
                  <option value="Oklahoma">Oklahoma</option>
                  <option value="Louisiana">Louisiana</option>
                  <option value="Arkansas">Arkansas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={singleLocationData.zipCode}
                  onChange={(e) => setSingleLocationData(prev => ({ ...prev, zipCode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter zip code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Type
                </label>
                <select
                  value={singleLocationData.equipmentType}
                  onChange={(e) => handleEquipmentTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {EQUIPMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Container Size
                </label>
                <select
                  value={singleLocationData.containerSize}
                  onChange={(e) => setSingleLocationData(prev => ({ ...prev, containerSize: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {getContainerSizeOptions().map(size => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={singleLocationData.frequency}
                  onChange={(e) => setSingleLocationData(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {FREQUENCY_OPTIONS.map(freq => (
                    <option key={freq.value} value={freq.value}>{freq.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Type
                </label>
                <select
                  value={singleLocationData.materialType}
                  onChange={(e) => setSingleLocationData(prev => ({ ...prev, materialType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {MATERIAL_TYPES.map(material => (
                    <option key={material.value} value={material.value}>{material.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bin Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={singleLocationData.binQuantity}
                  onChange={(e) => setSingleLocationData(prev => ({ ...prev, binQuantity: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleSingleLocationSubmit}
              disabled={isGeocoding}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {isGeocoding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Geocoding...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Single Location
                </>
              )}
            </button>
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <div className="mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-800 font-medium">
                  {processingProgress <= 50 ? 'Geocoding addresses...' : 'Processing locations...'} {processingProgress}%
                </span>
              </div>
              <div className="bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              {processingProgress <= 50 && (
                <p className="text-xs text-blue-600 mt-2">
                  Using Mapbox geocoding service for accurate location data
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Geocoding Status for Single Location */}
        {isGeocoding && (
          <div className="mt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                <span className="text-green-800 font-medium">Geocoding address...</span>
              </div>
              <p className="text-xs text-green-600">
                Processing address geocoding...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Verification Results */}
      {verificationResults && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{verificationResults.totalProcessed}</div>
              <div className="text-sm text-blue-700">Total Processed</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{verificationResults.serviceableCount}</div>
              <div className="text-sm text-green-700">Serviceable</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{verificationResults.manualReviewCount}</div>
              <div className="text-sm text-yellow-700">Manual Review</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{verificationResults.notServiceableCount}</div>
              <div className="text-sm text-red-700">Not Serviceable</div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="space-y-4">
            {verificationResults.results.filter(r => r.status === 'serviceable').length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-green-800 mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Serviceable Locations ({verificationResults.results.filter(r => r.status === 'serviceable').length})
                </h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {verificationResults.results.filter(r => r.status === 'serviceable').map((result) => (
                    <div key={result.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-green-900">{result.companyName}</p>
                          <p className="text-green-700 text-sm">{result.address}, {result.city}, {result.state} {result.zipCode}</p>
                          {result.equipmentType && (
                            <p className="text-green-600 text-xs mt-1">
                              Service: {result.containerSize} {result.equipmentType} - {result.frequency} - {result.materialType}
                              {result.binQuantity && result.binQuantity > 1 && ` (${result.binQuantity} bins)`}
                            </p>
                          )}
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {result.division || 'Serviceable'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {verificationResults.results.filter(r => r.status === 'manual-review').length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-yellow-800 mb-2 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Manual Review Required ({verificationResults.results.filter(r => r.status === 'manual-review').length})
                </h4>
                <p className="text-sm text-yellow-700 mb-4">
                  Click on any location below to approve or reject it for service
                </p>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {verificationResults.results.filter(r => r.status === 'manual-review').map((result) => (
                    <div 
                      key={result.id} 
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedManualReviewId === result.id 
                          ? 'bg-yellow-100 border-yellow-400 shadow-md' 
                          : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300 hover:shadow-sm'
                      }`}
                      onClick={() => handleManualReviewClick(result.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Review location: ${result.companyName || result.address}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleManualReviewClick(result.id);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-yellow-900">{result.companyName}</p>
                          <p className="text-yellow-700 text-sm">{result.address}, {result.city}, {result.state} {result.zipCode}</p>
                          <p className="text-yellow-600 text-xs mt-1">{result.failureReason}</p>
                          {result.equipmentType && (
                            <p className="text-yellow-600 text-xs mt-1">
                              Service: {result.containerSize} {result.equipmentType} - {result.frequency} - {result.materialType}
                              {result.binQuantity && result.binQuantity > 1 && ` (${result.binQuantity} bins)`}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Manual Review
                          </span>
                          {selectedManualReviewId === result.id && (
                            <span className="text-xs text-yellow-600">Click to review</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action buttons - shown when location is selected */}
                      {selectedManualReviewId === result.id && (
                        <div className="mt-4 pt-3 border-t border-yellow-300">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-yellow-800">
                              Review this location for service availability:
                            </p>
                            <div className="flex space-x-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveLocation(result.id);
                                }}
                                disabled={loadingActions[result.id] === 'approving'}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label={`Approve ${result.companyName || result.address} for service`}
                              >
                                {loadingActions[result.id] === 'approving' ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                )}
                                Approve
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRejectLocation(result.id);
                                }}
                                disabled={loadingActions[result.id] === 'rejecting'}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label={`Mark ${result.companyName || result.address} as not serviceable`}
                              >
                                {loadingActions[result.id] === 'rejecting' ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                )}
                                Not Serviceable
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-yellow-600 mt-2">
                            Approving will mark this location as serviceable and include it in quote generation. 
                            Rejecting will exclude it from service.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {verificationResults.results.filter(r => r.status === 'not-serviceable').length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-red-800 mb-2 flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  Not Serviceable Locations ({verificationResults.results.filter(r => r.status === 'not-serviceable').length})
                </h4>
                <p className="text-sm text-red-700 mb-4">
                  Click on any location below to override the "not serviceable" determination
                </p>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {verificationResults.results.filter(r => r.status === 'not-serviceable').map((result) => (
                    <div 
                      key={result.id} 
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedOverrideId === result.id 
                          ? 'bg-red-100 border-red-400 shadow-md' 
                          : 'bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300 hover:shadow-sm'
                      }`}
                      onClick={() => handleOverrideClick(result.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Override location: ${result.companyName || result.address}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOverrideClick(result.id);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-red-900">{result.companyName}</p>
                          <p className="text-red-700 text-sm">{result.address}, {result.city}, {result.state} {result.zipCode}</p>
                          <p className="text-red-600 text-xs mt-1">{result.failureReason}</p>
                          {result.equipmentType && (
                            <p className="text-red-600 text-xs mt-1">
                              Service: {result.containerSize} {result.equipmentType} - {result.frequency} - {result.materialType}
                              {result.binQuantity && result.binQuantity > 1 && ` (${result.binQuantity} bins)`}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Not Serviceable
                          </span>
                          {selectedOverrideId === result.id && (
                            <span className="text-xs text-red-600">Click to override</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Override action buttons - shown when location is selected */}
                      {selectedOverrideId === result.id && (
                        <div className="mt-4 pt-3 border-t border-red-300">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-red-800">
                              Override this "not serviceable" determination:
                            </p>
                            <div className="flex space-x-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOverrideLocation(result.id);
                                }}
                                disabled={loadingActions[result.id] === 'approving'}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label={`Override ${result.companyName || result.address} for service`}
                              >
                                {loadingActions[result.id] === 'approving' ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                )}
                                Approve Override
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-red-600 mt-2">
                            Overriding will mark this location as serviceable despite being outside normal service areas. 
                            You will be asked to provide a business justification.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Continue Button */}
          {verificationResults.serviceableCount > 0 && (
            <div className="mt-6 flex justify-end relative z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🚀 Continue to Pricing Setup button clicked');
                  onContinue();
                }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors cursor-pointer"
              >
                Continue to Pricing Setup
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm {showConfirmDialog.action === 'approve' ? 'Approval' : 'Rejection'}
              </h3>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  showConfirmDialog.action === 'approve' 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {showConfirmDialog.action === 'approve' ? (
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <ThumbsDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Are you sure you want to {showConfirmDialog.action === 'approve' ? 'approve' : 'reject'} this location?
                  </p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">
                    {showConfirmDialog.locationName}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {showConfirmDialog.action === 'approve' 
                      ? 'This location will be marked as serviceable and included in quote generation.'
                      : 'This location will be marked as not serviceable and excluded from service.'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={cancelAction}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  showConfirmDialog.action === 'approve'
                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                }`}
              >
                {showConfirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Override Dialog */}
      {showOverrideDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Service Area Override Request
              </h3>
            </div>
            
            <div className="px-6 py-6">
              {/* Warning Notice */}
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-orange-800 mb-2">
                      Override Warning
                    </h4>
                    <p className="text-sm text-orange-700">
                      You are about to approve service for a location that was automatically determined to be 
                      outside our normal service area. Please provide a business justification for this override.
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Location Details</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{showOverrideDialog.locationName}</p>
                  <p className="text-gray-700 text-sm">{showOverrideDialog.locationAddress}</p>
                  <p className="text-red-600 text-sm mt-2">
                    <strong>Original Reason:</strong> {showOverrideDialog.originalFailureReason}
                  </p>
                </div>
              </div>

              {/* Override Reason Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Override Reason *
                </label>
                <select
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select a reason...</option>
                  <option value="Special business arrangement">Special business arrangement</option>
                  <option value="Expansion into new territory">Expansion into new territory</option>
                  <option value="High-value customer">High-value customer</option>
                  <option value="Strategic location">Strategic location</option>
                  <option value="Pilot program">Pilot program</option>
                  <option value="Management directive">Management directive</option>
                  <option value="Service area boundary adjustment">Service area boundary adjustment</option>
                  <option value="Other">Other (specify below)</option>
                </select>
              </div>

              {/* Additional Justification */}
              {overrideReason === 'Other' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Justification *
                  </label>
                  <textarea
                    value={overrideJustification}
                    onChange={(e) => setOverrideJustification(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Please provide detailed justification for this override..."
                  />
                </div>
              )}

              {/* Audit Information */}
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Audit Information</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>• Override will be logged with timestamp and user information</p>
                  <p>• Original determination reason will be preserved for audit trail</p>
                  <p>• This decision can be reviewed in management reports</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={cancelOverride}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmOverride}
                disabled={!overrideReason || (overrideReason === 'Other' && !overrideJustification.trim())}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Approve Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}