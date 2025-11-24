import React from 'react';
import Sidebar from './Sidebar';
import FilterSidebar from './FilterSidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
      <FilterSidebar />
    </div>
  );
};

export default DashboardLayout;

