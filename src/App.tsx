import React, { useState, useEffect } from 'react';
import { Calendar, Plus, BarChart3, Settings, User, ChevronDown, MapPin, Clock, Euro, Bell, Check } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import AuthWrapper from './components/auth/AuthWrapper';
import Dashboard from './components/Dashboard';
import AddVisit from './components/AddVisit';
import Revenue from './components/Revenue';
import Navigation from './components/Navigation';
import FloatingActionButton from './components/FloatingActionButton';
import { Visit } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'add-visit' | 'revenue' | 'settings' | 'profile'>('dashboard');
  const [visits, setVisits] = useState<Visit[]>([
    {
      id: '1',
      patientName: 'Maria González',
      insuranceCompany: 'AXA',
      location: 'Clinic Barcelona Centro',
      date: '2024-04-09',
      time: '09:00',
      revenue: 150,
      reminder: true
    },
    {
      id: '2',
      patientName: 'Carlos Martínez',
      insuranceCompany: 'Allianz',
      location: 'Clinic Barcelona Norte',
      date: '2024-04-10',
      time: '10:00',
      revenue: 175,
      reminder: false
    },
    {
      id: '3',
      patientName: 'Ana Rodríguez',
      insuranceCompany: 'MAPFRE',
      location: 'Clinic Barcelona Sur',
      date: '2024-04-10',
      time: '11:00',
      revenue: 160,
      reminder: true
    }
  ]);
  
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);

  const handleAddVisit = (visit: Omit<Visit, 'id'>) => {
    const newVisit: Visit = {
      ...visit,
      id: Date.now().toString()
    };
    setVisits(prev => [...prev, newVisit]);
    setShowSuccessMessage(true);
    setCurrentView('dashboard');
    
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleEditVisit = (visit: Visit) => {
    setVisits(prev => prev.map(v => v.id === visit.id ? visit : v));
    setEditingVisit(null);
    setShowSuccessMessage(true);
    setCurrentView('dashboard');
    
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleDeleteVisit = (visitId: string) => {
    setVisits(prev => prev.filter(v => v.id !== visitId));
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
    <AuthProvider>
      <AuthWrapper>
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      {showSuccessMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              {editingVisit ? 'Visit updated successfully' : 'Visit added successfully'}
            </span>
          </div>
        </div>
      )}
      
      {renderCurrentView()}
      
      {currentView !== 'add-visit' && (
        <FloatingActionButton onClick={handleFloatingActionClick} />
      )}
    </div>
      </AuthWrapper>
    </AuthProvider>
  );
}

export default App;