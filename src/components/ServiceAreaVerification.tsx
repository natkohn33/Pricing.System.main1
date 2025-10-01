import React, { useState, useCallback } from 'react';
import { ServiceAreaVerificationData, ServiceAreaResult } from '../types';
import { parseExcelFile, isExcelFile } from '../utils/excelParser';
import { parseCSV } from '../utils/csvParser';
import { ServiceAreaValidator } from '../utils/serviceAreaValidator';
import { geocodeAddress, GeocodingResult } from '../utils/mapboxGeocoding';
import { FileUpload } from './FileUpload';
import { MapPin, Upload, CheckCircle, XCircle, AlertTriangle, ArrowRight, Plus, Trash2, ThumbsUp, ThumbsDown, Loader2, Database } from 'lucide-react';
import { CONTAINER_SIZES, FREQUENCY_OPTIONS, EQUIPMENT_TYPES, MATERIAL_TYPES } from '../data/divisions';
import { VerificationService } from '../services/verificationService';

interface ServiceAreaVerificationProps {
  onVerificationComplete: (verification: ServiceAreaVerificationData) => void;
  onContinue?: () => void;
  onFileNameUpdate: (fileName: string) => void;
}

export function ServiceAreaVerification({ onVerificationComplete, onContinue, onFileNameUpdate }: ServiceAreaVerificationProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [verificationResults, setVerificationResults] = useState<ServiceAreaVerificationData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
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

  // Helper function to save verification results to database
  const saveVerificationToDatabase = async (verification: ServiceAreaVerificationData, fileName: string) => {
    setIsSavingToDb(true);
    try {
      console.log('💾 Saving verification results to database...');
      const { sessionId: newSessionId, error } = await VerificationService.saveVerificationSession(
        fileName,
        verification
      );

      if (error) {
        console.error('❌ Failed to save to database:', error);
        // Don't block the workflow if database save fails
        alert('Warning: Failed to save results to database. You can continue with pricing.');
      } else if (newSessionId) {
        console.log('✅ Results saved to database. Session ID:', newSessionId);
        setSessionId(newSessionId);
      }
    } catch (error) {
      console.error('❌ Unexpected error saving to database:', error);
    } finally {
      setIsSavingToDb(false);
    }
  };

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

  const handleFileUpload = useCallback(async (file: File) => {
    console.log('📁 FILE UPLOAD STARTED:', { fileName: file.name, fileSize: file.size });
    
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
      const locationRequests = validator.parseLocationRequestsFromData(data, file.name);
      console.log('📍 Parsed location requests:', locationRequests.length);
      
      // Geocode all addresses before processing
      console.log('🗺️ Starting batch geocoding with Mapbox for', locationRequests.length, 'locations...');
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
      
      console.log('🔍 VERIFICATION COMPLETE - SETTING STATE:', {
        verification: verification,
        manualReviewCount: verification.manualReviewCount,
        aboutToSetVerificationResults: true
      });
      
      setVerificationResults(verification);
      
      console.log('🔍 CALLING onVerificationComplete callback:', {
        verification: verification,
        onVerificationCompleteExists: !!onVerificationComplete
      });
      
      onVerificationComplete(verification);
      onFileNameUpdate(file.name);

      // Save to database asynchronously
      saveVerificationToDatabase(verification, file.name);

      console.log('🔍 File upload verification completed and callbacks called', {
        verification: verification,
        manualReviewCount: verification.manualReviewCount,
        onVerificationCompleteExists: !!onVerificationComplete,
        onFileNameUpdateExists: !!onFileNameUpdate
      });
      
      console.log('✅ Service area verification complete:', {
        total: verification.totalProcessed,
        serviceable: verification.serviceableCount,
        notServiceable: verification.notServiceableCount,
        manualReview: verification.manualReviewCount
      });
      
    } catch (error) {
      console.error('❌ Error processing file:', error);
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

    console.log('📍 SINGLE LOCATION SUBMIT STARTED:', singleLocationData);

    setIsGeocoding(true);
    
    const processLocation = async () => {
      try {
        // Geocode the address first
        const fullAddress = `${singleLocationData.address}, ${singleLocationData.city}, ${singleLocationData.state} ${singleLocationData.zipCode}`;
        
        console.log('🗺️ Geocoding single location:', fullAddress);
        const geocodingResult = await geocodeAddress(fullAddress);
        
        let latitude: number | null = null;
        let longitude: number | null = null;
        
        if (geocodingResult) {
          latitude = geocodingResult.latitude;
          longitude = geocodingResult.longitude;
          console.log(`✅ Geocoded: ${fullAddress} -> [${latitude}, ${longitude}]`);
        } else {
          console.warn(`❌ Failed to geocode: ${fullAddress}`);
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
        
        console.log('🔍 SINGLE LOCATION VERIFICATION COMPLETE - SETTING STATE:', {
          verification: verification,
          manualReviewCount: verification.manualReviewCount,
          aboutToSetVerificationResults: true
        });
        
        setVerificationResults(verification);
        
        console.log('🔍 CALLING onVerificationComplete callback for single location:', {
          verification: verification,
          onVerificationCompleteExists: !!onVerificationComplete
        });
        
        onVerificationComplete(verification);
        const locationFileName = `Single Location - ${singleLocationData.companyName || 'Unknown'}`;
        onFileNameUpdate(locationFileName);

        // Save to database asynchronously
        saveVerificationToDatabase(verification, locationFileName);

        console.log('🔍 Single location verification completed and callbacks called', {
          verification: verification,
          manualReviewCount: verification.manualReviewCount,
          onVerificationCompleteExists: !!onVerificationComplete,
          onFileNameUpdateExists: !!onFileNameUpdate
        });
        
        console.log('✅ Single location verification complete:', result);
        
      } catch (error) {
        console.error('❌ Error processing single location:', error);
        alert('Error processing location. Please try again.');
      } finally {
        setIsGeocoding(false);
      }
    };
    
    processLocation();
  };

  const handleManualReviewAction = async (locationId: string, action: 'approve' | 'reject') => {
    if (!verificationResults) return;
    
    setLoadingActions(prev => ({ ...prev, [locationId]: action === 'approve' ? 'approving' : 'rejecting' }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedResults = verificationResults.results.map(result => {
        if (result.id === locationId) {
          return {
            ...result,
            status: action === 'approve' ? 'serviceable' as const : 'not-serviceable' as const,
            reason: action === 'approve' ? 'Manually approved' : 'Manually rejected'
          };
        }
        return result;
      });
      
      const updatedVerification: ServiceAreaVerificationData = {
        totalProcessed: updatedResults.length,
        serviceableCount: updatedResults.filter(r => r.status === 'serviceable').length,
        notServiceableCount: updatedResults.filter(r => r.status === 'not-serviceable').length,
        manualReviewCount: updatedResults.filter(r => r.status === 'manual-review').length,
        results: updatedResults
      };
      
      setVerificationResults(updatedVerification);
      onVerificationComplete(updatedVerification);
      
      console.log(`✅ Location ${locationId} ${action}d successfully`);
      
    } catch (error) {
      console.error(`❌ Error ${action}ing location:`, error);
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
    console.log('🔍 RENDERING VERIFICATION RESULTS:', {
      verificationResults: verificationResults,
      manualReviewCount: verificationResults.manualReviewCount,
      hasOnContinue: !!onContinue,
      shouldShowContinueButton: !!onContinue
    });

    const manualReviewResults = verificationResults.results.filter(r => r.status === 'manual-review');

    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Continue Button - Always shown after verification */}
        {onContinue && (
          <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-600 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
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
                {isSavingToDb && (
                  <div className="flex items-center mt-2 text-sm text-blue-600">
                    <Database className="w-4 h-4 mr-2 animate-pulse" />
                    <span>Saving to database...</span>
                  </div>
                )}
                {sessionId && !isSavingToDb && (
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <Database className="w-4 h-4 mr-2" />
                    <span>Saved to database (Session: {sessionId.substring(0, 8)}...)</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  console.log('🔵 Continue to Pricing button clicked!', {
                    onContinueExists: !!onContinue,
                    event: e,
                    timestamp: new Date().toISOString()
                  });
                  if (onContinue) {
                    onContinue();
                    console.log('🔵 onContinue callback invoked successfully');
                  } else {
                    console.error('🔴 onContinue callback is not defined!');
                  }
                }}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer pointer-events-auto"
                style={{ pointerEvents: 'auto' }}
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


          {/* Manual Review Optional Message */}
          {verificationResults.manualReviewCount > 0 && (
            <div className="p-6 border-t border-gray-200 bg-yellow-50">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <p className="text-sm text-yellow-800">
                  {verificationResults.manualReviewCount} location(s) flagged for manual review. You can approve/reject them above or continue to pricing setup.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                  showConfirmDialog.action === 'approve' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {showConfirmDialog.action === 'approve' ? (
                    <ThumbsUp className={`h-6 w-6 text-green-600`} />
                  ) : (
                    <ThumbsDown className={`h-6 w-6 text-red-600`} />
                  )}
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                  {showConfirmDialog.action === 'approve' ? 'Approve Location' : 'Reject Location'}
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to {showConfirmDialog.action} "{showConfirmDialog.locationName}"?
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    onClick={() => handleManualReviewAction(showConfirmDialog.locationId, showConfirmDialog.action)}
                    className={`px-4 py-2 ${
                      showConfirmDialog.action === 'approve' 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-red-500 hover:bg-red-600'
                    } text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      showConfirmDialog.action === 'approve' 
                        ? 'focus:ring-green-500' 
                        : 'focus:ring-red-500'
                    } mr-2`}
                  >
                    {showConfirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
                  </button>
                  <button
                    onClick={() => setShowConfirmDialog(null)}
                    className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

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