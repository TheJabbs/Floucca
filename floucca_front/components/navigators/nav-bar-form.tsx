// components/Navbar.tsx

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
                    href="/effort-and-landing"
                    className={`${
                        pathname === '/effort-and-landing' ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    } font-medium hover:text-blue-600`}
                >
                    Effort and Landing
                </Link>
                <Link
                    href="/sense-form"
                    className={`${
                        pathname === '/fleet-senses' ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    } font-medium hover:text-blue-600`}
                >
                    Fleet Senses
                </Link>
                <Link
                    href="/submission-history"
                    className={`${
                        pathname === '/submission-history' ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    } font-medium hover:text-blue-600`}
                >
                    Submission History
                </Link>
                <Link
                    href="/stats"
                    className={`${
                        pathname === '/stats' ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    } font-medium hover:text-blue-600`}
                >
                    Stats
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
