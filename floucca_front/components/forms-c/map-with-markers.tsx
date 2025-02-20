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
  onChange: (locations: MapLocation[]) => void;
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

const MapSelection: React.FC<MapSelectionProps> = ({ onChange }) => {
  const [markers, setMarkers] = useState<MapLocation[]>([]);

  // center on Leb approx coordinates
  const defaultCenter: [number, number] = [34.1, 35.9];
  const defaultZoom = 8;

  const handleMapClick = (lat: number, lng: number) => {
    const markerNumber = markers.length + 1;
    const newMarker: MapLocation = {
      id: Date.now(), // Using timestamp as a simple unique id
      name: `Marker ${markerNumber}`,
      lat,
      lng,
    };

    const updatedMarkers = [...markers, newMarker];
    setMarkers(updatedMarkers);
    onChange(updatedMarkers);
  };

  const removeMarker = (id: number) => {
    const updatedMarkers = markers
      .filter((marker) => marker.id !== id)
      .map((marker, index) => ({
        ...marker,
        name: `Marker ${index + 1}`,
      }));
    setMarkers(updatedMarkers);
    onChange(updatedMarkers);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Select Fishing Locations</h2>

      {/* Instructions */}
      <div className="text-sm text-gray-600">
        <p>Click on the map to add markers. Click on a marker to remove it.</p>
        <p>Markers are automatically numbered in the order they are added.</p>
      </div>
      <div className="relative h-[500px] w-full border rounded-lg overflow-hidden">
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

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={icon}
              eventHandlers={{
                click: () => removeMarker(marker.id),
              }}
            >
              <Tooltip permanent direction="top" offset={[0, -20]}>
                {marker.name}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Markers List */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Selected Locations</h3>
        {markers.length > 0 ? (
          <div className="space-y-2">
            {markers.map((marker) => (
              <div
                key={marker.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium">{marker.name}</span>
                  <span className="text-gray-700">
                    Lat: {marker.lat.toFixed(4)}, Lng: {marker.lng.toFixed(4)}
                  </span>
                </div>
                <button
                  onClick={() => removeMarker(marker.id)}
                  className="text-red-500 hover:text-red-700"
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No locations selected. Click on the map to add markers.
          </p>
        )}
      </div>
    </div>
  );
};

export default MapSelection;
