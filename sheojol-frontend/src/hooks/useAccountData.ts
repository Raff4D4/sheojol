'use client';

import { useCallback, useEffect, useState } from 'react';
import { ShelterApi } from '@/lib/api';
import { Shelter } from '@/types/shelter';
import { AuthUser, PasswordChangePayload } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';

export function useAccountData() {
  const { user, updateProfile, changePassword } = useAuth();
  const [contributions, setContributions] = useState<Shelter[]>([]);
  const [favorites, setFavorites] = useState<Shelter[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([ShelterApi.mine(), ShelterApi.favorites()])
      .then(([mine, favs]) => {
        if (!active) return;
        setContributions(mine);
        setFavorites(favs);
      })
      .catch(() => {
        if (!active) return;
        setContributions([]);
        setFavorites([]);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const removeFavorite = useCallback(async (id: number) => {
    await ShelterApi.unfavorite(id);
    setFavorites((current) => current.filter((item) => item.id !== id));
  }, []);

  const saveProfile = useCallback(
    async (payload: Partial<Pick<AuthUser, 'name' | 'phone' | 'vehicle' | 'app'>>) => {
      await updateProfile(payload);
    },
    [updateProfile],
  );

  const savePassword = useCallback(
    async (payload: PasswordChangePayload) => {
      await changePassword(payload);
    },
    [changePassword],
  );

  return { user, contributions, favorites, ready, removeFavorite, saveProfile, savePassword };
}