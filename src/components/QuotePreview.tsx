import React, { useState, useEffect } from 'react';
import { Quote } from '../types';
import { Download, FileText, CheckCircle, XCircle, ArrowLeft, Eye, Settings, Edit, Save, X } from 'lucide-react';
import { formatCurrency, formatPercentage, formatStatus } from '../utils/formatters';
import * as XLSX from 'xlsx';

interface QuotePreviewProps {
  processedQuotes: Quote[];
  onReturnToPricing: () => void;
  onCustomizeReport: () => void;
  onQuotesUpdated?: (updatedQuotes: Quote[]) => void;
}

// Helper function to recalculate a single quote's totals
const recalculateQuote = (quote: Quote): Quote => {
  const updatedQuote = { ...quote };

  // Ensure numeric values are numbers, default to 0 if NaN or null
  const baseRate = Number(updatedQuote.baseRate) || 0;
  const addOnsCost = Number(updatedQuote.addOnsCost) || 0;
  const franchiseFeeRate = Number(updatedQuote.franchiseFeeRate) || 0;
  const fuelSurchargeRate = Number(updatedQuote.fuelSurchargeRate) || 0;
  const localTaxRate = Number(updatedQuote.localTaxRate) || 0;

  // 1. Recalculate Subtotal (excluding one-time fees)
  updatedQuote.subtotal = baseRate + addOnsCost;

  // 2. Recalculate Franchise Fee Amount (excluding one-time fees)
  updatedQuote.franchiseFeeAmount = (baseRate + addOnsCost) * (franchiseFeeRate / 100);

  // 3. Recalculate Fuel Surcharge Amount (excluding one-time fees)
  updatedQuote.fuelSurchargeAmount = (baseRate + addOnsCost) * (fuelSurchargeRate / 100);

  // 4. Recalculate Subtotal with fees
  updatedQuote.subtotal = baseRate + updatedQuote.franchiseFeeAmount + updatedQuote.fuelSurchargeAmount + addOnsCost;

  // 5. Calculate Total Before Tax
  const totalBeforeTax = updatedQuote.subtotal;
  // 6. Recalculate Local Tax Amount
  updatedQuote.localTaxAmount = totalBeforeTax * (localTaxRate / 100);

  // 7. Recalculate Total Monthly Cost (excluding one-time fees)
  updatedQuote.totalMonthlyCost = totalBeforeTax + updatedQuote.localTaxAmount;

  return updatedQuote;
};

export function QuotePreview({ processedQuotes, onReturnToPricing, onCustomizeReport, onQuotesUpdated }: QuotePreviewProps) {
  const [editedQuotes, setEditedQuotes] = useState<Quote[]>(processedQuotes);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Update editedQuotes if processedQuotes prop changes (e.g., from parent component)
  useEffect(() => {
    setEditedQuotes(processedQuotes);
  }, [processedQuotes]);

  // Separate quotes for display purposes only - DO NOT change order
  const successfulQuotes = editedQuotes.filter(q => q.status === 'success');
  const failedQuotes = editedQuotes.filter(q => q.status === 'failed');
  
  const totalMonthlyRevenue = successfulQuotes.reduce((sum, quote) => sum + quote.totalMonthlyCost, 0);
  const totalAnnualRevenue = totalMonthlyRevenue * 12;
  const successRate = processedQuotes.length > 0 ? (successfulQuotes.length / processedQuotes.length) * 100 : 0;

  const handleEdit = (quoteId: string) => {
    setEditingQuoteId(quoteId);
  };

  const handleCancelEdit = (quoteId: string) => {
    // Revert changes for the specific quote
    const originalQuote = processedQuotes.find(q => q.id === quoteId);
    if (originalQuote) {
      setEditedQuotes(prev => prev.map(q => q.id === quoteId ? originalQuote : q));
    }
    setEditingQuoteId(null);
  };

  const handleSaveEdit = (quoteId: string) => {
    // Find the edited quote from local state
    const quoteToSave = editedQuotes.find(q => q.id === quoteId);
    if (quoteToSave && onQuotesUpdated) {
      // Call the parent callback to update the main processedQuotes state
      onQuotesUpdated(editedQuotes);
      console.log(`✅ Saved edits for quote ${quoteId}. New total: ${formatCurrency(quoteToSave.totalMonthlyCost)}`);
    }
    setEditingQuoteId(null);
  };

  const handleFieldChange = (quoteId: string, field: keyof Quote, value: string | number) => {
    setEditedQuotes(prevQuotes => {
      return prevQuotes.map(quote => {
        if (quote.id === quoteId) {
          const updatedQuote = { ...quote, [field]: Number(value) };
          // Recalculate all dependent fields
          return recalculateQuote(updatedQuote);
        }
        return quote;
      });
    });
  };

  const exportToCSV = () => {
    const headers = [
      'Customer Name',
      'Address',
      'City',
      'State',
      'Zip Code',
      'Equipment Type',
      'Container Size',
      'Frequency',
      'Material Type',
      'Bin Quantity',
      'Status',
      'Base Rate',
      'Franchise Fee Rate',
      'Franchise Fee Amount',
      'Sales Tax Rate',
      'Sales Tax Amount',
      'Fuel Surcharge Rate',
      'Fuel Surcharge Amount',
      'Delivery Fee',
      'Extra Pickup Rate',
      'Add-ons Cost',
      'Subtotal',
      'Total Monthly Cost',
      'Total Monthly Volume',
      'Pickups Per Week',
      'Notes'
    ];

    // CRITICAL FIX: Use editedQuotes directly - already in perfect import order
    // NO SORTING - order is already preserved from original import sequence
    
    console.log('📊 CRITICAL CSV Export - PERFECT ORDER PRESERVATION:', {
      totalQuotes: editedQuotes.length,
      successfulQuotes: successfulQuotes.length,
      failedQuotes: failedQuotes.length,
      REQUIREMENT_1_COMPLETE_EXPORT: editedQuotes.length,
      REQUIREMENT_2_ORDER_PRESERVED: 'PERFECT - No sorting applied, original import sequence maintained',
      firstFiveIds: editedQuotes.slice(0, 5).map(q => ({ 
        id: q.serviceRequest.id, 
        address: q.serviceRequest.address,
        status: q.status 
      })),
      lastFiveIds: editedQuotes.slice(-5).map(q => ({ 
        id: q.serviceRequest.id, 
        address: q.serviceRequest.address,
        status: q.status 
      }))
    });
    
    const csvContent = [
      headers.join(','),
      ...editedQuotes.map(quote => [
        `"${quote.serviceRequest.customerName || ''}"`,
        `"${quote.serviceRequest.address}"`,
        `"${quote.serviceRequest.city}"`,
        `"${quote.serviceRequest.state}"`,
        `"${quote.serviceRequest.zipCode}"`,
        `"${quote.serviceRequest.equipmentType}"`,
        `"${quote.serviceRequest.containerSize}"`,
        `"${quote.serviceRequest.frequency}"`,
        `"${quote.serviceRequest.materialType || 'Solid Waste'}"`,
        quote.serviceRequest.binQuantity || 1,
        quote.status === 'success' ? 'Success' : 'Not Serviceable',
        `$${quote.baseRate.toFixed(2)}`,
        `${(quote.franchiseFeeRate || 0).toFixed(2)}%`,
        `$${quote.franchiseFeeAmount.toFixed(2)}`,
        `${(quote.localTaxRate || 0).toFixed(2)}%`,
        `$${quote.localTaxAmount.toFixed(2)}`,
        `${(quote.fuelSurchargeRate || 0).toFixed(2)}%`,
        `$${quote.fuelSurchargeAmount.toFixed(2)}`,
        `$${quote.deliveryFee.toFixed(2)}`,
        `$${(quote.extraPickupRate || 0).toFixed(2)}`,
        `$${(quote.addOnsCost || 0).toFixed(2)}`,
        `$${quote.subtotal.toFixed(2)}`,
        `$${quote.totalMonthlyCost.toFixed(2)}`,
        quote.totalMonthlyVolume.toFixed(2),
        quote.pickupsPerWeek,
        `"${quote.serviceRequest.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `quotes_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const headers = [
      'Customer Name',
      'Address', 
      'City',
      'State',
      'Zip Code',
      'Equipment Type',
      'Container Size',
      'Frequency',
      'Material Type',
      'Bin Quantity',
      'Status',
      'Base Rate',
      'Franchise Fee Rate',
      'Franchise Fee Amount',
      'Sales Tax Rate',
      'Sales Tax Amount',
      'Fuel Surcharge Rate',
      'Fuel Surcharge Amount',
      'Delivery Fee',
      'Extra Pickup Rate',
      'Add-ons Cost',
      'Subtotal',
      'Total Monthly Cost',
      'Total Monthly Volume',
      'Pickups Per Week',
      'Notes'
    ];

    // CRITICAL FIX: Use editedQuotes directly - already in perfect import order
    // NO SORTING - order is already preserved from original import sequence
    
    console.log('📊 CRITICAL Excel Export - PERFECT ORDER PRESERVATION:', {
      totalQuotes: editedQuotes.length,
      successfulQuotes: successfulQuotes.length,
      failedQuotes: failedQuotes.length,
      REQUIREMENT_1_COMPLETE_EXPORT: editedQuotes.length,
      REQUIREMENT_2_ORDER_PRESERVED: 'PERFECT - No sorting applied, original import sequence maintained',
      firstFiveIds: editedQuotes.slice(0, 5).map(q => ({ 
        id: q.serviceRequest.id, 
        address: q.serviceRequest.address,
        status: q.status 
      })),
      lastFiveIds: editedQuotes.slice(-5).map(q => ({ 
        id: q.serviceRequest.id, 
        address: q.serviceRequest.address,
        status: q.status 
      }))
    });
    
    const data = [
      headers,
      ...editedQuotes.map(quote => [
        quote.serviceRequest.customerName || '',
        quote.serviceRequest.address,
        quote.serviceRequest.city,
        quote.serviceRequest.state,
        quote.serviceRequest.zipCode,
        quote.serviceRequest.equipmentType,
        quote.serviceRequest.containerSize,
        quote.serviceRequest.frequency,
        quote.serviceRequest.materialType || 'Solid Waste',
        quote.serviceRequest.binQuantity || 1,
        quote.status === 'success' ? 'Success' : 'Not Serviceable',
        `$${quote.baseRate.toFixed(2)}`,
        `${(quote.franchiseFeeRate || 0).toFixed(2)}%`,
        `$${quote.franchiseFeeAmount.toFixed(2)}`,
        `${(quote.localTaxRate || 0).toFixed(2)}%`,
        `$${quote.localTaxAmount.toFixed(2)}`,
        `${(quote.fuelSurchargeRate || 0).toFixed(2)}%`,
        `$${quote.fuelSurchargeAmount.toFixed(2)}`,
        `$${quote.deliveryFee.toFixed(2)}`,
        `$${(quote.extraPickupRate || 0).toFixed(2)}`,
        `$${(quote.addOnsCost || 0).toFixed(2)}`,
        `$${quote.subtotal.toFixed(2)}`,
        `$${quote.totalMonthlyCost.toFixed(2)}`,
        quote.totalMonthlyVolume,
        quote.pickupsPerWeek,
        quote.serviceRequest.notes || ''
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Quotes');

    // Auto-size columns
    const colWidths = headers.map((header, index) => {
      const maxLength = Math.max(
        header.length,
        ...data.slice(1).map(row => String(row[index] || '').length)
      );
      return { wch: Math.min(maxLength + 2, 50) };
    });
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `quotes_export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const openDetailModal = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedQuote(null);
    setShowDetailModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quote Generation Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{processedQuotes.length}</div>
            <div className="text-sm text-blue-700">Total Processed</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{successfulQuotes.length}</div>
            <div className="text-sm text-green-700">Successful Quotes</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalMonthlyRevenue)}</div>
            <div className="text-sm text-purple-700">Monthly Revenue</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalAnnualRevenue)}</div>
            <div className="text-sm text-orange-700">Annual Revenue</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">
              Success Rate: <span className="font-medium text-green-600">{successRate.toFixed(1)}%</span>
            </p>
            {failedQuotes.length > 0 && (
              <p className="text-red-600 text-sm mt-1">
                {failedQuotes.length} locations failed quote generation
              </p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onReturnToPricing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pricing Setup
            </button>
            <button
              onClick={onCustomizeReport}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Customize Report
            </button>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="flex space-x-4">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={exportToExcel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Successful Quotes */}
      {successfulQuotes.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-green-50 border-b border-green-200">
            <h3 className="text-lg font-semibold text-green-800">
              Successful Quotes ({successfulQuotes.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {successfulQuotes.map((quote) => (
                  <tr key={quote.id} className={`hover:bg-gray-50 ${editingQuoteId === quote.id ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {quote.serviceRequest.customerName}
                      </div>
                      {quote.pricingSource && quote.pricingSource !== 'Custom Rule' && (
                        <div className="text-sm text-gray-500">
                          {quote.pricingSource}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{quote.serviceRequest.address}</div>
                      <div className="text-sm text-gray-500">
                        {quote.serviceRequest.city}, {quote.serviceRequest.state} {quote.serviceRequest.zipCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {quote.serviceRequest.containerSize} {quote.serviceRequest.equipmentType}
                      </div>
                      <div className="text-sm text-gray-500">
                        {quote.serviceRequest.frequency} • {quote.serviceRequest.materialType}
                      </div>
                      {quote.serviceRequest.binQuantity > 1 && (
                        <div className="text-xs text-blue-600">
                          Quantity: {quote.serviceRequest.binQuantity}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Monthly Volume:</span>
                          <span className="font-medium">{quote.totalMonthlyVolume.toFixed(2)} YD</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cost Before Tax/Fees:</span>
                          {editingQuoteId === quote.id ? (
                            <input
                              type="number"
                              step="0.01"
                              value={quote.baseRate}
                              onChange={(e) => handleFieldChange(quote.id, 'baseRate', e.target.value)}
                              className="w-24 text-right border border-blue-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <span className="font-medium">{formatCurrency(quote.baseRate)}</span>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Franchise Fee ({editingQuoteId === quote.id ? (
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                value={quote.franchiseFeeRate || 0}
                                onChange={(e) => handleFieldChange(quote.id, 'franchiseFeeRate', e.target.value)}
                                className="w-16 text-center border border-blue-300 rounded px-1 py-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            ) : (
                              `${quote.franchiseFeeRate || 0}`
                            )}%):
                          </span>
                          <span className="font-medium">{formatCurrency(quote.franchiseFeeAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Fuel Surcharge ({editingQuoteId === quote.id ? (
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                value={quote.fuelSurchargeRate || 0}
                                onChange={(e) => handleFieldChange(quote.id, 'fuelSurchargeRate', e.target.value)}
                                className="w-16 text-center border border-blue-300 rounded px-1 py-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            ) : (
                              `${quote.fuelSurchargeRate || 0}`
                            )}%):
                          </span>
                          <span className="font-medium">{formatCurrency(quote.fuelSurchargeAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Additional Fees:</span>
                          {editingQuoteId === quote.id ? (
                            <input
                              type="number"
                              step="0.01"
                              value={quote.addOnsCost || 0}
                              onChange={(e) => handleFieldChange(quote.id, 'addOnsCost', e.target.value)}
                              className="w-24 text-right border border-blue-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <span className="font-medium">{formatCurrency(quote.addOnsCost || 0)}</span>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">{formatCurrency(quote.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax ({quote.localTaxRate || 0}%):</span>
                          <span className="font-medium">{formatCurrency(quote.localTaxAmount)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span className="text-gray-900 font-semibold">Total Monthly Cost:</span>
                          <span className="font-bold text-green-600">{formatCurrency(quote.totalMonthlyCost)}</span>
                        </div>
                        
                        {/* One-time Costs Section */}
                        {(quote.deliveryFee > 0 || (quote.extraPickupRate && quote.extraPickupRate > 0)) && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-sm font-medium text-gray-700 mb-2">One-time Costs:</div>
                            {quote.deliveryFee > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Fee:</span>
                                {editingQuoteId === quote.id ? (
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={quote.deliveryFee}
                                    onChange={(e) => handleFieldChange(quote.id, 'deliveryFee', e.target.value)}
                                    className="w-24 text-right border border-blue-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                ) : (
                                  <span className="font-medium text-blue-600">{formatCurrency(quote.deliveryFee)} <span className="text-xs text-gray-500">*one-time</span></span>
                                )}
                              </div>
                            )}
                            {quote.extraPickupRate && quote.extraPickupRate > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Extra Pick Up:</span>
                                {editingQuoteId === quote.id ? (
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={quote.extraPickupRate}
                                    onChange={(e) => handleFieldChange(quote.id, 'extraPickupRate', e.target.value)}
                                    className="w-24 text-right border border-blue-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                ) : (
                                  <span className="font-medium text-blue-600">{formatCurrency(quote.extraPickupRate)} <span className="text-xs text-gray-500">*one-time</span></span>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2 italic">
                              One-time fees are not included in the Monthly Cost
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingQuoteId === quote.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveEdit(quote.id)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Save changes"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleCancelEdit(quote.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Cancel changes"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(quote.id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit quote"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDetailModal(quote)}
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Failed Quotes */}
      {failedQuotes.length > 0 && (
        <div className="bg-white border border-red-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-red-50 border-b border-red-200">
            <h3 className="text-lg font-semibold text-red-800">
              Failed Quotes ({failedQuotes.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Request
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Failure Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {failedQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {quote.serviceRequest.customerName}
                      </div>
                      <div className="text-sm text-red-600">Failed</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{quote.serviceRequest.address}</div>
                      <div className="text-sm text-gray-500">
                        {quote.serviceRequest.city}, {quote.serviceRequest.state} {quote.serviceRequest.zipCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {quote.serviceRequest.containerSize} {quote.serviceRequest.equipmentType}
                      </div>
                      <div className="text-sm text-gray-500">
                        {quote.serviceRequest.frequency} • {quote.serviceRequest.materialType}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-red-600">
                        {quote.failureReason || 'Unknown error'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Quote Details</h3>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-6">
              {/* Customer Information */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p className="text-gray-900">{selectedQuote.serviceRequest.customerName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Address:</span>
                    <p className="text-gray-900">{selectedQuote.serviceRequest.address}</p>
                    <p className="text-gray-900">{selectedQuote.serviceRequest.city}, {selectedQuote.serviceRequest.state} {selectedQuote.serviceRequest.zipCode}</p>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Service Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Equipment:</span>
                    <p className="text-gray-900">{selectedQuote.serviceRequest.equipmentType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Container Size:</span>
                    <p className="text-gray-900">{selectedQuote.serviceRequest.containerSize}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Frequency:</span>
                    <p className="text-gray-900">{selectedQuote.serviceRequest.frequency}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Material:</span>
                    <p className="text-gray-900">{selectedQuote.serviceRequest.materialType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Bin Quantity:</span>
                    <p className="text-gray-900">{selectedQuote.serviceRequest.binQuantity}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Pricing Source:</span>
                    <p className="text-gray-900">{selectedQuote.pricingSource}</p>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Pricing Breakdown</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Monthly Volume:</span>
                      <span className="font-medium">{selectedQuote.totalMonthlyVolume.toFixed(2)} YD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost Before Tax/Fees:</span>
                      <span className="font-medium">{formatCurrency(selectedQuote.baseRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Franchise Fee ({selectedQuote.franchiseFeeRate || 0}%):</span>
                      <span className="font-medium">{formatCurrency(selectedQuote.franchiseFeeAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fuel Surcharge ({selectedQuote.fuelSurchargeRate || 0}%):</span>
                      <span className="font-medium">{formatCurrency(selectedQuote.fuelSurchargeAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Additional Fees:</span>
                      <span className="font-medium">{formatCurrency(selectedQuote.addOnsCost || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(selectedQuote.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax ({selectedQuote.localTaxRate || 0}%):</span>
                      <span className="font-medium">{formatCurrency(selectedQuote.localTaxAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-900 font-semibold">Total Monthly Cost:</span>
                      <span className="font-bold text-green-600">{formatCurrency(selectedQuote.totalMonthlyCost)}</span>
                    </div>
                    
                    {/* One-time Costs Section */}
                    {(selectedQuote.deliveryFee > 0 || (selectedQuote.extraPickupRate && selectedQuote.extraPickupRate > 0)) && (
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <div className="text-sm font-medium text-gray-700 mb-2">One-time Costs:</div>
                        {selectedQuote.deliveryFee > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee:</span>
                            <span className="font-medium text-blue-600">{formatCurrency(selectedQuote.deliveryFee)} <span className="text-xs text-gray-500">*one-time</span></span>
                          </div>
                        )}
                        {selectedQuote.extraPickupRate && selectedQuote.extraPickupRate > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Extra Pick Up:</span>
                            <span className="font-medium text-blue-600">{formatCurrency(selectedQuote.extraPickupRate)} <span className="text-xs text-gray-500">*one-time</span></span>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2 italic">
                          One-time fees are not included in the Monthly Cost
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {selectedQuote.addOnDetails && selectedQuote.addOnDetails.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Additional Fee Details</h4>
                  <div className="space-y-2">
                    {selectedQuote.addOnDetails.map((detail, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{detail.category}:</span>
                        <span className="font-medium">
                          {formatCurrency(detail.originalPrice)} ({detail.originalFrequency}) = {formatCurrency(detail.monthlyEquivalent)}/month
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}