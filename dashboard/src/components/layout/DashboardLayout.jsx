import React from 'react';
import Sidebar from './Sidebar';
import FilterSidebar from './FilterSidebar';
import { useDashboard } from '../../context/DashboardContext';

const DashboardLayout = ({ children }) => {
    const { tickets } = useDashboard();

    const handleExport = () => {
        const headers = ['ID', 'Summary', 'Status', 'Priority', 'Assignee', 'Reporter', 'Created'];
        const csvContent = [
            headers.join(','),
            ...tickets.map(t => [
                t.key || t.id,
                `"${(t.fields?.summary || t.summary || '').replace(/"/g, '""')}"`, // Escape quotes
                t.fields?.status?.name || t.status,
                t.fields?.priority?.name || t.priority,
                t.fields?.assignee?.displayName || t.assignee || 'Unassigned',
                t.fields?.reporter?.displayName || t.reporter || 'Unknown',
                t.fields?.created || t.created || new Date().toISOString().split('T')[0]
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `jira_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <div className="w-full">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">HD Dashboard</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time overview of help desk performance</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Export Report
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
                                + New Ticket
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className="flex-1 space-y-6">
                            {children}
                        </div>
                        <FilterSidebar />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
