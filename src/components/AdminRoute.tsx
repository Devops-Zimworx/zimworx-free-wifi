import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';
import { useSupabaseClient } from '../hooks/useSupabaseClient';
import { useAuth } from '../contexts/AuthContext';
import type { SubmissionRecord } from '../types';
import {
  mapSubmissionArray,
  mapSubmissionFromDb,
} from '../utils/submissionMapper';

export function AdminRoute() {
  const supabase = useSupabaseClient();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch submissions from Supabase
  useEffect(() => {
    async function fetchSubmissions() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('phishing_submissions')
          .select('*')
          .order('timestamp', { ascending: false });

        if (error) {
          console.error('Failed to fetch submissions', error);
        } else {
          console.debug('[AdminRoute.fetch] Supabase rows preview', (data || [])
            .slice(0, 3)
            .map((row) => ({
              id: row.id,
              location_tag: row.location_tag,
            })));
          setSubmissions(mapSubmissionArray(data as any));
        }
      } catch (error) {
        console.error('Error fetching submissions', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [supabase]);

  // Set up real-time subscription for new submissions
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('phishing_submissions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'phishing_submissions',
        },
        (payload) => {
          console.log('Real-time update:', payload);

          const mappedNew = payload.new ? mapSubmissionFromDb(payload.new as any) : null;

          if (payload.eventType === 'INSERT') {
            if (mappedNew) {
              console.debug('[AdminRoute.rt] mapped insert', {
                id: mappedNew.id,
                locationTag: mappedNew.locationTag,
              });
              setSubmissions((prev) => [mappedNew, ...prev]);
            }
          } else if (payload.eventType === 'UPDATE') {
            setSubmissions((prev) =>
              prev.map((sub) =>
                sub.id === payload.new.id && mappedNew ? mappedNew : sub
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setSubmissions((prev) => prev.filter((sub) => sub.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Handle individual reveal toggle
  const handleRevealToggle = async (submissionId: string, nextState: boolean) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('phishing_submissions')
        .update({ revealed: nextState })
        .eq('id', submissionId);

      if (error) {
        console.error('Failed to update reveal status', error);
      } else {
        // Update local state immediately for better UX
        setSubmissions((prev) =>
          prev.map((sub) => (sub.id === submissionId ? { ...sub, revealed: nextState } : sub))
        );
      }
    } catch (error) {
      console.error('Error updating reveal status', error);
    }
  };

  // Handle bulk reveal
  const handleBulkReveal = async (submissionIds: string[]) => {
    if (!supabase || submissionIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('phishing_submissions')
        .update({ revealed: true })
        .in('id', submissionIds);

      if (error) {
        console.error('Failed to bulk update reveal status', error);
      } else {
        // Update local state immediately
        setSubmissions((prev) =>
          prev.map((sub) =>
            submissionIds.includes(sub.id) ? { ...sub, revealed: true } : sub
          )
        );
      }
    } catch (error) {
      console.error('Error bulk updating reveal status', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Logout error:', error);
    } else {
      navigate('/admin/login', { replace: true });
    }
  };

  if (loading) {
    return (
      <section className="admin-dashboard">
        <div className="admin-dashboard__loading">
          <p>Loading submissions...</p>
        </div>
      </section>
    );
  }

  return (
    <AdminDashboard
      submissions={submissions}
      onRevealToggle={handleRevealToggle}
      onBulkReveal={handleBulkReveal}
      onLogout={handleLogout}
    />
  );
}
