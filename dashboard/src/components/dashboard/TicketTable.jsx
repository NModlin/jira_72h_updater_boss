import React, { useState } from 'react';
import StatCard from './StatCard';
import { useDashboard } from '../../context/DashboardContext';
import { AlertCircle, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import TicketSummaryModal from './TicketSummaryModal';

const PriorityBadge = ({ priority }) => {
    const styles = {
        Highest: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
        High: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
        Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
        Low: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[priority] || styles.Low}`}>
            {priority}
        </span>
    );
};

const TicketTable = () => {
    const { tickets, loading, error } = useDashboard();
    const [selectedTicket, setSelectedTicket] = useState(null);

    if (loading) {
        return (
            <StatCard title="Jira Details" className="h-full">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </StatCard>
        );
    }

    if (error) {
        return (
            <StatCard title="Jira Details" className="h-full">
                <div className="flex items-center justify-center h-64 text-red-500">
                    <AlertCircle className="w-6 h-6 mr-2" />
                    {error}
                </div>
            </StatCard>
        );
    }

    return (
        <>
            <StatCard title="Jira Details" className="h-full">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-4 py-3 font-medium">Issue</th>
                                <th className="px-4 py-3 font-medium">Priority</th>
                                <th className="px-4 py-3 font-medium">Reporter</th>
                                <th className="px-4 py-3 font-medium">Summary</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Assignee</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id || ticket.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400 group-hover:underline cursor-pointer">
                                        {ticket.key || ticket.id}
                                    </td>
                                    <td className="px-4 py-3">
                                        <PriorityBadge priority={ticket.fields?.priority?.name || ticket.priority || 'Medium'} />
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                                                {(ticket.fields?.reporter?.displayName || ticket.reporter || '?').charAt(0)}
                                            </div>
                                            {ticket.fields?.reporter?.displayName || ticket.reporter || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 max-w-xs truncate" title={ticket.fields?.summary || ticket.summary}>
                                        {ticket.fields?.summary || ticket.summary}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            {ticket.fields?.status?.name || ticket.status || 'Open'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                        {ticket.fields?.assignee?.displayName || ticket.assignee || 'Unassigned'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => setSelectedTicket(ticket)}
                                            className="p-1.5 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
                                            title="Generate AI Summary"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </StatCard>

            {selectedTicket && (
                <TicketSummaryModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                />
            )}
        </>
    );
};

export default TicketTable;
