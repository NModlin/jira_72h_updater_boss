import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from './StatCard';
import { trendData } from '../../data/mockData';

const TrendChart = () => {
    return (
        <StatCard title="# of Open Jira Tickets by Created Date" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={trendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar
                        dataKey="tickets"
                        fill="#0f172a"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                        label={{ position: 'top', fill: '#64748b', fontSize: 12 }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </StatCard>
    );
};

export default TrendChart;
