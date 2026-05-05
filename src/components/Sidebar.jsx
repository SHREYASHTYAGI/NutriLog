import React from 'react';
import './sidebar.css';

export default function Sidebar(){
  return (
    <aside className="ft-sidebar">
      <div className="ft-sidebar-group">
        <button className="side-item">Overview</button>
        <button className="side-item">Intake</button>
        <button className="side-item">Workouts</button>
        <button className="side-item">Settings</button>
      </div>
      <div className="ft-sidebar-footer">© FTracker</div>
    </aside>
  );
}
