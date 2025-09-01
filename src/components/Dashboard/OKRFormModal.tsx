import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface OKRFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OKRFormData {
  title: string;
  description: string;
  owner: string;
  category: string;
  startDate: string;
  endDate: string;
  keyResults: {
    title: string;
    targetValue: string;
    currentValue: string;
    unit: string;
  }[];
}

export function OKRFormModal({ isOpen, onClose }: OKRFormModalProps) {
  const [formData, setFormData] = useState<OKRFormData>({
    title: '',
    description: '',
    owner: '',
    category: 'quality',
    startDate: '',
    endDate: '',
    keyResults: [
      {
        title: '',
        targetValue: '',
        currentValue: '',
        unit: '%',
      },
    ],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleKeyResultChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedKeyResults = [...formData.keyResults];
    updatedKeyResults[index] = {
      ...updatedKeyResults[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      keyResults: updatedKeyResults,
    });
  };

  const addKeyResult = () => {
    setFormData({
      ...formData,
      keyResults: [
        ...formData.keyResults,
        {
          title: '',
          targetValue: '',
          currentValue: '',
          unit: '%',
        },
      ],
    });
  };

  const removeKeyResult = (index: number) => {
    if (formData.keyResults.length > 1) {
      const updatedKeyResults = [...formData.keyResults];
      updatedKeyResults.splice(index, 1);
      setFormData({
        ...formData,
        keyResults: updatedKeyResults,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('OKR Form Data:', formData);
    // Reset form
    setFormData({
      title: '',
      description: '',
      owner: '',
      category: 'quality',
      startDate: '',
      endDate: '',
      keyResults: [
        {
          title: '',
          targetValue: '',
          currentValue: '',
          unit: '%',
        },
      ],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Add New OKR</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Objective Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">
              Objective Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                  Objective Title*
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter objective title"
                />
              </div>
              
              <div>
                <label htmlFor="owner" className="block text-sm font-medium text-slate-700 mb-1">
                  Owner*
                </label>
                <input
                  id="owner"
                  name="owner"
                  type="text"
                  value={formData.owner}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter owner name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter objective description"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                  Category*
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="quality">Quality</option>
                  <option value="efficiency">Efficiency</option>
                  <option value="clinical">Clinical</option>
                  <option value="safety">Safety</option>
                  <option value="workforce">Workforce</option>
                  <option value="financial">Financial</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date*
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">
                  End Date*
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          {/* Key Results Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="text-lg font-medium text-slate-900">Key Results</h3>
              <button
                type="button"
                onClick={addKeyResult}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                + Add Key Result
              </button>
            </div>
            
            {formData.keyResults.map((keyResult, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-slate-800">Key Result #{index + 1}</h4>
                  {formData.keyResults.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKeyResult(index)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div>
                  <label htmlFor={`keyResults.${index}.title`} className="block text-sm font-medium text-slate-700 mb-1">
                    Title*
                  </label>
                  <input
                    id={`keyResults.${index}.title`}
                    name="title"
                    type="text"
                    value={keyResult.title}
                    onChange={(e) => handleKeyResultChange(index, e)}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter key result title"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor={`keyResults.${index}.targetValue`} className="block text-sm font-medium text-slate-700 mb-1">
                      Target Value*
                    </label>
                    <input
                      id={`keyResults.${index}.targetValue`}
                      name="targetValue"
                      type="text"
                      value={keyResult.targetValue}
                      onChange={(e) => handleKeyResultChange(index, e)}
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter target value"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`keyResults.${index}.currentValue`} className="block text-sm font-medium text-slate-700 mb-1">
                      Current Value
                    </label>
                    <input
                      id={`keyResults.${index}.currentValue`}
                      name="currentValue"
                      type="text"
                      value={keyResult.currentValue}
                      onChange={(e) => handleKeyResultChange(index, e)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter current value"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`keyResults.${index}.unit`} className="block text-sm font-medium text-slate-700 mb-1">
                      Unit*
                    </label>
                    <select
                      id={`keyResults.${index}.unit`}
                      name="unit"
                      value={keyResult.unit}
                      onChange={(e) => handleKeyResultChange(index, e)}
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="%">Percentage (%)</option>
                      <option value="count">#</option>
                      <option value="days">Days</option>
                      <option value="hours">Hours</option>
                      <option value="$">Dollars ($)</option>
                      <option value="points">Points</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="flex justify-end items-center pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save OKR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
