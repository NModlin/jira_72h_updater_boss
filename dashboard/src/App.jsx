import React from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import AssigneeChart from './components/dashboard/AssigneeChart';
import TrendChart from './components/dashboard/TrendChart';
import RequestTypeTable from './components/dashboard/RequestTypeTable';
import TicketTable from './components/dashboard/TicketTable';
import AIChatAssistant from './components/ai/AIChatAssistant';
import AIGraphGenerator from './components/ai/AIGraphGenerator';
import { DashboardProvider, useDashboard } from './context/DashboardContext';

function DashboardContent() {
  const { currentView } = useDashboard();

  const renderView = () => {
    switch (currentView) {
      case 'open-tickets':
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AssigneeChart />
              <TrendChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <RequestTypeTable />
              </div>
              <div className="lg:col-span-2">
                <TicketTable />
              </div>
            </div>
          </>
        );
      case 'completed':
        return <div className="text-center text-slate-500 py-12">Completed Tickets view - Coming soon</div>;
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
        return <div className="text-center text-slate-500 py-12">SLAs view - Coming soon</div>;
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
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

export default App;
