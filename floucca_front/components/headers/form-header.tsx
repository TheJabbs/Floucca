// components/FormHeader.tsx

import React from 'react';

export default function FormHeader() {
    return (
        <header className="bg-white py-4 border-b shadow-sm">
            <div className="flex justify-between items-center mx-auto px-[2.5%]">
                <div className="flex items-center">
                    {/* Logo with subtle styling */}
                    <img
                        src="https://up.yimg.com/ib/th?id=OIP.fN9gx82LKxSZVpTc18meBgHaEo&pid=Api&rs=1&c=1&qlt=95&w=196&h=122"
                        alt="Floucca Coop"
                        className="h-20 rounded-md"
                    />
                </div>
                <div className="text-right">
                    <h1 className="text-lg font-bold text-gray-800">Floucca Coop</h1>
                    <p className="text-sm text-gray-600">University of Balamand, Koura Campus</p>
                    <p className="text-sm text-gray-600">example@gmail.com</p>
                    <p className="text-sm text-gray-600">+961 000 000</p>
                </div>
            </div>
        </header>
    );
}

