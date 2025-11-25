import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from './StatCard';
import { trendData } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';

const TrendChart = () => {
    const { isDarkMode } = useTheme();

    const axisColor = isDarkMode ? '#94a3b8' : '#64748b';
    const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
    const barColor = isDarkMode ? '#818cf8' : '#0f172a';
    const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';
    const tooltipBorder = isDarkMode ? '#334155' : '#f1f5f9';
    const tooltipText = isDarkMode ? '#f8fafc' : '#0f172a';

    return (
        <StatCard title="# of Open Jira Tickets by Created Date" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={trendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: axisColor, fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                        cursor={{ fill: isDarkMode ? '#334155' : '#f1f5f9' }}
                        contentStyle={{
                            backgroundColor: tooltipBg,
                            borderColor: tooltipBorder,
                            color: tooltipText,
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        itemStyle={{ color: tooltipText }}
                    />
                    <Bar
                        dataKey="tickets"
                        fill={barColor}
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                        label={{ position: 'top', fill: axisColor, fontSize: 12 }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </StatCard>
    );
};

export default TrendChart;
