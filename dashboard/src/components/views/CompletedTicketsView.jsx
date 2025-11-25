import React from 'react';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';
import StatCard from '../dashboard/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockCompletedTickets = [
    { id: 'HD-101', summary: 'Password reset for new employee', resolvedDate: '2023-11-20', duration: '2h', assignee: 'Sarah Wilson' },
    { id: 'HD-105', summary: 'Printer configuration in Lobby', resolvedDate: '2023-11-21', duration: '4h', assignee: 'Mike Chen' },
    { id: 'HD-112', summary: 'VPN access issue', resolvedDate: '2023-11-21', duration: '1h', assignee: 'Sarah Wilson' },
    { id: 'HD-115', summary: 'Software license renewal', resolvedDate: '2023-11-22', duration: '1d', assignee: 'Emma Davis' },
    { id: 'HD-120', summary: 'Monitor flickering', resolvedDate: '2023-11-23', duration: '3h', assignee: 'Mike Chen' },
];

const resolutionTrendData = [
    { date: 'Mon', count: 12 },
    { date: 'Tue', count: 15 },
    { date: 'Wed', count: 8 },
    { date: 'Thu', count: 20 },
    { date: 'Fri', count: 18 },
];

const CompletedTicketsView = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Resolved this Week"
                    value="73"
                    trend="+12%"
                    icon={CheckCircle2}
                    color="emerald"
                />
                <StatCard
                    title="Avg. Resolution Time"
                    value="4.2h"
                    trend="-30m"
                    icon={Clock}
                    color="blue"
                />
                <StatCard
                    title="Satisfaction Score"
                    value="4.8/5"
                    trend="+0.2"
                    icon={Calendar}
                    color="violet"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2">
                    <StatCard title="Resolution Trend (Last 5 Days)" className="h-full">
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={resolutionTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </StatCard>
                </div>

                {/* Recent List */}
                <div className="lg:col-span-1">
                    <StatCard title="Recently Resolved" className="h-full">
                        <div className="space-y-4 mt-2">
                            {mockCompletedTickets.map((ticket) => (
                                <div key={ticket.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{ticket.id}</span>
                                        <span className="text-xs text-slate-400">{ticket.resolvedDate}</span>
                                    </div>
                                    <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2 line-clamp-1">{ticket.summary}</h4>
                                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {ticket.duration}
                                        </div>
                                        <span>{ticket.assignee}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </StatCard>
                </div>
            </div>
        </div>
    );
};

export default CompletedTicketsView;
