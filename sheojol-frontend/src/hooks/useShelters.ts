'use client';

import { useCallback, useEffect, useState } from 'react';
import { Shelter } from '@/types/shelter';
import { ShelterApi } from '@/lib/api';
import { DEMO_SHELTERS } from '@/lib/demo';

interface UseSheltersResult {
  shelters: Shelter[];
  loading: boolean;
  error: string | null;
  isDemo: boolean;
  load: () => Promise<void>;
  addShelter: (shelter: Shelter) => void;
}

export function useShelters(): UseSheltersResult {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ShelterApi.list();
      if (data.length > 0) {
        setShelters(data);
        setIsDemo(false);
      } else {
        setShelters(DEMO_SHELTERS);
        setIsDemo(true);
      }
    } catch {
      setError('Backend lokal tidak terjangkau, menampilkan data contoh.');
      setShelters(DEMO_SHELTERS);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addShelter = useCallback((shelter: Shelter) => {
    setShelters((current) => [shelter, ...current]);
  }, []);

  return { shelters, loading, error, isDemo, load, addShelter };
}