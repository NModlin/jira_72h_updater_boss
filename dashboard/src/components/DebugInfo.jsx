import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Bug, X } from 'lucide-react';

const DebugInfo = () => {
    const { tickets, loading, error } = useDashboard();
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 p-2 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 z-50 opacity-50 hover:opacity-100 transition-opacity"
                title="Debug Info"
            >
                <Bug className="w-5 h-5" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-96 bg-slate-900 text-slate-200 p-4 rounded-lg shadow-xl z-50 text-xs font-mono border border-slate-700">
            <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
                <h3 className="font-bold text-yellow-500 flex items-center gap-2">
                    <Bug className="w-4 h-4" /> Debug Console
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-2">
                <div>
                    <span className="text-slate-500">Electron API:</span>{' '}
                    <span className={window.electronAPI ? 'text-green-400' : 'text-red-400'}>
                        {window.electronAPI ? 'Available' : 'Missing'}
                    </span>
                </div>
                <div>
                    <span className="text-slate-500">Loading:</span>{' '}
                    <span className={loading ? 'text-yellow-400' : 'text-slate-300'}>
                        {loading.toString()}
                    </span>
                </div>
                <div>
                    <span className="text-slate-500">Error:</span>{' '}
                    <span className={error ? 'text-red-400' : 'text-green-400'}>
                        {error ? error : 'None'}
                    </span>
                </div>
                <div>
                    <span className="text-slate-500">Tickets Count:</span>{' '}
                    <span className="text-blue-400">{tickets.length}</span>
                </div>

                {tickets.length > 0 && (
                    <div className="mt-2">
                        <div className="text-slate-500 mb-1">First Ticket Sample:</div>
                        <pre className="bg-slate-950 p-2 rounded overflow-x-auto max-h-32 text-[10px]">
                            {JSON.stringify(tickets[0], null, 2)}
                        </pre>
                    </div>
                )}

                <div className="mt-2 pt-2 border-t border-slate-700">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-center"
                    >
                        Force Reload
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DebugInfo;
