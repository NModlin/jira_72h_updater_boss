import React from 'react';
import StatCard from './StatCard';
import { mockTickets } from '../../data/mockData';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

const PriorityBadge = ({ priority }) => {
    const styles = {
        Highest: 'bg-red-100 text-red-700 border-red-200',
        High: 'bg-orange-100 text-orange-700 border-orange-200',
        Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        Low: 'bg-blue-100 text-blue-700 border-blue-200',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[priority] || styles.Low}`}>
            {priority}
        </span>
    );
};

const TicketTable = () => {
    return (
        <StatCard title="Jira Details" className="h-full">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-4 py-3 font-medium">Issue</th>
                            <th className="px-4 py-3 font-medium">Priority</th>
                            <th className="px-4 py-3 font-medium">Reporter</th>
                            <th className="px-4 py-3 font-medium">Summary</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Assignee</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {mockTickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-4 py-3 font-medium text-blue-600 group-hover:underline cursor-pointer">
                                    {ticket.id}
                                </td>
                                <td className="px-4 py-3">
                                    <PriorityBadge priority={ticket.priority} />
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                            {ticket.reporter.charAt(0)}
                                        </div>
                                        {ticket.reporter}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-700 max-w-xs truncate" title={ticket.summary}>
                                    {ticket.summary}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <Clock className="w-3.5 h-3.5" />
                                        {ticket.status}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                    {ticket.assignee}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </StatCard>
    );
};

export default TicketTable;
