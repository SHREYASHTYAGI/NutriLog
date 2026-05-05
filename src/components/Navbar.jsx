import React from 'react';
import './navbar.css';
import { supabase } from '../Supabase';

export default function Navbar(){
    const logout = async () => {
    await supabase.auth.signOut();
  };
  return (
    <header className="ft-navbar">
      <div className="ft-navbar-left">
        <div className="ft-logo">FTracker</div>
        <nav className="ft-nav-links">
          <button className="nav-btn active">Dashboard</button>
          <button className="nav-btn">Reports</button>
          <button className="nav-btn">Profile</button>
        </nav>
      </div>
      <div className="ft-navbar-right">
        <button className="btn primary" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
