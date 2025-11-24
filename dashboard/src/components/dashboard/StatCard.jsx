import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const StatCard = ({ title, children, className, action }) => {
    return (
        <div className={twMerge(clsx("bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col", className))}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-slate-700 font-semibold text-lg">{title}</h3>
                {action && <div>{action}</div>}
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

export default StatCard;
