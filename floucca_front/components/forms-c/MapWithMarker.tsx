import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet icon to avoid broken images
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface MarkerData {
    id: number;
    lat: number;
    lng: number;
}

const MapWithMarkers: React.FC = () => {
    const [markers, setMarkers] = useState<MarkerData[]>([]);

    // Add a marker on map click
    const AddMarkerOnClick = () => {
        useMapEvents({
            click: (e: LeafletMouseEvent) => {
                const newMarker = {
                    id: Date.now(), // Unique ID for each marker
                    lat: e.latlng.lat,
                    lng: e.latlng.lng,
                };
                setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
            },
        });
        return null;
    };

    // Remove a marker by its ID
    const removeMarker = (id: number) => {
        setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== id));
    };

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <MapContainer center={[33.9, 35.5]} zoom={8} style={{ height: '100%', width: '100%' }}>
                <AddMarkerOnClick />
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={[marker.lat, marker.lng]}
                        eventHandlers={{
                            click: () => removeMarker(marker.id),
                        }}
                    />
                ))}
            </MapContainer>
        </div>
    );
};

export default MapWithMarkers;
