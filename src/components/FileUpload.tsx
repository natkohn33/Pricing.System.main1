import React, { useCallback } from 'react';
import { isSupportedFile } from '../utils/excelParser';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  accept?: string;
  title: string;
  description: string;
  uploadedFile?: File | null;
  onClearFile?: () => void;
}

export function FileUpload({ 
  onFileUpload, 
  accept = '.csv,.xlsx,.xls', 
  title, 
  description,
  uploadedFile,
  onClearFile
}: FileUploadProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && isSupportedFile(files[0])) {
      onFileUpload(files[0]);
    } else {
      alert('Please upload a supported file format:\n- CSV (.csv)\n- Excel (.xlsx, .xls)\n\nMake sure your file contains proper column headers like Address, City, State, Zip Code, etc.');
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isSupportedFile(file)) {
        onFileUpload(file);
      } else {
        alert('Please upload a supported file format:\n- CSV (.csv)\n- Excel (.xlsx, .xls)\n\nMake sure your file contains proper column headers like Address, City, State, Zip Code, etc.');
        // Reset the input
        e.target.value = '';
      }
    }
  }, [onFileUpload]);

  if (uploadedFile) {
    return (
      <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="text-lg font-medium text-green-800">{title}</h3>
              <p className="text-green-600">{uploadedFile.name}</p>
              <p className="text-sm text-green-500">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          {onClearFile && (
            <button
              onClick={onClearFile}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
    >
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
        <div className="mt-4">
          <label htmlFor={`file-upload-${title.replace(/\s+/g, '-')}`} className="cursor-pointer">
            <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Choose file
            </span>
            <input
              id={`file-upload-${title.replace(/\s+/g, '-')}`}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="sr-only"
            />
          </label>
        </div>
      </div>
    </div>
  );
}