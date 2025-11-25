import React, { useEffect, useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';

const TicketSummaryModal = ({ ticket, onClose }) => {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const generateSummary = async () => {
            if (!ticket) return;

            setLoading(true);
            setError(null);

            try {
                const prompt = `Please provide a concise summary for Jira ticket ${ticket.id}: "${ticket.summary}". 
                Include:
                1. What is the core issue?
                2. What is the current status?
                3. What is the recommended next step?
                
                Keep it brief and actionable.`;

                let response;
                if (window.electronAPI && window.electronAPI.askRovo) {
                    response = await window.electronAPI.askRovo(prompt);
                } else {
                    // Mock response for dev mode outside Electron
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    response = "This is a simulated AI summary. The ticket involves a critical system update that is currently pending approval. Recommended next step: Follow up with the approval board.";
                }
                setSummary(response);
            } catch (err) {
                console.error("Summary generation failed:", err);
                setError("Failed to generate summary. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        generateSummary();
    }, [ticket]);

    if (!ticket) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <h3 className="font-semibold">AI Smart Summary</h3>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Ticket</div>
                        <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="text-blue-600 dark:text-blue-400">{ticket.id}</span>
                            <span>{ticket.summary}</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700 min-h-[150px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full py-4 space-y-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Analyzing ticket details...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-full text-rose-500 gap-2">
                                <AlertCircle className="w-6 h-6" />
                                <p className="text-sm">{error}</p>
                            </div>
                        ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                    {summary}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketSummaryModal;
