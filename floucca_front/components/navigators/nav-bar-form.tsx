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
                    href="/do/forms/effort&landing"
                    className={`${
                        pathname === '/effort&landing' ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    } font-medium hover:text-blue-600`}
                >
                    Effort and Landing
                </Link>
                <Link
                    href="/do/forms/census"
                    className={`${
                        pathname === '/census' ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    } font-medium hover:text-blue-600`}
                >
                    Fleet Census
                </Link>
                <Link
                    href="/do/history"
                    className={`${
                        pathname === '/history' ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    } font-medium hover:text-blue-600`}
                >
                    Submission History
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
