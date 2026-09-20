'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import MapControls from './MapControls';
import { createShelterMarker, ShelterMarker } from './CustomMarker';
import { Region, Shelter } from '@/types/shelter';

interface MapContainerProps {
  shelters: Shelter[];
  region: Region;
  selectedId: number | null;
  onSelect: (shelter: Shelter) => void;
}

export default function MapContainer({ shelters, region, selectedId, onSelect }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const userCircleRef = useRef<L.CircleMarker | null>(null);
  const onSelectRef = useRef(onSelect);
  const regionRef = useRef(region);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    regionRef.current = region;
  }, [region]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = L.map(container, {
      zoomControl: false,
      center: regionRef.current.center,
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    map.on('locationfound', (event) => {
      if (mapRef.current !== map) return;
      map.setView(event.latlng, 16);
      if (userCircleRef.current) {
        userCircleRef.current.setLatLng(event.latlng);
      } else {
        userCircleRef.current = L.circleMarker(event.latlng, {
          radius: 9,
          color: '#16a34a',
          weight: 2,
          fillColor: '#22c55e',
          fillOpacity: 0.3,
        }).addTo(map);
      }
    });

    map.on('locationerror', () => {
      if (mapRef.current !== map) return;
      map.setView(regionRef.current.center, 13);
    });

    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    setMapInstance(map);

    const resizeTimer = window.setTimeout(() => {
      if (mapRef.current === map && container.offsetWidth > 0) {
        map.invalidateSize();
      }
    }, 0);

    return () => {
      window.clearTimeout(resizeTimer);
      onSelectRef.current = () => {};
      if (layerRef.current) {
        layerRef.current.clearLayers();
        layerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      userCircleRef.current = null;
      setMapInstance(null);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyToBounds(region.bounds, { padding: [48, 48], duration: 0.8 });
    window.setTimeout(() => {
      if (mapRef.current === map) map.invalidateSize();
    }, 0);
  }, [region]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const existing: ShelterMarker[] = [];
    layer.eachLayer((item) => {
      const marker = item as ShelterMarker;
      if (marker.shelterId != null) existing.push(marker);
    });

    const existingById = new Map(existing.map((marker) => [marker.shelterId, marker]));
    const desiredById = new Map(shelters.map((shelter) => [shelter.id, shelter]));

    existing.forEach((marker) => {
      const id = marker.shelterId;
      if (id != null && !desiredById.has(id) && layer.hasLayer(marker)) {
        layer.removeLayer(marker);
      }
    });

    const added: ShelterMarker[] = [];
    desiredById.forEach((shelter) => {
      if (!existingById.has(shelter.id)) {
        added.push(createShelterMarker(shelter, (target) => onSelectRef.current(target)));
      }
    });
    added.forEach((marker) => marker.addTo(layer));

    return () => {
      added.forEach((marker) => {
        if (layer.hasLayer(marker)) layer.removeLayer(marker);
      });
    };
  }, [shelters]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    const focused: ShelterMarker[] = [];

    layer.eachLayer((layerItem) => {
      const marker = layerItem as ShelterMarker;
      if (marker.shelterId === selectedId) {
        marker.openPopup();
        focused.push(marker);
      } else if (marker.shelterId != null) {
        marker.closePopup();
      }
    });

    const target = focused[0];
    if (target) {
      map.flyTo(target.getLatLng(), Math.max(map.getZoom(), 15), { duration: 0.8 });
    }
  }, [selectedId]);

  return (
    <div className="absolute inset-0 z-0">
      <div ref={containerRef} className="h-full w-full min-h-[300px]" />
      {mapInstance ? <MapControls map={mapInstance} /> : null}
    </div>
  );
}