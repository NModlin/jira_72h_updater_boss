import React from 'react';
import { LayoutDashboard, CheckSquare, TrendingUp, Clock, AlertCircle, MoreHorizontal } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const Sidebar = () => {
    const { currentView, setCurrentView } = useDashboard();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Open Tickets', view: 'open-tickets' },
        { icon: CheckSquare, label: 'Completed Tickets', view: 'completed' },
        { icon: TrendingUp, label: 'Jira Trends', view: 'trends' },
        { icon: Clock, label: 'Ticket Backlog Trends', view: 'backlog' },
        { icon: AlertCircle, label: 'SLAs', view: 'slas' },
    ];

    return (
        <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col">
            <div className="p-6 border-b border-slate-100">
                <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">HD</span>
                    Dashboard
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => setCurrentView(item.view)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${currentView === item.view
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium">
                    <MoreHorizontal className="w-4 h-4" />
                    More Options
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
