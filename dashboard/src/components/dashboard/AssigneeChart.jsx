import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from './StatCard';
import { assigneeData } from '../../data/mockData';

const AssigneeChart = () => {
    return (
        <StatCard title="Open Tickets by Assignee" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={assigneeData}
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="fresh" stackId="a" fill="#22c55e" name="Fresh" radius={[0, 0, 0, 0]} barSize={20} />
                    <Bar dataKey="almostStale" stackId="a" fill="#eab308" name="Almost Stale" radius={[0, 0, 0, 0]} barSize={20} />
                    <Bar dataKey="stale" stackId="a" fill="#f97316" name="Stale" radius={[0, 0, 0, 0]} barSize={20} />
                    <Bar dataKey="spoiled" stackId="a" fill="#ef4444" name="Spoiled" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </StatCard>
    );
};

export default AssigneeChart;
