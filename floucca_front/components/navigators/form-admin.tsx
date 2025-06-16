"use client"; // This directive makes the component a Client Component

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
    const pathname = usePathname();

    return (
        <nav className="bg-white border-b shadow-sm">
            <div className="container mx-auto px-[5%] py-4 flex justify-between items-center">
                <Link
                    href="/dashboard-admin/data-entry/forms/effort-landing"
                    className={`${
                        pathname === '/effort&landing' ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    } font-medium hover:text-blue-600`}
                >
                    Effort and Landing
                </Link>
                <Link
                    href="/dashboard-admin/data-entry/forms/census"
                    className={`${
                        pathname === '/census' ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    } font-medium hover:text-blue-600`}
                >
                    Fleet Census
                </Link>
                <Link
                    href="/dashboard-admin/data-entry/forms/census-data"
                    className={`${
                        pathname === '/census-data' ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    } font-medium hover:text-blue-600`}
                >
                    Fleet Data
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
