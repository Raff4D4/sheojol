import axios from 'axios';
import {
  AMENITY_LIST,
  Amenity,
  Shelter,
  ShelterStatus,
  ShelterType,
} from '@/types/shelter';
import {
  AuthPayload,
  AuthUser,
  LoginPayload,
  PasswordChangePayload,
  RegisterPayload,
} from '@/types/auth';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export interface RawShelter {
  id?: number;
  name?: string;
  type?: string;
  category?: string;
  status?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  address?: string;
  capacity?: number;
  current_occupancy?: number;
  facilities?: Amenity[] | Record<string, boolean> | null;
  is_approved?: boolean;
  distance?: number | null;
  submitted_by?: string | null;
  updated_at?: string;
}

export interface ShelterPayload {
  name: string;
  type: ShelterType;
  region: string;
  latitude: number;
  longitude: number;
  address: string;
  capacity: number;
  facilities: Amenity[];
  status: ShelterStatus;
}

export interface AdminDashboard {
  shelters_total: number;
  active_total: number;
  official_total: number;
  verified_total: number;
  warning_total: number;
  pending_total: number;
  drivers_total: number;
  regions_total: number;
  by_region: Record<string, number>;
  recent_pending: Shelter[];
}

export interface AdminDriver {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  vehicle: string | null;
  app: string | null;
  shelters_count: number;
  joined_at: string;
}

export interface AdminDriverPayload {
  name: string;
  email: string;
  phone: string | null;
  vehicle_type: string | null;
  app_type: string | null;
  password: string;
}

export interface AdminDriverPage {
  data: AdminDriver[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface AdminShelterPayload extends ShelterPayload {
  is_approved: boolean;
}

export interface AdminShelterQuery {
  region?: string;
  type?: ShelterType;
  status?: ShelterStatus;
  q?: string;
  per_page?: number;
}

let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
}

function unwrap<T>(data: unknown): T {
  if (data && typeof data === 'object' && 'data' in (data as { data?: T })) {
    return (data as { data: T }).data;
  }
  return data as T;
}

function toType(raw: RawShelter): ShelterType {
  const source = raw.type ?? raw.category;
  if (source === 'verified' || source === 'verified_basecamp' || source === 'basecamp') return 'verified';
  if (source === 'warning' || source === 'warning_zone') return 'warning';
  return 'official';
}

function toCoords(raw: RawShelter): Pick<Shelter, 'latitude' | 'longitude'> {
  const source =
    raw.coordinates && typeof raw.coordinates.latitude === 'number'
      ? raw.coordinates
      : { latitude: raw.latitude ?? raw.lat, longitude: raw.longitude ?? raw.lng };
  return {
    latitude: Number(source.latitude ?? 0),
    longitude: Number(source.longitude ?? 0),
  };
}

function toFacilities(facilities: RawShelter['facilities']): Amenity[] {
  if (!facilities) return [];
  if (Array.isArray(facilities)) return AMENITY_LIST.filter((key) => facilities.includes(key));
  return AMENITY_LIST.filter((key) => facilities[key] === true);
}

function toStatus(status: RawShelter['status']): ShelterStatus {
  if (status === 'inactive' || status === 'maintenance' || status === 'active') return status;
  return 'active';
}

export function normalizeShelter(raw: RawShelter): Shelter {
  const coords = toCoords(raw);
  return {
    id: raw.id ?? 0,
    name: raw.name ?? '',
    type: toType(raw),
    latitude: coords.latitude,
    longitude: coords.longitude,
    region: raw.region ?? '',
    address: raw.address ?? '',
    capacity: raw.capacity ?? 0,
    current_occupancy: raw.current_occupancy ?? 0,
    facilities: toFacilities(raw.facilities),
    status: toStatus(raw.status),
    distance: raw.distance || null,
    is_approved: raw.is_approved ?? true,
    submitted_by: raw.submitted_by ?? null,
    updated_at: raw.updated_at,
  };
}

function normalizeList(data: unknown): Shelter[] {
  return unwrap<RawShelter[]>(data).map(normalizeShelter);
}

export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const response = error.response;
    if (response?.data && typeof response.data === 'object') {
      const data = response.data as { message?: string; errors?: Record<string, string[]> };
      if (data.errors) {
        const firstKey = Object.keys(data.errors)[0];
        if (firstKey) return data.errors[firstKey][0];
      }
      if (data.message) return data.message;
    }
    return response ? `Gagal terhubung (${response.status})` : 'Backend lokal tidak terjangkau.';
  }
  return 'Terjadi kesalahan.';
}

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('sheojol:unauthorized');
        window.dispatchEvent(event);
      }
    }
    return Promise.reject(error);
  },
);

export const AuthApi = {
  async login(payload: LoginPayload): Promise<AuthPayload> {
    const { data } = await client.post('/auth/login', payload);
    return unwrap<AuthPayload>(data);
  },

  async loginAdmin(payload: LoginPayload): Promise<AuthPayload> {
    const { data } = await client.post('/auth/login-admin', payload);
    return unwrap<AuthPayload>(data);
  },

  async register(payload: RegisterPayload): Promise<AuthPayload> {
    const { data } = await client.post('/auth/register', payload);
    return unwrap<AuthPayload>(data);
  },

  async me(): Promise<AuthUser> {
    const { data } = await client.get('/auth/me');
    return unwrap<AuthUser>(data);
  },

  async logout(): Promise<void> {
    await client.post('/auth/logout');
  },

  async updateProfile(
    payload: Partial<Pick<AuthUser, 'name' | 'phone' | 'vehicle' | 'app'>>,
  ): Promise<AuthUser> {
    const { data } = await client.patch('/auth/profile', payload);
    return unwrap<AuthUser>(data);
  },

  async changePassword(payload: PasswordChangePayload): Promise<void> {
    await client.post('/auth/password', payload);
  },
};

export const ShelterApi = {
  async list(
    params?: { region?: string; type?: ShelterType; lat?: number; lng?: number; radius?: number },
  ): Promise<Shelter[]> {
    const { data } = await client.get('/shelters', { params });
    return normalizeList(data);
  },

  async create(payload: ShelterPayload): Promise<Shelter> {
    const { data } = await client.post('/shelters', payload);
    return normalizeShelter(unwrap<RawShelter>(data));
  },

  async favorite(id: number): Promise<void> {
    await client.post(`/shelters/${id}/favorite`);
  },

  async unfavorite(id: number): Promise<void> {
    await client.delete(`/shelters/${id}/favorite`);
  },

  async favorites(): Promise<Shelter[]> {
    const { data } = await client.get('/me/favorites');
    return normalizeList(data);
  },

  async mine(): Promise<Shelter[]> {
    const { data } = await client.get('/me/shelters');
    return normalizeList(data);
  },
};

export const AdminApi = {
  async dashboard(): Promise<AdminDashboard> {
    const { data } = await client.get('/admin/dashboard');
    const raw = unwrap<Omit<AdminDashboard, 'recent_pending'> & { recent_pending: RawShelter[] }>(data);
    return {
      ...raw,
      recent_pending: (raw.recent_pending ?? []).map(normalizeShelter),
    };
  },

  async pending(): Promise<Shelter[]> {
    const { data } = await client.get('/admin/shelters/pending');
    return normalizeList(data);
  },

  async approve(id: number): Promise<Shelter> {
    const { data } = await client.post(`/admin/shelters/${id}/approve`);
    return normalizeShelter(unwrap<RawShelter>(data));
  },

  async reject(id: number): Promise<void> {
    await client.post(`/admin/shelters/${id}/reject`);
  },

  async shelters(params?: AdminShelterQuery): Promise<Shelter[]> {
    const { data } = await client.get('/admin/shelters', { params });
    return normalizeList(data);
  },

  async storeShelter(payload: AdminShelterPayload): Promise<Shelter> {
    const { data } = await client.post('/admin/shelters', payload);
    return normalizeShelter(unwrap<RawShelter>(data));
  },

  async updateShelter(id: number, payload: Partial<AdminShelterPayload>): Promise<Shelter> {
    const { data } = await client.patch(`/admin/shelters/${id}`, payload);
    return normalizeShelter(unwrap<RawShelter>(data));
  },

  async deleteShelter(id: number): Promise<void> {
    await client.delete(`/admin/shelters/${id}`);
  },

  async drivers(params?: { search?: string; page?: number; sort?: string; direction?: 'asc' | 'desc' }): Promise<AdminDriverPage> {
    const { data } = await client.get('/admin/drivers', { params });
    const unwrapped = unwrap<AdminDriver[]>(data);
    return {
      data: Array.isArray(unwrapped) ? unwrapped : [],
      meta: (data as { meta?: AdminDriverPage['meta'] }).meta,
    };
  },

  async createDriver(payload: AdminDriverPayload): Promise<AdminDriver> {
    const { data } = await client.post('/admin/drivers', payload);
    return unwrap<AdminDriver>(data);
  },

  async resetDriverPassword(id: number, password: string): Promise<void> {
    await client.post(`/admin/drivers/${id}/reset-password`, { password });
  },
};