import React from 'react';
import { ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';

interface VerificationResults {
  totalProcessed: number;
  serviceableCount: number;
  notServiceableCount: number;
  manualReviewCount: number;
  results: any[];
}

interface StickyFooterButtonProps {
  verificationResults: VerificationResults | null;
  onContinue: () => void;
  isVisible?: boolean;
}

export function StickyFooterButton({ 
  verificationResults, 
  onContinue, 
  isVisible = true 
}: StickyFooterButtonProps) {
  // Don't render if not visible or no verification results
  if (!isVisible || !verificationResults || verificationResults.totalProcessed === 0) {
    return null;
  }

  // Determine button state and content
  const hasManualReview = verificationResults.manualReviewCount > 0;
  const hasServiceableLocations = verificationResults.serviceableCount > 0;
  
  // Don't show button if no serviceable locations
  if (!hasServiceableLocations) {
    return null;
  }

  // Generate dynamic button text
  const getButtonText = (): string => {
    if (hasManualReview) {
      const count = verificationResults.manualReviewCount;
      return `Continue to Pricing Setup (${count} location${count > 1 ? 's' : ''} for review)`;
    }
    return 'Continue to Pricing Setup';
  };

  // Get appropriate icon
  const getIcon = () => {
    if (hasManualReview) {
      return <AlertTriangle className="h-5 w-5 ml-2" />;
    }
    return <ArrowRight className="h-5 w-5 ml-2" />;
  };

  // Get button styling based on state
  const getButtonClasses = (): string => {
    const baseClasses = "inline-flex items-center px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    if (hasManualReview) {
      return `${baseClasses} bg-amber-600 hover:bg-amber-700 text-white border-2 border-amber-500 focus:ring-amber-500`;
    }
    return `${baseClasses} bg-green-600 hover:bg-green-700 text-white border-2 border-green-500 focus:ring-green-500`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Status Summary */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="font-medium">{verificationResults.serviceableCount} serviceable</span>
            </div>
            
            {hasManualReview && (
              <div className="flex items-center text-sm text-amber-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span className="font-medium">{verificationResults.manualReviewCount} for review</span>
              </div>
            )}
            
            {verificationResults.notServiceableCount > 0 && (
              <div className="flex items-center text-sm text-red-600">
                <span className="w-4 h-4 rounded-full bg-red-500 mr-1"></span>
                <span className="font-medium">{verificationResults.notServiceableCount} not serviceable</span>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className={getButtonClasses()}
            aria-label={getButtonText()}
          >
            {getButtonText()}
            {getIcon()}
          </button>
        </div>
      </div>
    </div>
  );
}
