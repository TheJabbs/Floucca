"use client";

import React, { createContext, useContext, useState } from "react";

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