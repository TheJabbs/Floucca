"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LandingCoordinate } from "@/services/coordinatesService";
import { generateClusteredConvexHulls } from "@/components/utils/convex-hul-util";

interface ConvexHullMapProps {
  coordinates: LandingCoordinate[];
  color: string;
  speciesName: string;
  isLoading?: boolean;
}

const MapBoundsControl = ({ coordinates }: { coordinates: LandingCoordinate[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = coordinates.map(coord => [coord.latitude, coord.longitude]);
      map.fitBounds(bounds as any);
    }
  }, [coordinates, map]);
  
  return null;
};

const ConvexHullMap: React.FC<ConvexHullMapProps> = ({ 
  coordinates, 
  color,
  speciesName,
  isLoading = false
}) => {
  const [convexHulls, setConvexHulls] = useState<LandingCoordinate[][]>([]);

  useEffect(() => {
    if (coordinates.length > 0) {
      // Calculate convex hulls for clusters
      const hulls = generateClusteredConvexHulls(coordinates, 0.1);
      setConvexHulls(hulls);
    } else {
      setConvexHulls([]);
    }
  }, [coordinates]);

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
        <h3 className="font-medium text-sm">Fishing Zones for {speciesName}</h3>
        <p className="text-xs text-gray-500">Convex hulls showing geographic clusters</p>
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
        
        {convexHulls.map((hull, index) => (
          <Polygon
            key={`hull-${index}`}
            positions={hull.map(coord => [coord.latitude, coord.longitude])}
            pathOptions={{
              color,
              weight: 2,
              fillOpacity: 0.2,
            }}
          />
        ))}
        
        <MapBoundsControl coordinates={coordinates} />
      </MapContainer>
    </div>
  );
};

export default ConvexHullMap;