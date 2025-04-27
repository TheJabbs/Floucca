"use client";
import React from "react";
import {
  Database,
  Users,
  UserCheck,
  BarChart2,
  LineChart,
  Save,
  RotateCcw,
  FileSpreadsheet,
  FilePlus,
  Copy,
  Anchor,
  FileChartColumnIncreasing,
  CalendarRange,
  Upload,
  FileText,
  FileBarChart,
  ClipboardList,
  Trash2,
  MapPin,
  Unlock,
  Lock,
  CheckSquare,
  History,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex flex-1">
        {/* Sidebar */}
        <div className="bg-white shadow-md w-72 p-4">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <LayoutGrid className="w-5 h-5 mr-2" />
              Administration Functions
            </h2>
            <nav className="space-y-1">
              <button className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 text-gray-700"
                onClick={() => router.push("/dashboard-admin/users")}
              >
                <Users className="w-4 h-4 mr-3 text-blue-600" />
                <span>Users Table</span>
              </button>
              <button className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 text-gray-700"
                onClick={() => router.push("/dashboard-admin/sites")}
              >
                <MapPin className="w-4 h-4 mr-3 text-blue-600" />
                <span>Landing Sites</span>
              </button>
              <button className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 text-gray-700"
                onClick={() => router.push("/dashboard-admin/gears")}
              >
                <Anchor className="w-4 h-4 mr-3 text-blue-600" />
                <span>Gears Table</span>
              </button>
              <button className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 text-gray-700">
                <UserCheck className="w-4 h-4 mr-3 text-blue-600" />
                <span>Table of field agents</span>
              </button>
              <button className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 text-gray-700">
                <BarChart2 className="w-4 h-4 mr-3 text-blue-600" />
                <span>Workload Statistics</span>
              </button>
              <button className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 text-gray-700">
                <LineChart className="w-4 h-4 mr-3 text-blue-600" />
                <span>Progress Monitoring</span>
              </button>
              <button
                className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 text-gray-700"
                onClick={() => router.push("/dashboard-admin/reports")}
              >
                <FileChartColumnIncreasing className="w-4 h-4 mr-3 text-blue-600" />
                <span>Reports and Stats</span>
              </button>
            </nav>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Maintenance Functions
            </h2>
            <nav className="space-y-1">
              <button className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 text-gray-700">
                <Save className="w-4 h-4 mr-3 text-blue-600" />
                <span>System Backup</span>
              </button>
              <button className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 text-gray-700">
                <RotateCcw className="w-4 h-4 mr-3 text-blue-600" />
                <span>System Recovery</span>
              </button>
              <button className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 text-gray-700">
                <FileSpreadsheet className="w-4 h-4 mr-3 text-blue-600" />
                <span>Excel outputs</span>
              </button>
              <button className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 text-gray-700">
                <FileSpreadsheet className="w-4 h-4 mr-3 text-blue-600" />
                <span>Diffusable EXCEL</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-blue-800 mb-3 px-3">
            ADMIN DASHBOARD
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Note for: UOB, Administrator
              </h2>
              <p className="text-gray-700 mb-4">
                You have exclusive access to key functions of the system which
                cover administration and maintenance of databases and software,
                full handling of all data and standards and designating access
                levels to data operators and privileged users.
              </p>
              <p className="text-gray-700 mb-4">
                The administration and maintenance functions are given on the
                left column.
              </p>
              <p className="text-gray-700">
                The right column handles the system databases. At the bottom of
                the middle column there are two links to privileged and data
                operations functions respectively. Access to them is direct and
                does not require a new login.
              </p>
            </div>

            {/* Database Operations */}
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Monthly databases
              </h2>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                  <span className="flex items-center">
                    <CalendarRange className="w-4 h-4 mr-3" />
                    <span>Manage Periods</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button className="w-full flex items-center justify-between p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                  <span className="flex items-center">
                    <Trash2 className="w-4 h-4 mr-3" />
                    <span>Delete data</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Data Entry as a subsection within Monthly databases */}
                <div>
                  <h3 className="text-md font-medium text-blue-700 mb-3 mt-4 flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Data Entry
                  </h3>
                  <div className="space-y-2 pl-6">
                    <button className="w-full flex items-center justify-between p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                      <span className="flex items-center">
                        <span>Bulk Landing</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button className="w-full flex items-center justify-between p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                      <span className="flex items-center">
                        <span>Bulk Effort</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button className="w-full flex items-center justify-between p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                      <span className="flex items-center">
                        <span>Bulk Census</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button className="w-full flex items-center justify-between p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                      <span className="flex items-center">
                        <span>Enter forms data</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Access Panel */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Authorized access also to:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="w-full py-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition">
                Privileged Users Functions
              </button>
              <button className="w-full py-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition">
                Data Operators Functions
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-300">
        <div className="container mx-auto px-4 py-3 text-center text-gray-600">
          Lebanon - Flouca Web
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
