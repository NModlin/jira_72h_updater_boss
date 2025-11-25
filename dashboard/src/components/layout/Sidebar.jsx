import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, CheckSquare, TrendingUp, Clock, AlertCircle, MoreHorizontal, Moon, Sun, Settings, LogOut } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = () => {
    const { currentView, setCurrentView } = useDashboard();
    const { theme, toggleTheme } = useTheme();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Open Tickets', view: 'open-tickets' },
        { icon: CheckSquare, label: 'Completed Tickets', view: 'completed' },
        { icon: TrendingUp, label: 'Jira Trends', view: 'trends' },
        { icon: Clock, label: 'Ticket Backlog Trends', view: 'backlog' },
        { icon: AlertCircle, label: 'SLAs', view: 'slas' },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSettings = () => {
        if (window.electronAPI) {
            window.electronAPI.openExternal('settings'); // Or a specific IPC for opening settings window
        } else {
            alert('Settings are only available in the desktop app.');
        }
        setShowMenu(false);
    };

    return (
        <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col transition-colors duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
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
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 relative" ref={menuRef}>
                {showMenu && (
                    <div className="absolute bottom-full left-4 w-56 mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                        <div className="p-1">
                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md"
                            >
                                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </button>
                            <button
                                onClick={handleSettings}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md"
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </button>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="w-full flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-medium px-2 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <MoreHorizontal className="w-4 h-4" />
                    More Options
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
