import React from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import AssigneeChart from './components/dashboard/AssigneeChart';
import TrendChart from './components/dashboard/TrendChart';
import RequestTypeTable from './components/dashboard/RequestTypeTable';
import TicketTable from './components/dashboard/TicketTable';
import AIChatAssistant from './components/ai/AIChatAssistant';
import AIGraphGenerator from './components/ai/AIGraphGenerator';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { ThemeProvider } from './context/ThemeContext';
import OpenTicketsView from './components/views/OpenTicketsView';
import CompletedTicketsView from './components/views/CompletedTicketsView';
import SLAView from './components/views/SLAView';

function DashboardContent() {
  const { currentView } = useDashboard();

  const renderView = () => {
    switch (currentView) {
      case 'open-tickets':
        return <OpenTicketsView />;
      case 'completed':
        return <CompletedTicketsView />;
      case 'trends':
        return (
          <>
            <AIGraphGenerator />
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrendChart />
              <AssigneeChart />
            </div>
          </>
        );
      case 'backlog':
        return <div className="text-center text-slate-500 py-12">Backlog view - Coming soon</div>;
      case 'slas':
        return <SLAView />;
      default:
        return null;
    }
  };

  return (
    <>
      <DashboardLayout>{renderView()}</DashboardLayout>
      <AIChatAssistant />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </ThemeProvider>
  );
}

export default App;
