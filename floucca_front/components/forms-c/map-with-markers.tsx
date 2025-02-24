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
import { AlertCircle } from "lucide-react";

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

const MapSelection: React.FC<MapSelectionProps> = ({ 
  required = false, 
  onChange 
}) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

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
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center gap-3 text-gray-600">
        <h2 className="text-xl font-semibold">
          Select Fishing Location
        </h2>
      </div>

      <div className="space-y-6">
        {/* Instructions Card */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-green-800 font-medium">
                How to use the map:
              </p>
              <ul className="text-sm text-green-700 list-disc pl-4 space-y-1">
                <li>Click anywhere on the map to add a location marker</li>
                <li>Click on an existing marker to remove it</li>
                <li>Only one location can be selected at a time</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Map Container */}
          <div className="relative h-96 w-full border rounded-lg overflow-hidden shadow-inner">
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
    </div>
  );
};

export default MapSelection;