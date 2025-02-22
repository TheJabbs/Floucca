"use client";

import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "marker-icon.png",
  iconRetinaUrl: "marker-icon-2x.png",
  shadowUrl: "marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

interface MapLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface MapSelectionProps {
  required?: boolean;
  onChange: (location: MapLocation | null) => void;
}

// Component to handle map clicks
function MapEvents({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const MapSelection: React.FC<MapSelectionProps> = ({ required = false, onChange }) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  // center on Lebanon's approximate coordinates
  const defaultCenter: [number, number] = [34.1, 35.9];
  const defaultZoom = 8;

  const handleMapClick = (lat: number, lng: number) => {
    const newLocation: MapLocation = {
      id: Date.now(),
      name: "Selected Location",
      lat,
      lng,
    };
    
    setSelectedLocation(newLocation);
    onChange(newLocation);
  };

  const removeMarker = () => {
    setSelectedLocation(null);
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">
        Select Fishing Location
        {required && <span className="text-red-500 ml-1">*</span>}
      </h2>

      {/* Instructions */}
      <div className="text-sm text-gray-600">
        <p>Click on the map to set a marker. Click on the marker to remove it.</p>
        <p>Only one location can be selected at a time.</p>
      </div>

      <div className="relative h-96 w-full border rounded-lg overflow-hidden">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onMapClick={handleMapClick} />

          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={icon}
              eventHandlers={{
                click: removeMarker,
              }}
            >
              <Tooltip permanent direction="top" offset={[0, -20]}>
                {selectedLocation.name}
              </Tooltip>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapSelection;