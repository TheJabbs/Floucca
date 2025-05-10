"use client";

import React from "react";
import { Fish, Anchor } from "lucide-react";
import Link from "next/link";

export default function FormHeader() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <Anchor className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
                FLOUCA
              </h1>
              <p className="text-sm text-gray-500 -mt-1">Fish Landing System</p>
            </div>
          </Link>

          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              University of Balamand
            </p>
            <p className="text-sm text-gray-600">Koura Campus</p>
            <p className="text-sm text-gray-600">example@balamand.edu.lb</p>
            <p className="text-sm text-gray-600">+961 000 000</p>
          </div>
        </div>
      </div>
    </header>
  );
}