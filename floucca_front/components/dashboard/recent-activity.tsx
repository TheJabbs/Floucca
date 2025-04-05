import React from "react";
import { TrendingUp } from "lucide-react";

const RecentActivity = () => (
  <div className="mt-8 rounded-xl bg-blue-50 p-6 border border-blue-200">
    <div className="flex items-center gap-4">
      <div className="rounded-full bg-blue-100 p-3 text-blue-600">
        <TrendingUp className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <p className="text-sm text-gray-600">
          Last data update:{" "}
          <span className="font-medium">April 5, 2025 at 9:15 AM</span>
        </p>
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="flex justify-between rounded-lg bg-white p-3 text-sm">
        <span>Landing data updated for Beirut and Sidon ports</span>
        <span className="text-gray-500">3 hours ago</span>
      </div>
      <div className="flex justify-between rounded-lg bg-white p-3 text-sm">
        <span>New Sea Bass and Swordfish records added to Tripoli data</span>
        <span className="text-gray-500">Yesterday</span>
      </div>
      <div className="flex justify-between rounded-lg bg-white p-3 text-sm">
        <span>Gear usage report generated for Batroun cooperative</span>
        <span className="text-gray-500">2 days ago</span>
      </div>
    </div>
  </div>
);

export default RecentActivity;
