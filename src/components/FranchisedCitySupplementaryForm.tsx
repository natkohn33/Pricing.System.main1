import React, { useState } from 'react';
import { SupplementaryCost, FranchisedCitySupplementaryPricing } from '../types';
import { Plus, Trash2, DollarSign, AlertCircle, FileText, Save } from 'lucide-react';

interface FranchisedCitySupplementaryFormProps {
  cityName: string;
  state: string;
  onSupplementaryPricingUpdate: (pricing: FranchisedCitySupplementaryPricing) => void;
  initialSupplementaryCosts?: SupplementaryCost[];
}

export function FranchisedCitySupplementaryForm({ 
  cityName, 
  state, 
  onSupplementaryPricingUpdate,
  initialSupplementaryCosts = []
}: FranchisedCitySupplementaryFormProps) {
  const [supplementaryCosts, setSupplementaryCosts] = useState<SupplementaryCost[]>(initialSupplementaryCosts);
  const [newCost, setNewCost] = useState<Partial<SupplementaryCost>>({
    category: '',
    description: '',
    amount: 0,
    frequency: 'monthly',
    justification: ''
  });

  const frequencyOptions = [
    { value: 'one-time', label: 'One-time' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' }
  ];

  const addSupplementaryCost = () => {
    if (!newCost.category || newCost.category.trim() === '' || !newCost.amount || newCost.amount <= 0) {
      alert('Please fill in Category Name and Amount with valid values');
      return;
    }

    const cost: SupplementaryCost = {
      id: `supplementary-${Date.now()}`,
      category: newCost.category!,
      description: newCost.description!,
      amount: newCost.amount!,
      frequency: newCost.frequency || 'monthly',
      justification: newCost.justification || '',
      addedAt: new Date().toISOString(),
      cityName,
      addedBy: 'User' // In a real system, this would be the actual user ID
    };

    const updatedCosts = [...supplementaryCosts, cost];
    setSupplementaryCosts(updatedCosts);
    
    const supplementaryPricing: FranchisedCitySupplementaryPricing = {
      cityName,
      state,
      supplementaryCosts: updatedCosts,
      lastUpdated: new Date().toISOString()
    };
    
    onSupplementaryPricingUpdate(supplementaryPricing);

    // Reset form
    setNewCost({
      category: '',
      description: '',
      amount: 0,
      frequency: 'monthly',
      justification: ''
    });
  };

  const removeSupplementaryCost = (id: string) => {
    const updatedCosts = supplementaryCosts.filter(cost => cost.id !== id);
    setSupplementaryCosts(updatedCosts);
    
    const supplementaryPricing: FranchisedCitySupplementaryPricing = {
      cityName,
      state,
      supplementaryCosts: updatedCosts,
      lastUpdated: new Date().toISOString()
    };
    
    onSupplementaryPricingUpdate(supplementaryPricing);
  };

  const calculateMonthlyEquivalent = (amount: number, frequency: string): number => {
    const multipliers: Record<string, number> = {
      'one-time': 0,
      'weekly': 4.33,
      'monthly': 1,
      'quarterly': 1/3,
      'annually': 1/12
    };
    return amount * (multipliers[frequency] || 1);
  };

  const getTotalMonthlySupplementary = (): number => {
    return supplementaryCosts.reduce((total, cost) => {
      return total + calculateMonthlyEquivalent(cost.amount, cost.frequency);
    }, 0);
  };

  return (
    <div className="bg-white border border-purple-200 rounded-lg p-6">
      <div className="flex items-center mb-6">
        <FileText className="h-6 w-6 text-purple-600 mr-3" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {cityName} Supplementary Costs
          </h3>
          <p className="text-purple-700 text-sm mt-1">
            🏛️ {cityName}, {state} - Municipal Contract Pricing Active
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Add supplementary costs not covered in the municipal contract rate sheet
          </p>
        </div>
      </div>

      {/* Add New Supplementary Cost Form */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Add Supplementary Cost</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={newCost.category || ''}
              onChange={(e) => setNewCost(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter category name"
            >
            </input>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={newCost.amount || ''}
                onChange={(e) => setNewCost(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency *
            </label>
            <select
              value={newCost.frequency || 'monthly'}
              onChange={(e) => setNewCost(prev => ({ ...prev, frequency: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            >
              {frequencyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={newCost.description || ''}
              onChange={(e) => setNewCost(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="Brief description of the cost"
            />
          </div>
        </div>

        <button
          onClick={addSupplementaryCost}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Supplementary Cost
        </button>
      </div>

      {/* Existing Supplementary Costs */}
      {supplementaryCosts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-purple-50 border-b border-purple-200">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">
                Configured Supplementary Costs ({supplementaryCosts.length})
              </h4>
              <div className="text-sm text-purple-700">
                <span className="font-medium">Total Monthly Impact:</span> ${getTotalMonthlySupplementary().toFixed(2)}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Equivalent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {supplementaryCosts.map((cost) => (
                  <tr key={cost.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {cost.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{cost.description}</div>
                      {cost.justification && (
                        <div className="text-xs text-gray-500 mt-1">{cost.justification}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${cost.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {frequencyOptions.find(f => f.value === cost.frequency)?.label || cost.frequency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${calculateMonthlyEquivalent(cost.amount, cost.frequency).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => removeSupplementaryCost(cost.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Remove supplementary cost"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {supplementaryCosts.length > 0 && (
            <div className="px-6 py-4 bg-purple-50 border-t border-purple-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-700">
                  These supplementary costs will be added to all quotes for {cityName}, {state}
                </span>
                <span className="font-medium text-purple-800">
                  Total Monthly Supplementary: ${getTotalMonthlySupplementary().toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {supplementaryCosts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm">No supplementary costs configured</p>
          <p className="text-xs mt-1">Municipal contract pricing will be used without modifications</p>
        </div>
      )}
    </div>
  );
}