"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
    const pathname = usePathname();

    return (
        <nav className="bg-white border-b shadow-sm">
            <div className="container mx-auto px-[5%] py-4 flex justify-between items-center">
                <Link
                    href="/dashboard-admin/sites/regions"
                    className={`${
                        pathname === '/effort&landing' ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    } font-medium hover:text-blue-600`}
                >
                    Regions
                </Link>
                <Link
                    href="/dashboard-admin/sites/coops"
                    className={`${
                        pathname === '/census' ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    } font-medium hover:text-blue-600`}
                >
                    Coops
                </Link>
                <Link
                    href="/dashboard-admin/sites/ports"
                    className={`${
                        pathname === '/history' ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    } font-medium hover:text-blue-600`}
                >
                    Ports
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
