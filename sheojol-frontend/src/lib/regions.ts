import { Region, RegionKey } from '@/types/shelter';

export const REGIONS: Region[] = [
  {
    key: 'ciledug',
    label: 'Ciledug',
    center: [-6.248, 106.71],
    bounds: [[-6.29, 106.66], [-6.2, 106.76]],
  },
  {
    key: 'bsd',
    label: 'BSD',
    center: [-6.303, 106.679],
    bounds: [[-6.35, 106.61], [-6.24, 106.73]],
  },
  {
    key: 'karawaci',
    label: 'Karawaci',
    center: [-6.204, 106.612],
    bounds: [[-6.26, 106.55], [-6.15, 106.68]],
  },
  {
    key: 'tangerang-kota',
    label: 'Tangerang Kota',
    center: [-6.18, 106.632],
    bounds: [[-6.23, 106.57], [-6.13, 106.7]],
  },
  {
    key: 'bintaro',
    label: 'Bintaro',
    center: [-6.287, 106.722],
    bounds: [[-6.33, 106.68], [-6.24, 106.76]],
  },
  {
    key: 'alam-sutera',
    label: 'Alam Sutera',
    center: [-6.245, 106.663],
    bounds: [[-6.28, 106.62], [-6.19, 106.69]],
  },
];

export function getRegion(key: RegionKey): Region {
  return REGIONS.find((region) => region.key === key) ?? REGIONS[0];
}