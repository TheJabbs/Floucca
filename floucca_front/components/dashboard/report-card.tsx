"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const ReportCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
}> = ({ title, description, icon, color, route }) => {
  const router = useRouter();

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all hover:shadow-md cursor-pointer ${color}`}
      onClick={() => router.push(route)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm/relaxed text-gray-600">{description}</p>
        </div>
        <div
          className={`rounded-full p-3 ${color.replace("bg-", "bg-opacity-20 text-")}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center text-sm font-medium">
        <span>View Report</span>
        <ArrowRight className="ml-1 h-4 w-4" />
      </div>
    </div>
  );
};

export default ReportCard;
