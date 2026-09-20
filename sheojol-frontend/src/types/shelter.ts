export type ShelterType = 'official' | 'verified' | 'warning';

export type Amenity = 'power_outlet' | 'toilet' | 'cheap_coffee' | 'safe_parking';

export type ShelterStatus = 'active' | 'inactive' | 'maintenance';

export const AMENITY_LIST: Amenity[] = ['power_outlet', 'toilet', 'cheap_coffee', 'safe_parking'];

export interface Shelter {
  id: number;
  name: string;
  type: ShelterType;
  latitude: number;
  longitude: number;
  region: string;
  address: string;
  capacity: number;
  current_occupancy: number;
  facilities: Amenity[];
  status: ShelterStatus;
  distance: number | null;
  is_approved?: boolean;
  submitted_by?: string | null;
  updated_at?: string;
}

export type RegionKey = 'ciledug' | 'bsd' | 'karawaci' | 'tangerang-kota' | 'bintaro' | 'alam-sutera';

export interface Region {
  key: RegionKey;
  label: string;
  center: [number, number];
  bounds: [[number, number], [number, number]];
}