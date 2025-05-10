"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";
import { LandingCoordinate } from "@/services/coordinatesService";

declare global {
  interface Window {
    L: typeof L & {
      heatLayer: (latlngs: any[], options?: any) => any;
    };
  }
}

interface HeatMapProps {
  coordinates: LandingCoordinate[];
  speciesName: string;
  isLoading?: boolean;
}

// Component to handle the heat layer
const HeatLayer = ({ coordinates }: { coordinates: LandingCoordinate[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!window.L.heatLayer) {
      console.error("Leaflet.heat plugin is not loaded");
      return;
    }

    if (coordinates.length === 0) return;

    // Convert coordinates to format expected by heatLayer
    const points = coordinates.map(coord => [
      coord.latitude,
      coord.longitude,
      1 // Intensity value
    ]);

    // Create and add the heat layer
    const heatLayer = window.L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1.0: 'red' }
    }).addTo(map);

    // Fit bounds to see all points
    if (coordinates.length > 0) {
      const bounds = coordinates.map(coord => [coord.latitude, coord.longitude]);
      map.fitBounds(bounds as any);
    }

    // Cleanup on unmount
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [coordinates, map]);

  return null;
};

const HeatMap: React.FC<HeatMapProps> = ({ 
  coordinates, 
  speciesName,
  isLoading = false 
}) => {
  // Default view is centered on Lebanon
  const defaultCenter: [number, number] = [33.8547, 35.8623];
  const defaultZoom = 8;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (coordinates.length === 0) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg">
        <p className="text-gray-500">No location data available for {speciesName}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden h-full border shadow">
      <div className="bg-white p-2 border-b">
        <h3 className="font-medium text-sm">Fishing Density for {speciesName}</h3>
        <p className="text-xs text-gray-500">Heat map showing concentration of landings</p>
      </div>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: "calc(100% - 48px)", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <HeatLayer coordinates={coordinates} />
      </MapContainer>
    </div>
  );
};

export default HeatMap;