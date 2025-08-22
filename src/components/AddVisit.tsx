import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Calendar, Clock, Euro, Bell, ArrowLeft } from 'lucide-react';
import { Visit } from '../types';

interface AddVisitProps {
  onSubmit: (visit: Omit<Visit, 'id'> | Visit) => void;
  editingVisit?: Visit | null;
  onCancel: () => void;
}

const AddVisit: React.FC<AddVisitProps> = ({ onSubmit, editingVisit, onCancel }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    insuranceCompany: '',
    location: '',
    date: '',
    time: '',
    revenue: '',
    reminder: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const insuranceCompanies = [
    'AXA',
    'Allianz',
    'MAPFRE',
    'Zurich',
    'Sanitas',
    'DKV',
    'Adeslas'
  ];

  const locations = [
    'Clinic Barcelona Centro',
    'Clinic Barcelona Norte',
    'Clinic Barcelona Sur',
    'Clinic Barcelona Este',
    'Clinic Barcelona Oeste'
  ];

  useEffect(() => {
    if (editingVisit) {
      setFormData({
        patientName: editingVisit.patientName,
        insuranceCompany: editingVisit.insuranceCompany,
        location: editingVisit.location,
        date: editingVisit.date,
        time: editingVisit.time,
        revenue: editingVisit.revenue.toString(),
        reminder: editingVisit.reminder
      });
    }
  }, [editingVisit]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }

    if (!formData.insuranceCompany) {
      newErrors.insuranceCompany = 'Insurance company is required';
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.revenue || parseFloat(formData.revenue) <= 0) {
      newErrors.revenue = 'Revenue must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const visitData = {
        ...formData,
        revenue: parseFloat(formData.revenue)
      };

      if (editingVisit) {
        onSubmit({ ...visitData, id: editingVisit.id });
      } else {
        onSubmit(visitData);
      }

      // Reset form if not editing
      if (!editingVisit) {
        setFormData({
          patientName: '',
          insuranceCompany: '',
          location: '',
          date: '',
          time: '',
          revenue: '',
          reminder: false
        });
      }
    } catch (error) {
      console.error('Error submitting visit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="pt-16 md:pt-20 px-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 md:mb-8">
          <button
            onClick={onCancel}
            className="md:hidden p-2 -ml-2 mr-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {editingVisit ? 'Edit Visit' : 'Add Visit'}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
          <div className="space-y-6">
            {/* Patient Name */}
            <div>
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                Patient name
              </label>
              <input
                type="text"
                id="patientName"
                value={formData.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.patientName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter patient name"
              />
              {errors.patientName && (
                <p className="mt-1 text-sm text-red-600">{errors.patientName}</p>
              )}
            </div>

            {/* Insurance Company */}
            <div>
              <label htmlFor="insuranceCompany" className="block text-sm font-medium text-gray-700 mb-2">
                Insurance company
              </label>
              <div className="relative">
                <select
                  id="insuranceCompany"
                  value={formData.insuranceCompany}
                  onChange={(e) => handleInputChange('insuranceCompany', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none ${
                    errors.insuranceCompany ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select insurance company</option>
                  {insuranceCompanies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.insuranceCompany && (
                <p className="mt-1 text-sm text-red-600">{errors.insuranceCompany}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <select
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.date ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.time ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                )}
              </div>
            </div>

            {/* Revenue */}
            <div>
              <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-2">
                Revenue
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="revenue"
                  value={formData.revenue}
                  onChange={(e) => handleInputChange('revenue', e.target.value)}
                  className={`w-full px-4 py-3 pl-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.revenue ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="150"
                  min="0"
                  step="0.01"
                />
                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.revenue && (
                <p className="mt-1 text-sm text-red-600">{errors.revenue}</p>
              )}
            </div>

            {/* Reminder */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Reminder</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.reminder}
                  onChange={(e) => handleInputChange('reminder', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                  formData.reminder ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                    formData.reminder ? 'translate-x-5' : 'translate-x-0.5'
                  } mt-0.5`}></div>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col md:flex-row gap-3 mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (editingVisit ? 'Update Visit' : 'Save')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="hidden md:block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVisit;