'use client'

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const icon = L.icon({
    iconUrl: '/marker-icon.png',
    iconRetinaUrl: '/marker-icon-2x.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MarkerData {
    id: number;
    lat: number;
    lng: number;
}

interface MapWithMarkersProps {
    onMarkersChange?: (markers: MarkerData[]) => void;
}

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({ onMarkersChange }) => {
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    
    useEffect(() => {
        if (onMarkersChange) {
            onMarkersChange(markers);
        }
    }, [markers, onMarkersChange]); 

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
        <MapContainer 
            center={[33.9, 35.5]} 
            zoom={8} 
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <AddMarkerOnClick />
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={[marker.lat, marker.lng]}
                    icon={icon}
                    eventHandlers={{
                        click: () => removeMarker(marker.id),
                    }}
                />
            ))}
        </MapContainer>
    );
};

export default MapWithMarkers;