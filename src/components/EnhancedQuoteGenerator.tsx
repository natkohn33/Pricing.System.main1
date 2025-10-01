import React, { useState } from 'react';
import { Download, FileText, Calendar, Building, CheckCircle, AlertCircle, Palette } from 'lucide-react';
import * as XLSX from 'xlsx';

// Company Configuration
interface CompanyConfig {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  tagline: string;
  footerText: string;
}

const FRONTIER_COMPANY_CONFIG: CompanyConfig = {
  name: 'Frontier Waste Solutions',
  address: '2323 Bryan Street, Suite 2620, Dallas, TX 75201',
  phone: '(214) 555-0123',
  email: 'info@frontierwaste.com',
  website: 'frontierwaste.com',
  logo: '/images/frontier-logo.png',
  tagline: 'Texas Based, Texas Proud',
  footerText: 'This quote is valid for 30 days from the date of generation'
};

// Theme Configuration
interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

const FRONTIER_THEMES: Record<string, ColorTheme> = {
  green: {
    primary: '#294C37',
    secondary: '#16a34a', 
    accent: '#dcfce7',
    background: '#f0fdf4',
    text: '#166534',
    border: '#bbf7d0'
  },
  blue: {
    primary: '#3b82f6',
    secondary: '#2563eb',
    accent: '#dbeafe', 
    background: '#eff6ff',
    text: '#1e40af',
    border: '#93c5fd'
  },
  purple: {
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#ede9fe',
    background: '#f5f3ff', 
    text: '#6d28d9',
    border: '#c4b5fd'
  },
  orange: {
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fed7aa',
    background: '#fff7ed',
    text: '#c2410c', 
    border: '#fdba74'
  }
};

// Utility Functions
const generateThemedCSS = (theme: ColorTheme): string => {
  return `
    :root {
      --primary-color: ${theme.primary};
      --secondary-color: ${theme.secondary};
      --accent-color: ${theme.accent};
      --background-color: ${theme.background};
      --text-color: ${theme.text};
      --border-color: ${theme.border};
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 20px;
      background-color: #f9f9f9;
    }
    
    .header {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      padding: 30px;
      border-radius: 8px 8px 0 0;
      text-align: center;
      margin-bottom: 0;
    }
    
    .company-logo {
      max-height: 60px;
      margin-bottom: 15px;
    }
    
    .company-name {
      font-size: 28px;
      font-weight: bold;
      margin: 0 0 8px 0;
    }
    
    .company-tagline {
      font-size: 16px;
      opacity: 0.9;
      margin: 0;
    }
    
    .document-title {
      font-size: 24px;
      margin: 20px 0 10px 0;
      color: var(--text-color);
    }
    
    .document-info {
      background: var(--background-color);
      padding: 20px;
      border-left: 4px solid var(--primary-color);
      margin-bottom: 20px;
    }
    
    .footer {
      background: var(--accent-color);
      color: var(--text-color);
      padding: 20px;
      text-align: center;
      border-radius: 0 0 8px 8px;
      margin-top: 30px;
      border-top: 3px solid var(--primary-color);
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: var(--primary-color);
    }
    
    .total-value {
      font-size: 18px;
      font-weight: bold;
      color: var(--primary-color);
    }
    
    .quotes-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 10px;
      background: var(--background-color);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .quotes-table th,
    .quotes-table td {
      border: 1px solid #ddd;
      padding: 6px 4px;
      text-align: left;
      vertical-align: top;
    }
    
    .quotes-table tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    
    .quotes-table tr:hover {
      background-color: #f0f8f0;
    }
    
    .status-success {
      color: #28a745;
      font-weight: bold;
    }
    
    .status-failed {
      color: #dc3545;
      font-weight: bold;
    }
    
    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .stat-item {
      text-align: center;
      padding: 10px;
      background: var(--background-color);
      border-radius: 6px;
      border: 1px solid #e0e0e0;
    }
    
    .stat-label {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    
    .totals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .total-label {
      font-weight: 600;
      color: #333;
    }
    
    .totals-section {
      margin-top: 20px;
      padding: 20px;
      background: var(--accent-color);
      border-radius: 8px;
    }
    
    .totals-title {
      font-size: 20px;
      font-weight: bold;
      color: var(--text-color);
      margin-bottom: 15px;
    }
    
    .total-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
    }
    
    @media print {
      body { background: white; }
      .quotes-table { font-size: 9px; }
    }
  `;
};

const generateCompanyHeader = (companyName: string, currentDate: string, companyConfig: CompanyConfig): string => {
  return `
    <div class="header">
      <h1 class="company-name">${companyConfig.name}</h1>
      <p class="company-tagline">${companyConfig.tagline}</p>
    </div>
    
    <div class="document-info">
      <h2 class="document-title">Service Quote for ${companyName}</h2>
      <p><strong>Generated:</strong> ${currentDate}</p>
      <p><strong>Contact:</strong> ${companyConfig.phone} | ${companyConfig.email}</p>
      <p><strong>Address:</strong> ${companyConfig.address}</p>
    </div>
  `;
};

const generateCompanyFooter = (currentDate: string, companyConfig: CompanyConfig): string => {
  return `
    <div class="footer">
      <p><strong>${companyConfig.name}</strong></p>
      <p>${companyConfig.address}</p>
      <p>Phone: ${companyConfig.phone} | Email: ${companyConfig.email} | Website: ${companyConfig.website}</p>
      <p style="margin-top: 15px; font-style: italic;">${companyConfig.footerText}</p>
    </div>
  `;
};

// Interfaces
interface ServiceRequest {
  customerName?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  equipmentType: string;
  frequency: string;
  materialType: string;
  containerSize: string;
  binQuantity?: number;
}

interface Quote {
  id: string;
  serviceRequest: ServiceRequest;
  baseRate: number;
  franchiseFeeAmount: number;
  fuelSurchargeAmount: number;
  deliveryFee: number;
  salesTax?: number;
  addOns?: number;
  totalMonthlyCost: number;
  status: string;
  notes?: string;
  pricingSource?: string;
  localTaxAmount?: number;
}

interface ExportConfig {
  companyName: string;
  requestorName: string;
  exportFormat: string;
  includeDetails: boolean;
  includeSummary: boolean;
  includeNotes: boolean;
  theme: string;
  customLogo: string;
}

// Helper function to parse dollar amounts
const parseDollarAmount = (dollarString: string): number => {
  if (!dollarString) return 0;
  return parseFloat(dollarString.replace(/[$,]/g, '')) || 0;
};

// Sample data from the CSV
const sampleQuotes: Quote[] = [
  {
    id: "1",
    serviceRequest: {
      address: "4004 Irvington Blvd",
      city: "Houston",
      state: "TX",
      zipCode: "77009",
      equipmentType: "Front Load",
      frequency: "1x",
      materialType: "MSW",
      containerSize: "8yd",
      binQuantity: 1
    },
    baseRate: 129.90,
    franchiseFeeAmount: 5.20,
    fuelSurchargeAmount: 19.49,
    deliveryFee: 100.00,
    salesTax: 8.36,
    addOns: 0.00,
    totalMonthlyCost: 167.33,
    status: "success",
    notes: "Standard service - no special requirements"
  },
  {
    id: "2",
    serviceRequest: {
      address: "1101 Elder St",
      city: "Houston",
      state: "TX",
      zipCode: "77007",
      equipmentType: "Front Load",
      frequency: "1x",
      materialType: "MSW",
      containerSize: "8yd",
      binQuantity: 2
    },
    baseRate: 129.90,
    franchiseFeeAmount: 5.20,
    fuelSurchargeAmount: 19.49,
    deliveryFee: 100.00,
    salesTax: 8.36,
    addOns: 0.00,
    totalMonthlyCost: 167.33,
    status: "success",
    notes: "Access via back alley"
  },
  {
    id: "3",
    serviceRequest: {
      address: "2136 W 34th St",
      city: "Houston",
      state: "TX",
      zipCode: "77018",
      equipmentType: "Front Load",
      frequency: "2x",
      materialType: "MSW",
      containerSize: "8yd",
      binQuantity: 1
    },
    baseRate: 259.80,
    franchiseFeeAmount: 10.39,
    fuelSurchargeAmount: 38.97,
    deliveryFee: 100.00,
    salesTax: 16.73,
    addOns: 0.00,
    totalMonthlyCost: 334.67,
    status: "success",
    notes: "High volume location"
  },
  {
    id: "4",
    serviceRequest: {
      address: "4004 Irvington Blvd",
      city: "Houston",
      state: "TX",
      zipCode: "77009",
      equipmentType: "Front Load",
      frequency: "3x",
      materialType: "MSW",
      containerSize: "6yd",
      binQuantity: 3
    },
    baseRate: 292.28,
    franchiseFeeAmount: 11.69,
    fuelSurchargeAmount: 43.84,
    deliveryFee: 100.00,
    salesTax: 18.82,
    addOns: 0.00,
    totalMonthlyCost: 376.50,
    status: "success",
    notes: "Smaller container for space constraints"
  },
  {
    id: "5",
    serviceRequest: {
      address: "4004 Irvington Blvd",
      city: "Houston",
      state: "TX",
      zipCode: "77009",
      equipmentType: "Front Load",
      frequency: "3x",
      materialType: "MSW",
      containerSize: "8yd",
      binQuantity: 2
    },
    baseRate: 389.70,
    franchiseFeeAmount: 15.59,
    fuelSurchargeAmount: 58.46,
    deliveryFee: 100.00,
    salesTax: 25.10,
    addOns: 0.00,
    totalMonthlyCost: 502.00,
    status: "success",
    notes: "Premium service level"
  },
  {
    id: "6",
    serviceRequest: {
      address: "3724 Fulton St",
      city: "Houston",
      state: "TX",
      zipCode: "77009",
      equipmentType: "Front Load",
      frequency: "2x",
      materialType: "MSW",
      containerSize: "8yd",
      binQuantity: 1
    },
    baseRate: 259.80,
    franchiseFeeAmount: 10.39,
    fuelSurchargeAmount: 38.97,
    deliveryFee: 100.00,
    salesTax: 16.73,
    addOns: 0.00,
    totalMonthlyCost: 334.67,
    status: "success",
    notes: "Standard commercial service"
  },
  {
    id: "7",
    serviceRequest: {
      address: "4500 N Main",
      city: "Houston",
      state: "TX",
      zipCode: "77009",
      equipmentType: "Front Load",
      frequency: "3x",
      materialType: "MSW",
      containerSize: "8yd",
      binQuantity: 4
    },
    baseRate: 389.70,
    franchiseFeeAmount: 15.59,
    fuelSurchargeAmount: 58.46,
    deliveryFee: 100.00,
    salesTax: 25.10,
    addOns: 0.00,
    totalMonthlyCost: 502.00,
    status: "success",
    notes: "High-traffic location"
  },
  {
    id: "8",
    serviceRequest: {
      address: "3808 Fulton St",
      city: "Houston",
      state: "TX",
      zipCode: "77009",
      equipmentType: "Front Load",
      frequency: "1x",
      materialType: "MSW",
      containerSize: "8yd",
      binQuantity: 1
    },
    baseRate: 129.90,
    franchiseFeeAmount: 5.20,
    fuelSurchargeAmount: 19.49,
    deliveryFee: 100.00,
    salesTax: 8.36,
    addOns: 0.00,
    totalMonthlyCost: 167.33,
    status: "success",
    notes: "Easy access location"
  }
];

interface EnhancedQuoteGeneratorProps {
  processedQuotes?: Quote[];
  onExport?: (format: string, config: ExportConfig) => void;
}

const EnhancedQuoteGenerator: React.FC<EnhancedQuoteGeneratorProps> = ({ 
  processedQuotes = sampleQuotes, 
  onExport 
}) => {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    companyName: 'Sample Company',
    requestorName: 'John Doe',
    exportFormat: 'professional',
    includeDetails: true,
    includeSummary: true,
    includeNotes: false,
    theme: 'green',
    customLogo: ''
  });

  const [showExportModal, setShowExportModal] = useState(false);

  const getCurrentDate = (): string => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  const quoteSummary = {
    totalLocations: processedQuotes.length,
    successfulQuotes: processedQuotes.filter(q => q.status === 'success').length,
    totalMonthlyRevenue: processedQuotes.reduce((sum, quote) => 
      quote.status === 'success' ? sum + quote.totalMonthlyCost : sum, 0
    ),
    totalAnnualRevenue: processedQuotes.reduce((sum, quote) => 
      quote.status === 'success' ? sum + (quote.totalMonthlyCost * 12) : sum, 0
    )
  };

  const exportAsCSV = (): void => {
    const headers = [
      'Address',
      'City',
      'State',
      'Zip Code',
      'Equipment',
      'Frequency',
      'Container',
      'Material',
      'Bin Quantity',
      'Status',
      'Franchise Fee',
      'Sales Tax (8.25%)',
      'Fuel Surcharge',
      'Add-ons',
      'Monthly Base Rate',
      'Total Monthly Cost',
      'Delivery Fee',
      'Notes'
    ];

    // CRITICAL FIX: Use processedQuotes directly - already in perfect import order
    // NO SORTING - order is already preserved from original import sequence
    
    console.log('📊 ENHANCED CSV Export - PERFECT ORDER PRESERVATION:', {
      totalQuotes: processedQuotes.length,
      REQUIREMENT_2_ORDER_PRESERVED: 'PERFECT - No sorting applied, original import sequence maintained',
      firstQuoteId: processedQuotes[0]?.serviceRequest.id,
      lastQuoteId: processedQuotes[processedQuotes.length - 1]?.serviceRequest.id
    });

    const csvContent = [
      headers.join(','),
      ...processedQuotes.map((quote) => [
        `"${quote.serviceRequest.address}"`,
        `"${quote.serviceRequest.city}"`,
        `"${quote.serviceRequest.state}"`,
        `"${quote.serviceRequest.zipCode}"`,
        `"${quote.serviceRequest.equipmentType}"`,
        `"${quote.serviceRequest.frequency}"`,
        `"${quote.serviceRequest.containerSize}"`,
        `"${quote.serviceRequest.materialType || 'Solid Waste'}"`,
        quote.serviceRequest.binQuantity || 1,
        quote.status === 'success' ? 'Success' : 'Not Serviceable',
        quote.franchiseFeeAmount.toFixed(2),
        (quote.localTaxAmount || 0).toFixed(2),
        quote.fuelSurchargeAmount.toFixed(2),
        (quote.addOns || 0).toFixed(2),
        quote.baseRate.toFixed(2),
        quote.totalMonthlyCost.toFixed(2),
        quote.deliveryFee.toFixed(2),
        `"${quote.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `quotes_${exportConfig.companyName.replace(/\s+/g, '_')}_${getCurrentDate().replace(/\//g, '')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onExport) {
      onExport('csv', exportConfig);
    }
  };

  const exportAsXLSX = (): void => {
    const headers = [
      'Address',
      'City',
      'State',
      'Zip Code',
      'Equipment',
      'Frequency',
      'Container',
      'Material',
      'Bin Quantity',
      'Status',
      'Franchise Fee',
      'Sales Tax (8.25%)',
      'Fuel Surcharge',
      'Add-ons',
      'Monthly Base Rate',
      'Total Monthly Cost',
      'Delivery Fee',
      'Notes'
    ];

    // CRITICAL FIX: Use processedQuotes directly - already in perfect import order
    // NO SORTING - order is already preserved from original import sequence
    
    console.log('📊 ENHANCED Excel Export - PERFECT ORDER PRESERVATION:', {
      totalQuotes: processedQuotes.length,
      REQUIREMENT_2_ORDER_PRESERVED: 'PERFECT - No sorting applied, original import sequence maintained',
      firstQuoteId: processedQuotes[0]?.serviceRequest.id,
      lastQuoteId: processedQuotes[processedQuotes.length - 1]?.serviceRequest.id
    });

    const data = [
      headers,
      ...processedQuotes.map((quote) => [
        quote.serviceRequest.address,
        quote.serviceRequest.city,
        quote.serviceRequest.state,
        quote.serviceRequest.zipCode,
        quote.serviceRequest.equipmentType,
        quote.serviceRequest.frequency,
        quote.serviceRequest.containerSize,
        quote.serviceRequest.materialType || 'Solid Waste',
        quote.serviceRequest.binQuantity || 1,
        quote.status === 'success' ? 'Success' : 'Not Serviceable',
        quote.franchiseFeeAmount,
        (quote.localTaxAmount || 0),
        quote.fuelSurchargeAmount,
        (quote.addOns || 0),
        quote.baseRate,
        quote.totalMonthlyCost,
        quote.deliveryFee,
        quote.notes || ''
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // Apply currency formatting to monetary columns
    const currencyColumns = ['K', 'L', 'M', 'N', 'O', 'P']; // Franchise Fee through Delivery Fee (adjusted for removed column)
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    
    for (let row = 1; row <= range.e.r; row++) { // Start from row 1 (skip header)
      currencyColumns.forEach(col => {
        const cellAddress = col + (row + 1);
        if (worksheet[cellAddress] && typeof worksheet[cellAddress].v === 'number') {
          worksheet[cellAddress].z = '"$"#,##0.00'; // Currency format
        }
      });
    }
    
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

    XLSX.writeFile(workbook, `quotes_${exportConfig.companyName.replace(/\s+/g, '_')}_${getCurrentDate().replace(/\//g, '')}.xlsx`);

    if (onExport) {
      onExport('xlsx', exportConfig);
    }
  };

  const exportAsProfessionalDocument = (): void => {
    const currentDate = getCurrentDate();
    const companyConfig = exportConfig.customLogo 
      ? { ...FRONTIER_COMPANY_CONFIG, logo: exportConfig.customLogo }
      : FRONTIER_COMPANY_CONFIG;
      
    const selectedTheme = FRONTIER_THEMES[exportConfig.theme || 'green'];
    
    // CRITICAL FIX: Use processedQuotes directly - already in perfect import order
    // NO SORTING - order is already preserved from original import sequence
    
    console.log('📊 PROFESSIONAL Document Export - PERFECT ORDER PRESERVATION:', {
      totalQuotes: processedQuotes.length,
      REQUIREMENT_2_ORDER_PRESERVED: 'PERFECT - No sorting applied, original import sequence maintained'
    });
    
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Quote for ${exportConfig.companyName}</title>
  <meta charset="UTF-8">
  <style>
    ${generateThemedCSS(selectedTheme)}
  </style>
</head>
<body>
  ${generateCompanyHeader(exportConfig.companyName, currentDate, companyConfig)}

  ${exportConfig.includeSummary ? `
    <div class="summary-header">
      <div class="summary-stats">
        <div class="stat-item">
          <div class="stat-value">${quoteSummary.totalLocations}</div>
          <div class="stat-label">Total Locations</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${quoteSummary.successfulQuotes}</div>
          <div class="stat-label">Successful Quotes</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">$${quoteSummary.totalMonthlyRevenue.toFixed(2)}</div>
          <div class="stat-label">Monthly Revenue</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">$${quoteSummary.totalAnnualRevenue.toFixed(2)}</div>
          <div class="stat-label">Annual Revenue</div>
        </div>
      </div>
    </div>
  ` : ''}

  <table class="quotes-table">
    <thead>
      <tr>
        <th>Address</th>
        <th>Equipment</th>
        <th>Frequency</th>
        <th>Container</th>
        <th>Bin Qty</th>
        <th>Status</th>
        <th>Franchise Fee</th>
        <th>Sales Tax</th>
        <th>Fuel Surcharge</th>
        <th>Add-ons</th>
        <th>Monthly Base Rate</th>
        <th>Total Monthly Cost</th>
        <th>Delivery Fee</th>
      </tr>
    </thead>
    <tbody>
      ${processedQuotes.map((quote) => `
        <tr>
          <td>${quote.serviceRequest.address}</td>
          <td>${quote.serviceRequest.equipmentType}</td>
          <td>${quote.serviceRequest.frequency}</td>
          <td>${quote.serviceRequest.containerSize}</td>
          <td>${quote.serviceRequest.binQuantity || 1}</td>
          <td class="${quote.status === 'success' ? 'status-success' : 'status-failed'}">
            ${quote.status === 'success' ? 'Serviceable' : 'Failed'}
          </td>
          <td>${quote.serviceRequest.city.toLowerCase() === 'corpus christi' 
            ? `$${quote.franchiseFeeAmount.toFixed(2)} ($0.91/YD)`
            : `$${quote.franchiseFeeAmount.toFixed(2)} (${quote.franchiseFeeRate || 0}%)`}</td>
          <td>${(quote.salesTax || 0).toFixed(2)}</td>
          <td>${quote.fuelSurchargeAmount.toFixed(2)}</td>
          <td>${(quote.addOns || 0).toFixed(2)}</td>
          <td>${quote.baseRate.toFixed(2)}</td>
          <td>${quote.totalMonthlyCost.toFixed(2)}</td>
          <td>${quote.deliveryFee.toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  ${exportConfig.includeSummary ? `
    <div class="totals-section">
      <div class="totals-title">Quote Summary</div>
      <div class="totals-grid">
        <div class="total-item">
          <span class="total-label">Total Monthly Service Cost:</span>
          <span class="total-value">$${quoteSummary.totalMonthlyRevenue.toFixed(2)}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Annual Service Cost:</span>
          <span class="total-value">$${quoteSummary.totalAnnualRevenue.toFixed(2)}</span>
        </div>
      </div>
    </div>
  ` : ''}

  ${generateCompanyFooter(currentDate, companyConfig)}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `quote_${exportConfig.companyName.replace(/\s+/g, '_')}_${getCurrentDate().replace(/\//g, '')}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onExport) {
      onExport('professional', exportConfig);
    }
  };

  const handleExport = (): void => {
    if (exportConfig.exportFormat === 'csv') {
      exportAsCSV();
    } else if (exportConfig.exportFormat === 'xlsx') {
      exportAsXLSX();
    } else {
      exportAsProfessionalDocument();
    }
    setShowExportModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FileText className="mr-3 text-green-600" size={28} />
          Quote Generator
        </h2>
        <button
          onClick={() => setShowExportModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Download className="mr-2" size={16} />
          Customize Service Report
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{quoteSummary.totalLocations}</div>
          <div className="text-sm text-blue-500">Total Locations</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{quoteSummary.successfulQuotes}</div>
          <div className="text-sm text-green-500">Successful Quotes</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">${quoteSummary.totalMonthlyRevenue.toFixed(2)}</div>
          <div className="text-sm text-purple-500">Monthly Revenue</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">${quoteSummary.totalAnnualRevenue.toFixed(2)}</div>
          <div className="text-sm text-orange-500">Annual Revenue</div>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="border px-2 py-2 text-left">Address</th>
              <th className="border px-2 py-2 text-left">City</th>
              <th className="border px-2 py-2 text-left">State</th>
              <th className="border px-2 py-2 text-left">Zip Code</th>
              <th className="border px-2 py-2 text-left">Equipment</th>
              <th className="border px-2 py-2 text-left">Frequency</th>
              <th className="border px-2 py-2 text-left">Container</th>
              <th className="border px-2 py-2 text-left">Material</th>
              <th className="border px-2 py-2 text-left">Bin Qty</th>
              <th className="border px-2 py-2 text-left">Status</th>
              <th className="border px-2 py-2 text-left">Franchise Fee</th>
              <th className="border px-2 py-2 text-left">Sales Tax (8.25%)</th>
              <th className="border px-2 py-2 text-left">Fuel Surcharge</th>
              <th className="border px-2 py-2 text-left">Add-ons</th>
              <th className="border px-2 py-2 text-left">Monthly Base Rate</th>
              <th className="border px-2 py-2 text-left">Total Monthly Cost</th>
            </tr>
          </thead>
          <tbody>
            {processedQuotes.map((quote, index) => (
              <tr key={quote.id} className="hover:bg-gray-50">
                <td className="border px-2 py-2">{quote.serviceRequest.address}</td>
                <td className="border px-2 py-2">{quote.serviceRequest.city}</td>
                <td className="border px-2 py-2">{quote.serviceRequest.state}</td>
                <td className="border px-2 py-2">{quote.serviceRequest.zipCode}</td>
                <td className="border px-2 py-2">{quote.serviceRequest.equipmentType}</td>
                <td className="border px-2 py-2">{quote.serviceRequest.frequency}</td>
                <td className="border px-2 py-2">{quote.serviceRequest.containerSize}</td>
                <td className="border px-2 py-2">{quote.serviceRequest.materialType || 'Solid Waste'}</td>
                <td className="border px-2 py-2">{quote.serviceRequest.binQuantity || 1}</td>
                <td className="border px-2 py-2">
                  <span className={`flex items-center ${
                    quote.status === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {quote.status === 'success' ? (
                      <CheckCircle className="mr-1" size={12} />
                    ) : (
                      <AlertCircle className="mr-1" size={12} />
                    )}
                    {quote.status === 'success' ? 'Serviceable' : 'Failed'}
                  </span>
                </td>
                <td className="border px-2 py-2">${quote.franchiseFeeAmount.toFixed(2)}</td>
                <td className="border px-2 py-2">${(quote.localTaxAmount || 0).toFixed(2)}</td>
                <td className="border px-2 py-2">${quote.fuelSurchargeAmount.toFixed(2)}</td>
                <td className="border px-2 py-2">${(quote.addOns || 0).toFixed(2)}</td>
                <td className="border px-2 py-2">${quote.baseRate.toFixed(2)}</td>
                <td className="border px-2 py-2">${quote.totalMonthlyCost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Configuration Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Configure Export Settings</h3>
            
            {/* Company Information */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <Building className="mr-2" size={18} />
                Company Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={exportConfig.companyName}
                    onChange={(e) => setExportConfig({...exportConfig, companyName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requestor Name
                  </label>
                  <input
                    type="text"
                    value={exportConfig.requestorName}
                    onChange={(e) => setExportConfig({...exportConfig, requestorName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter requestor name"
                  />
                </div>
              </div>
            </div>
            
            {/* Document Appearance */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <Palette className="mr-2" size={18} />
                Document Appearance
              </h4>
              
              {/* Theme Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Theme
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(FRONTIER_THEMES).map(([key, theme]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setExportConfig({...exportConfig, theme: key})}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        exportConfig.theme === key 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className="w-full h-4 rounded mb-2"
                        style={{ 
                          background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` 
                        }}
                      ></div>
                      <div className="text-xs font-medium capitalize">{key}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Custom Logo Option */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Logo Path (Optional)
                </label>
                <input
                  type="text"
                  value={exportConfig.customLogo}
                  onChange={(e) => setExportConfig({...exportConfig, customLogo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="/images/your-logo.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to use default Frontier Waste Solutions logo
                </p>
              </div>
            </div>

            {/* Export Format */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Export Format</h4>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="professional"
                    checked={exportConfig.exportFormat === 'professional'}
                    onChange={(e) => setExportConfig({...exportConfig, exportFormat: e.target.value})}
                    className="mr-2"
                  />
                  Professional Document (HTML)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="xlsx"
                    checked={exportConfig.exportFormat === 'xlsx'}
                    onChange={(e) => setExportConfig({...exportConfig, exportFormat: e.target.value})}
                    className="mr-2"
                  />
                  Excel Spreadsheet (XLSX)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="csv"
                    checked={exportConfig.exportFormat === 'csv'}
                    onChange={(e) => setExportConfig({...exportConfig, exportFormat: e.target.value})}
                    className="mr-2"
                  />
                  CSV Export
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Professional documents download as HTML files that can be opened in any browser and printed or saved as PDF. Excel files can be opened in Microsoft Excel or similar spreadsheet applications.
              </p>
            </div>

            {/* Additional Options */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Additional Options</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeDetails}
                    onChange={(e) => setExportConfig({...exportConfig, includeDetails: e.target.checked})}
                    className="mr-2"
                  />
                  Include detailed breakdown
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeSummary}
                    onChange={(e) => setExportConfig({...exportConfig, includeSummary: e.target.checked})}
                    className="mr-2"
                  />
                  Include summary statistics
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeNotes}
                    onChange={(e) => setExportConfig({...exportConfig, includeNotes: e.target.checked})}
                    className="mr-2"
                  />
                  Include notes and comments
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="mr-2" size={16} />
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedQuoteGenerator;