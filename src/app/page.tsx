'use client';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

export default function Home() {

  const Map = useMemo(() => dynamic(
    () => import('@/app/components/MyMap'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  return (
    <div className="h-screen">
      <Map />
    </div>
  );
}
