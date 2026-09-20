'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { SHELTER_TYPE_COLORS } from '@/lib/constants';
import { Shelter } from '@/types/shelter';

interface MiniMapProps {
  shelters: Shelter[];
}

export default function MiniMap({ shelters }: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = L.map(container, {
      attributionControl: false,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      center: [-6.248, 106.71],
      zoom: 12,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    setReady(true);

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current === map) map.invalidateSize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (layerRef.current) {
        layerRef.current.clearLayers();
        layerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      layerRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer || !ready) return;

    layer.clearLayers();
    const valid = shelters.filter((shelter) => shelter.latitude !== 0 || shelter.longitude !== 0);
    if (valid.length === 0) return;

    valid.forEach((shelter) => {
      L.circleMarker([shelter.latitude, shelter.longitude], {
        radius: 6,
        stroke: true,
        color: '#09090b',
        weight: 1.5,
        fillColor: SHELTER_TYPE_COLORS[shelter.type],
        fillOpacity: 0.95,
      })
        .bindTooltip(shelter.name, { direction: 'top', offset: [0, -8] })
        .addTo(layer);
    });

    map.fitBounds(
      L.latLngBounds(valid.map((shelter) => [shelter.latitude, shelter.longitude] as [number, number])),
      { padding: [24, 24] },
    );
  }, [shelters, ready]);

  return <div ref={containerRef} className="h-full w-full" />;
}