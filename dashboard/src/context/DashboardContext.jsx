import React, { createContext, useContext, useState, useEffect } from 'react';
import { JiraService } from '../services/jiraService';

const DashboardContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within DashboardProvider');
    }
    return context;
};

export const DashboardProvider = ({ children }) => {
    const [currentView, setCurrentView] = useState('open-tickets');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        teamNames: [],
        assignees: [],
        projects: [],
        priorities: [],
        requestTypes: []
    });

    const refreshData = async () => {
        setLoading(true);
        try {
            const data = await JiraService.getTickets();
            setTickets(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();

        // Listen for refresh events from Electron
        if (window.electronAPI) {
            // Optional: Add listener for 'refresh-dashboard' if implemented
        }
    }, []);

    return (
        <DashboardContext.Provider value={{
            currentView,
            setCurrentView,
            filters,
            setFilters,
            tickets,
            loading,
            error,
            refreshData
        }}>
            {children}
        </DashboardContext.Provider>
    );
};
