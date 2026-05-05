import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/dashboard.css';

export default function DashboardLayout({ children }){
  return (
    <div className="ft-app-root">
      <Navbar />
      <div className="ft-shell">
        <Sidebar />
        <main className="ft-main">{children}</main>
      </div>
    </div>
  );
}
