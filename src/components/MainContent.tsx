import React, { useState } from 'react';
import { Check } from 'lucide-react';
import Dashboard from './Dashboard';
import AddVisit from './AddVisit';
import Revenue from './Revenue';
import Navigation from './Navigation';
import FloatingActionButton from './FloatingActionButton';
import { useVisits } from '../hooks/useVisits';
import { Visit } from '../types';

const MainContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'add-visit' | 'revenue' | 'settings' | 'profile'>('dashboard');
  const { visits, loading, error, addVisit, updateVisit, deleteVisit } = useVisits();
  
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);

  const handleAddVisit = async (visit: Omit<Visit, 'id'>) => {
    try {
      await addVisit(visit);
      setSuccessMessage('Visit added successfully');
      setShowSuccessMessage(true);
      setCurrentView('dashboard');
      
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error adding visit:', error);
      // You could add error handling UI here
    }
  };

  const handleEditVisit = async (visit: Visit) => {
    try {
      await updateVisit(visit);
      setEditingVisit(null);
      setSuccessMessage('Visit updated successfully');
      setShowSuccessMessage(true);
      setCurrentView('dashboard');
      
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error updating visit:', error);
      // You could add error handling UI here
    }
  };

  const handleDeleteVisit = async (visitId: string) => {
    try {
      await deleteVisit(visitId);
    } catch (error) {
      console.error('Error deleting visit:', error);
      // You could add error handling UI here
    }
  };

  const startEditVisit = (visit: Visit) => {
    setEditingVisit(visit);
    setCurrentView('add-visit');
  };

  const handleFloatingActionClick = () => {
    setEditingVisit(null);
    setCurrentView('add-visit');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            visits={visits} 
            onEditVisit={startEditVisit}
            onDeleteVisit={handleDeleteVisit}
          />
        );
      case 'add-visit':
        return (
          <AddVisit 
            onSubmit={editingVisit ? handleEditVisit : handleAddVisit}
            editingVisit={editingVisit}
            onCancel={() => {
              setEditingVisit(null);
              setCurrentView('dashboard');
            }}
          />
        );
      case 'revenue':
        return <Revenue visits={visits} />;
      case 'settings':
        return (
          <div className="min-h-screen bg-gray-50 pt-20 px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600">Settings page coming soon...</p>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="min-h-screen bg-gray-50 pt-20 px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile</h1>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600">Profile page coming soon...</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard visits={visits} onEditVisit={startEditVisit} onDeleteVisit={handleDeleteVisit} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      {showSuccessMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-800 font-medium">Loading visits...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="fixed top-20 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="text-red-800 font-medium">Error: {error}</span>
          </div>
        </div>
      )}
      
      {renderCurrentView()}
      
      {currentView !== 'add-visit' && (
        <FloatingActionButton onClick={handleFloatingActionClick} />
      )}
    </div>
  );
};

export default MainContent;