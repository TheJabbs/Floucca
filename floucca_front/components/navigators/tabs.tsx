"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Context for managing tabs state
type TabsContextType = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs component");
  }
  return context;
};

// Main container
interface TabsProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function Tabs({ children, value, onValueChange, className = "" }: TabsProps) {
  return (
    <TabsContext.Provider value={{ activeTab: value, setActiveTab: onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// Tab list container
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div className={`flex space-x-1 bg-gray-100 p-1 rounded-lg ${className}`}>
      {children}
    </div>
  );
}

// Individual tab trigger
interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function TabsTrigger({ children, value, className = "" }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();
  
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
        activeTab === value
          ? "bg-white text-blue-600 shadow-sm" 
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
      } ${className}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

// Tab content
interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function TabsContent({ children, value, className = "" }: TabsContentProps) {
  const { activeTab } = useTabs();
  
  if (activeTab !== value) return null;
  
  return <div className={className}>{children}</div>;
}

// Fleet Data Tab Content
interface FleetDataTabProps {
  className?: string;
}

export function FleetDataTab({ className = "" }: FleetDataTabProps) {
  const [fleetData, setFleetData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFleetData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dev/fleet_senses');
        const data = await response.json();
        setFleetData(data);
      } catch (err) {
        setError('Failed to fetch fleet data');
        console.error('Error fetching fleet data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFleetData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading fleet data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Fleet Data</h2>
      <div className="grid gap-4">
        {fleetData.map((fleet) => (
          <div key={fleet.fleet_senses_id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium">Fleet ID: {fleet.fleet_senses_id}</h3>
            <div className="mt-2">
              <p>Form ID: {fleet.form_id}</p>
              {fleet.gear_usage && (
                <div className="mt-2">
                  <h4 className="font-medium">Gear Usage:</h4>
                  <ul className="list-disc list-inside">
                    {fleet.gear_usage.map((gear: any, index: number) => (
                      <li key={index}>
                        Gear Code: {gear.gear_code} - Months: {gear.months.join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}