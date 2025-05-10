"use client";

import React, { useEffect, useState } from "react";

interface ScriptLoaderProps {
  children: React.ReactNode;
}

const HeatMapScriptLoader: React.FC<ScriptLoaderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.L && (window.L as any).heatLayer) {
      setIsLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.js";
    script.async = true;
    
    // Set onload handler
    script.onload = () => {
      setIsLoaded(true);
    };
    
    // Set error handler
    script.onerror = () => {
      setError("Failed to load Leaflet heat map plugin");
    };
    
    // Append script to document
    document.body.appendChild(script);
    
    // Cleanup
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error: {error}. Heat maps will not be available.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p className="ml-3">Loading heat map library...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default HeatMapScriptLoader;