import React, { useState } from "react";
import { 
  Database, Users, UserCheck, BarChart2, LineChart, 
  Save, RotateCcw, FileSpreadsheet, FilePlus, Copy, 
  Trash2, Unlock, Lock, CheckSquare, History, ChevronRight, 
  LayoutGrid
} from "lucide-react";

const AdminDashboard = () => {
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
              <button className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 text-gray-700">
                <Users className="w-4 h-4 mr-3 text-blue-600" />
                <span>Table of Users</span>
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
      <h1 className="text-2xl font-bold text-blue-800 mb-3 px-3">ADMIN DASHBOARD</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Note for: UOB, Administrator
              </h2>
              <p className="text-gray-700 mb-4">
                You have exclusive access to key functions of the system which cover administration and maintenance of databases and software, full handling of all data and standards and designating access levels to data operators and privileged users.
              </p>
              <p className="text-gray-700 mb-4">
                The administration and maintenance functions are given on the left column.
              </p>
              <p className="text-gray-700">
                The right column handles the system databases. At the bottom of the middle column there are two links to privileged and data operations functions respectively. Access to them is direct and does not require a new login.
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
                    <FilePlus className="w-4 h-4 mr-3" />
                    <span>Create a new database</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <button className="w-full flex items-center justify-between p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                  <span className="flex items-center">
                    <Copy className="w-4 h-4 mr-3" />
                    <span>Use tables of another database</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <button className="w-full flex items-center justify-between p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                  <span className="flex items-center">
                    <Database className="w-4 h-4 mr-3" />
                    <span>Set-up tables manually</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <button className="w-full flex items-center justify-between p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                  <span className="flex items-center">
                    <Trash2 className="w-4 h-4 mr-3" />
                    <span>Delete a database</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <button className="w-full flex items-center justify-between p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                  <span className="flex items-center">
                    <Unlock className="w-4 h-4 mr-3" />
                    <span>Release for inputting</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <button className="w-full flex items-center justify-between p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                  <span className="flex items-center">
                    <Lock className="w-4 h-4 mr-3" />
                    <span>Block a database</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <button className="w-full flex items-center justify-between p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                  <span className="flex items-center">
                    <CheckSquare className="w-4 h-4 mr-3" />
                    <span>Finalize</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <button className="w-full flex items-center justify-between p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                  <span className="flex items-center">
                    <History className="w-4 h-4 mr-3" />
                    <span>Move to history</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <button className="w-full flex items-center justify-between p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition">
                  <span className="flex items-center">
                    <RotateCcw className="w-4 h-4 mr-3" />
                    <span>Bring-in from history</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
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
                Privileged Users' Functions
              </button>
              <button className="w-full py-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition">
                Data Operators' Functions
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