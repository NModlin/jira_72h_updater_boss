import React from 'react';
import StatCard from './StatCard';
import { requestTypeData } from '../../data/mockData';

const RequestTypeTable = () => {
    return (
        <StatCard title="Tickets by Request Type" className="h-full">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-4 py-3 font-medium">Request Type</th>
                            <th className="px-4 py-3 font-medium text-right"># of Tickets</th>
                            <th className="px-4 py-3 font-medium text-right">Avg Days Open</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {requestTypeData.map((item, index) => (
                            <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-700">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-8 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item.type}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right text-slate-600">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="bg-blue-500 h-full rounded-full"
                                                style={{ width: `${(item.count / 50) * 100}%` }}
                                            />
                                        </div>
                                        {item.count}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right text-slate-600 font-mono">
                                    {item.avgDays.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-slate-50/80 font-semibold text-slate-800">
                            <td className="px-4 py-3">Total</td>
                            <td className="px-4 py-3 text-right">166</td>
                            <td className="px-4 py-3 text-right">57.44</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </StatCard>
    );
};

export default RequestTypeTable;
