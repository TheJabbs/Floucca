import React from "react";
import ReusableTable from "../../utils/table";

interface SpeciesData {
  species: string;
  averageWeight: number;
  fishCount: number;
  price: number;
  value: number;
  cpue: number;
  estCatch: number;
}

interface SpeciesTableProps {
  isLoading: boolean;
  statsData: SpeciesData[] | null;
}

const SpeciesTable: React.FC<SpeciesTableProps> = ({ isLoading, statsData }) => {
  // Define columns for the table
  const columns = [
    { key: "species", header: "Species" },
    { key: "averageWeight", header: "Aver.Weight (kg)" },
    { key: "fishCount", header: "N.fish in catch" },
    { key: "price", header: "Price" },
    { key: "value", header: "Value" },
    { key: "cpue", header: "CPUE" },
    { key: "estCatch", header: "Est. catch" },
  ];

  return (
    <ReusableTable
      title="Fishing Data"
      columns={columns}
      data={statsData}
      isLoading={isLoading}
      noDataMessage="No species data available."
      keyExtractor={(item) => item.species}
    />
  );
};

export default SpeciesTable;