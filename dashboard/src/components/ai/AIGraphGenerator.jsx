import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sparkles, Send } from 'lucide-react';

const AIGraphGenerator = () => {
    const [request, setRequest] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [graphData, setGraphData] = useState(null);
    const [error, setError] = useState('');

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    const handleGenerate = async () => {
        if (!request.trim()) return;

        setIsGenerating(true);
        setError('');

        try {
            // Check if running in Electron
            if (window.electronAPI && window.electronAPI.generateGraph) {
                const data = await window.electronAPI.generateGraph(request);

                if (data.error) {
                    setError(data.error);
                } else {
                    setGraphData(data);
                }
            } else {
                setError('AI graph generation requires Electron environment');
            }
        } catch (err) {
            setError('Failed to generate graph. Please try again.');
            console.error('Graph generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const renderGraph = () => {
        if (!graphData || !graphData.data || graphData.data.length === 0) return null;

        const { chartType, data, labels } = graphData;

        // Prepare data for Recharts
        const formattedData = data.map((value, idx) => ({
            name: labels[idx] || `Item ${idx + 1}`,
            value: value
        }));

        switch (chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={formattedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={formattedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={formattedData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {formattedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                );

            default:
                return <p className="text-slate-500">Unsupported chart type: {chartType}</p>;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-slate-800">AI Graph Generator</h2>
            </div>

            <p className="text-slate-600 mb-4">
                Ask Rovo to create any graph or chart based on your Jira data. Examples:
                "Show me ticket count by priority last month" or "Graph assignee workload distribution"
            </p>

            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="Describe the graph you want..."
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isGenerating}
                />
                <button
                    onClick={handleGenerate}
                    disabled={!request.trim() || isGenerating}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                >
                    {isGenerating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Generate
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {graphData && (
                <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">{graphData.title}</h3>
                    {renderGraph()}

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>AI Insight:</strong> This {graphData.chartType} chart was generated by Rovo AI based on your Jira data.
                            {graphData.insight && <span className="ml-1">{graphData.insight}</span>}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIGraphGenerator;
