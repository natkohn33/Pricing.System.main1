import React, { useState, useEffect, useCallback } from 'react';
import { ServiceAreaVerificationData, ServiceAreaResult } from '../types';
import { ServiceAreaValidator } from '../utils/serviceAreaValidator';
import { parseExcelFile, isExcelFile } from '../utils/excelParser';
import { parseCSV } from '../utils/csvParser';
import { geocodeAddress } from '../utils/mapboxGeocoding';
import { FileUpload } from './FileUpload';
import { 
  MapPin, 
  Upload, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  ThumbsUp, 
  ThumbsDown, 
  Loader2 
} from 'lucide-react';
import { 
  CONTAINER_SIZES, 
  FREQUENCY_OPTIONS, 
  EQUIPMENT_TYPES, 
  MATERIAL_TYPES 
} from '../data/divisions';

interface ServiceAreaVerificationProps {
  onVerificationComplete: (verification: ServiceAreaVerificationData) => void;
  onContinue?: () => void;
  onFileNameUpdate: (fileName: string) => void;
}

export function ServiceAreaVerification({ 
  onVerificationComplete, 
  onContinue, 
  onFileNameUpdate 
}: ServiceAreaVerificationProps) {
  // State Management
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [verificationResults, setVerificationResults] = useState<ServiceAreaVerificationData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showSingleLocationForm, setShowSingleLocationForm] = useState(false);
  const [addressInputRef, setAddressInputRef] = useState<HTMLInputElement | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  // Manual review state
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

  // Initialize validator
  const validator = new ServiceAreaValidator();

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

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    setUploadedFile(file);
    onFileNameUpdate(file.name);
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      let data: string[][];
      
      if (isExcelFile(file)) {
        const excelResult = await parseExcelFile(file);
        data = excelResult.data;
      } else {
        const text = await file.text();
        data = parseCSV(text);
      }
      
      // Parse location requests from data
      const locationRequests = validator.parseLocationRequestsFromData(data, file.name);
      
      // Process each location with geocoding
      const results: ServiceAreaResult[] = [];
      
      for (let i = 0; i < locationRequests.length; i++) {
        const request = locationRequests[i];
        setProcessingProgress(Math.round(((i + 1) / locationRequests.length) * 100));
        
        // Geocode address
        let latitude: number | null = null;
        let longitude: number | null = null;
        
        try {
          const fullAddress = `${request.address}, ${request.city}, ${request.state} ${request.zipCode}`;
          const geocodingResult = await geocodeAddress(fullAddress);
          
          if (geocodingResult) {
            latitude = geocodingResult.latitude;
            longitude = geocodingResult.longitude;
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        }
        
        // Validate location
        const result = await validator.validateLocation(
          request.id,
          request.address,
          request.city,
          request.state,
          request.zipCode,
          request.companyName,
          latitude,
          longitude,
          request.equipmentType,
          request.containerSize,
          request.frequency,
          request.materialType,
          request.addOns,
          request.binQuantity
        );
        
        results.push(result);
        
        // Rate limiting
        if (i < locationRequests.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Create verification data
      const verification: ServiceAreaVerificationData = {
        totalProcessed: results.length,
        serviceableCount: results.filter(r => r.status === 'serviceable').length,
        notServiceableCount: results.filter(r => r.status === 'not-serviceable').length,
        manualReviewCount: results.filter(r => r.status === 'manual-review').length,
        results
      };
      
      setVerificationResults(verification);
      onVerificationComplete(verification);
      
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please check the format and try again.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [onVerificationComplete, onFileNameUpdate]);

  // Handle single location submission
  const handleSingleLocationSubmit = async () => {
    if (!singleLocationData.address || !singleLocationData.city) {
      alert('Please fill in all required fields (Address, City)');
      return;
    }

    setIsGeocoding(true);
    
    try {
      const fullAddress = `${singleLocationData.address}, ${singleLocationData.city}, ${singleLocationData.state} ${singleLocationData.zipCode}`;
      
      // Geocode the address
      let latitude: number | null = null;
      let longitude: number | null = null;
      
      try {
        const geocodingResult = await geocodeAddress(fullAddress);
        if (geocodingResult) {
          latitude = geocodingResult.latitude;
          longitude = geocodingResult.longitude;
        }
      } catch (error) {
        console.error('Geocoding error:', error);
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

  // Handle manual review action
  const handleManualReviewAction = async (locationId: string, action: 'approve' | 'reject') => {
    if (!verificationResults) return;
    
    setLoadingActions(prev => ({ ...prev, [locationId]: action === 'approve' ? 'approving' : 'rejecting' }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
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
      
    } catch (error) {
      console.error(`Error ${action}ing location:`, error);
      alert(`Error ${action}ing location. Please try again.`);
    } finally {
      setLoadingActions(prev => ({ ...prev, [locationId]: null }));
      setShowConfirmDialog(null);
    }
  };

  // Helper functions for status display
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

  // Loading states
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
              />
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

  // Results view
  if (verificationResults) {
    const manualReviewResults = verificationResults.results.filter(r => r.status === 'manual-review');

    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Continue Button */}
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
                        <p className="text-sm text-yellow-700 mb-3">{result.failureReason || 'Manual review required'}</p>
                        
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
                    <ThumbsUp className="h-6 w-6 text-green-600" />
                  ) : (
                    <ThumbsDown className="h-6 w-6 text-red-600" />
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
                    }`}
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

  // Initial form view
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
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Location Data</h3>
                <FileUpload
                  onFileUpload={handleFileUpload}
                  accept=".csv,.xlsx,.xls"
                  title="Upload Location Data"
                  description="Upload a CSV or Excel file with location data including addresses, company names, and service requirements."
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

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
                          containerSize: '8YD'
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {EQUIPMENT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

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
{/* Service Details if available */}
{(location.equipmentType || location.containerSize || location.frequency) && (
  <div className="mt-2">
    <p className="text-gray-600 text-xs mb-1">Service Details:</p>
    <div className="text-xs text-gray-700 space-y-1">
      {location.equipmentType && <div>Equipment: {location.equipmentType}</div>}
      {location.containerSize && <div>Container: {location.containerSize}</div>}
      {location.frequency && <div>Frequency: {location.frequency}</div>}
      {location.materialType && <div>Material: {location.materialType}</div>}
    </div>
  </div>
)}

<div className="ml-3 flex-shrink-0">
  <div className="flex flex-col items-center space-y-2">
    <AlertCircle className="h-6 w-6 text-yellow-600" />
    <span className="text-xs text-yellow-700 font-medium">Click to View</span>
  </div>
</div>

{/* Hover indicator */}
<div className="mt-2 pt-2 border-t border-yellow-200 opacity-0 group-hover/item:opacity-100 transition-opacity">
  <p className="text-xs text-yellow-600 flex items-center">
    <span className="mr-1">👆</span>
    Click to scroll to this location in the results below
  </p>
</div>

{/* Footer with action guidance */}
<div className="mt-4 pt-3 border-t border-yellow-200">
  <p className="text-xs text-yellow-700 text-center">
    <span className="font-medium">💡 Tip:</span> Click on any location above to jump to its details in the verification results
  </p>
</div>
 {/* Tooltip arrow */}
    <div className="absolute top-full left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-300" />
  />
)}