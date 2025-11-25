import React from 'react';
import Sidebar from './Sidebar';
import FilterSidebar from './FilterSidebar';
import DebugInfo from '../DebugInfo';
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
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 flex-shrink-0">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">HD Dashboard</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Real-time overview of help desk performance</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExport}
                            className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors border border-slate-200 dark:border-slate-700"
                        >
                            Export Report
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm shadow-blue-600/20">
                            + New Ticket
                        </button>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </div>

            {/* Right Sidebar - Filters */}
            <FilterSidebar />

            {/* Debug Overlay */}
            <DebugInfo />
        </div>
    );
};

export default DashboardLayout;
