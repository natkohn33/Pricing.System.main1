import React from 'react';
import { Dashboard } from './components/Dashboard';

function App() {
  // The currentView state is not directly used for routing here, as Dashboard handles steps internally.
  // It's kept for consistency with your original code structure.
  const [currentView, setCurrentView] = React.useState<'dashboard'>('dashboard');

  return (
    <div>
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">FWS Pricing System</h1>
        </div>
      </nav>
      <Dashboard />
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <p className="text-sm text-gray-500">
                © 2025 FWS Pricing System
              </p>
              <div className="flex gap-4 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-700">Support</a>
                <a href="#" className="hover:text-gray-700">Documentation</a>
                <a href="#" className="hover:text-gray-700">API</a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-500">System Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
