import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Visit } from '../types';

// Simple in-memory visit store used for demo purposes.
// Data is cleared whenever the page refreshes or the user changes.
export const useVisits = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Reset visits whenever the authenticated user changes
  useEffect(() => {
    setVisits([]);
  }, [user]);

  const fetchVisits = async () => {
    // No remote data to load, but keep the API for compatibility
    setLoading(false);
    setError(null);
  };

  const addVisit = async (visitData: Omit<Visit, 'id'>): Promise<Visit> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const newVisit: Visit = {
      id: Date.now().toString(),
      ...visitData
    };
    setVisits(prev => [...prev, newVisit]);
    return newVisit;
  };

  const updateVisit = async (visitData: Visit): Promise<Visit> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setVisits(prev => prev.map(v => (v.id === visitData.id ? visitData : v)));
    return visitData;
  };

  const deleteVisit = async (visitId: string): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setVisits(prev => prev.filter(v => v.id !== visitId));
  };

  // initial fetch on mount/user change
  useEffect(() => {
    fetchVisits();
  }, [user]);

  return {
    visits,
    loading,
    error,
    addVisit,
    updateVisit,
    deleteVisit,
    refetch: fetchVisits
  };
};
