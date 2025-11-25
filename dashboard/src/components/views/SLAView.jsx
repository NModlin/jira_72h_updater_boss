import React from 'react';
import { AlertTriangle, Clock, ShieldCheck, Siren } from 'lucide-react';
import StatCard from '../dashboard/StatCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const slaRiskData = [
    { name: 'On Track', value: 45, color: '#10b981' },
    { name: 'At Risk', value: 12, color: '#f59e0b' },
    { name: 'Breached', value: 3, color: '#ef4444' },
];

const atRiskTickets = [
    { id: 'HD-145', summary: 'Server outage in NY office', timeLeft: '15m', priority: 'Highest' },
    { id: 'HD-132', summary: 'Executive laptop replacement', timeLeft: '45m', priority: 'High' },
    { id: 'HD-128', summary: 'New hire onboarding - Sales', timeLeft: '1h 20m', priority: 'Medium' },
    { id: 'HD-150', summary: 'Email signature update', timeLeft: '2h', priority: 'Low' },
];

const SLAView = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="SLA Compliance"
                    value="94.2%"
                    trend="-1.5%"
                    icon={ShieldCheck}
                    color="emerald"
                />
                <StatCard
                    title="Breached Tickets"
                    value="3"
                    trend="+1"
                    icon={AlertTriangle}
                    color="rose"
                />
                <StatCard
                    title="Avg. Response Time"
                    value="12m"
                    trend="-2m"
                    icon={Clock}
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-1">
                    <StatCard title="SLA Status Distribution" className="h-full">
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={slaRiskData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {slaRiskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </StatCard>
                </div>

                {/* At Risk List */}
                <div className="lg:col-span-2">
                    <StatCard title="⚠️ At Risk Tickets (Breach < 2h)" className="h-full">
                        <div className="space-y-3 mt-4">
                            {atRiskTickets.map((ticket) => (
                                <div key={ticket.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${ticket.priority === 'Highest' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                ticket.priority === 'High' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                                    'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            <Siren className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{ticket.id}</span>
                                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">{ticket.priority}</span>
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{ticket.summary}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Time Remaining</div>
                                        <div className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono">{ticket.timeLeft}</div>
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

export default SLAView;
