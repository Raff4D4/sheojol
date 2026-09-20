import { Amenity, ShelterType } from '@/types/shelter';

export const SHELTER_TYPE_COLORS: Record<ShelterType, string> = {
  official: '#22c55e',
  verified: '#06b6d4',
  warning: '#ef4444',
};

export const SHELTER_TYPE_LABELS: Record<ShelterType, string> = {
  official: 'Shelter Resmi',
  verified: 'Basecamp / Warkop',
  warning: 'Zona Rawan Garukan',
};

export const AMENITY_META: Record<Amenity, { icon: string; label: string; short: string }> = {
  power_outlet: { icon: '🔌', label: 'Power Outlets', short: 'Colokan' },
  toilet: { icon: '🚽', label: 'Toilets', short: 'Toilet' },
  cheap_coffee: { icon: '☕', label: 'Cheap Coffee', short: 'Kopi Murah' },
  safe_parking: { icon: '🛡️', label: 'Safe Parking', short: 'Parkir Aman' },
};