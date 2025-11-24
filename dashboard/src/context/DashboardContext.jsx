import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within DashboardProvider');
    }
    return context;
};

export const DashboardProvider = ({ children }) => {
    const [currentView, setCurrentView] = useState('open-tickets');
    const [filters, setFilters] = useState({
        teamNames: [],
        assignees: [],
        projects: [],
        priorities: [],
        requestTypes: []
    });

    return (
        <DashboardContext.Provider value={{ currentView, setCurrentView, filters, setFilters }}>
            {children}
        </DashboardContext.Provider>
    );
};
