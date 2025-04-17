"use client";

import React, { useEffect, useState } from "react";
import { getPeriods, Period } from "@/services";
import { formatDate } from "../utils/dateFormatter";

const statusMap: Record<Period["period_status"], string> = {
  A: "Active",
  B: "Blocked",
  F: "Finalized"
};

const PeriodList = () => {
  const [periods, setPeriods] = useState<Period[]>([]);

  useEffect(() => {
    getPeriods().then((data) => {
      if (Array.isArray(data)) {
        setPeriods(data);
      }
    });
  }, []);

  return (
    <div>
      <h3 className="font-semibold text-xl mb-4">All Periods</h3>
      <ul className="space-y-2">
        {periods.map((period) => (
          <li key={period.period_date} className="bg-gray-100 p-3 rounded shadow-sm flex justify-between">
            <span>{formatDate(period.period_date)}</span>
            <span className="font-medium">
              {statusMap[period.period_status] || "—"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeriodList;
