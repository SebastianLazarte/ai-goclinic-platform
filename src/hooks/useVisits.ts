import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Visit } from '../types';

export const useVisits = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch visits from Supabase
  const fetchVisits = async () => {
    if (!user) {
      setVisits([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('visits')
        .select('*')
        .eq('user_id', user.id)
        .order('visit_date', { ascending: true })
        .order('visit_time', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      // Transform database rows to Visit interface
      const transformedVisits: Visit[] = (data || []).map(row => ({
        id: row.id.toString(),
        patientName: row.patient_name,
        insuranceCompany: row.insurance_company,
        location: row.location,
        date: row.visit_date,
        time: row.visit_time,
        revenue: row.revenue,
        reminder: row.reminder
      }));

      setVisits(transformedVisits);
    } catch (err) {
      console.error('Error fetching visits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch visits');
    } finally {
      setLoading(false);
    }
  };

  // Add a new visit
  const addVisit = async (visitData: Omit<Visit, 'id'>): Promise<Visit> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error: insertError } = await supabase
        .from('visits')
        .insert({
          patient_name: visitData.patientName,
          insurance_company: visitData.insuranceCompany,
          location: visitData.location,
          visit_date: visitData.date,
          visit_time: visitData.time,
          revenue: visitData.revenue,
          reminder: visitData.reminder,
          user_id: user.id
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Transform the returned data to Visit interface
      const newVisit: Visit = {
        id: data.id.toString(),
        patientName: data.patient_name,
        insuranceCompany: data.insurance_company,
        location: data.location,
        date: data.visit_date,
        time: data.visit_time,
        revenue: data.revenue,
        reminder: data.reminder
      };

      // Update local state
      setVisits(prev => [...prev, newVisit]);
      
      return newVisit;
    } catch (err) {
      console.error('Error adding visit:', err);
      throw err instanceof Error ? err : new Error('Failed to add visit');
    }
  };

  // Update an existing visit
  const updateVisit = async (visitData: Visit): Promise<Visit> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error: updateError } = await supabase
        .from('visits')
        .update({
          patient_name: visitData.patientName,
          insurance_company: visitData.insuranceCompany,
          location: visitData.location,
          visit_date: visitData.date,
          visit_time: visitData.time,
          revenue: visitData.revenue,
          reminder: visitData.reminder
        })
        .eq('id', parseInt(visitData.id))
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Transform the returned data to Visit interface
      const updatedVisit: Visit = {
        id: data.id.toString(),
        patientName: data.patient_name,
        insuranceCompany: data.insurance_company,
        location: data.location,
        date: data.visit_date,
        time: data.visit_time,
        revenue: data.revenue,
        reminder: data.reminder
      };

      // Update local state
      setVisits(prev => prev.map(visit => 
        visit.id === visitData.id ? updatedVisit : visit
      ));
      
      return updatedVisit;
    } catch (err) {
      console.error('Error updating visit:', err);
      throw err instanceof Error ? err : new Error('Failed to update visit');
    }
  };

  // Delete a visit
  const deleteVisit = async (visitId: string): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { error: deleteError } = await supabase
        .from('visits')
        .delete()
        .eq('id', parseInt(visitId))
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setVisits(prev => prev.filter(visit => visit.id !== visitId));
    } catch (err) {
      console.error('Error deleting visit:', err);
      throw err instanceof Error ? err : new Error('Failed to delete visit');
    }
  };

  // Load visits when user changes
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