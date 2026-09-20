'use client';

import L from 'leaflet';
import { SHELTER_TYPE_COLORS } from '@/lib/constants';
import { googleMapsNavigationUrl } from '@/lib/maps';
import { escapeHtml } from '@/lib/escape';
import { Shelter } from '@/types/shelter';

export type ShelterMarker = L.Marker & { shelterId?: number };

export function createShelterMarker(shelter: Shelter, onClick: (shelter: Shelter) => void): ShelterMarker {
  const color = SHELTER_TYPE_COLORS[shelter.type];
  const isWarning = shelter.type === 'warning';

  const icon = L.divIcon({
    className: 'shelter-marker',
    html: `<span class="shelter-marker__pin${isWarning ? ' shelter-marker__pin--warning' : ''}" style="--marker-color:${color}"><span class="shelter-marker__dot"></span></span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });

  const marker = L.marker([shelter.latitude, shelter.longitude], { icon }) as ShelterMarker;
  marker.shelterId = shelter.id;

  marker.bindPopup(`
    <div class="shelter-popup">
      <strong>${escapeHtml(shelter.name)}</strong>
      <span>${escapeHtml(shelter.address)}</span>
      <a class="shelter-popup__nav" href="${googleMapsNavigationUrl(shelter.latitude, shelter.longitude)}" target="_blank" rel="noopener noreferrer">Navigasi ke sini →</a>
    </div>
  `);

  marker.on('click', () => onClick(shelter));

  return marker;
}