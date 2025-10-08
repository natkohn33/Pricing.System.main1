import React from 'react';
import { MapPin, CheckCircle, XCircle } from 'lucide-react';

export function LocationsReference({ serviceable, nonServiceable }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
        <MapPin className="mr-3 text-gray-500" />
        All Locations Reference
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Review all {serviceable.length + nonServiceable.length} locations ({serviceable.length} serviceable, {nonServiceable.length} not serviceable) while configuring pricing logic.
      </p>

      {/* Serviceable Locations */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-green-600 flex items-center mb-3">
          <CheckCircle className="mr-2" />
          Serviceable Locations ({serviceable.length})
        </h4>
        <div className="space-y-4">
          {serviceable.map((loc, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">Location {index + 1}</p>
                  <p className="text-sm text-gray-600">{loc.address}</p>
                  <p className="text-xs text-gray-500">Coordinates: {loc.latitude}, {loc.longitude}</p>
                </div>
                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">{loc.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-Serviceable Locations */}
      <div>
        <h4 className="text-lg font-medium text-red-600 flex items-center mb-3">
          <XCircle className="mr-2" />
          Non-Serviceable Locations ({nonServiceable.length})
        </h4>
        <div className="space-y-4">
          {nonServiceable.map((loc, index) => (
            <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="font-semibold text-gray-800">{loc.address}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
        <p className="text-sm text-blue-700">
          <span className="font-bold">Reference Guide:</span> Use this information to create targeted pricing rules. Serviceable locations will receive quotes, while not serviceable locations will be tracked but excluded from pricing calculations. Consider factors like division assignments, service requirements, and geographic distribution when configuring your custom pricing logic below.
        </p>
      </div>
    </div>
  );
}
