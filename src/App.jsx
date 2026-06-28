import React, { useState } from 'react';
import MPEngagement from './components/MPEngagement';
import DistrictOfficer from './components/DistrictOfficer';
import CitizenPortal from './components/CitizenPortal';
import AIEngineSimulator from './components/AIEngineSimulator';
import Login from './components/Login';
import { Cpu, LogOut, User } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeRole, setActiveRole] = useState('mp'); // 'mp' | 'officer' | 'citizen' | 'simulator'

  // Central User Account Database
  const [users, setUsers] = useState([
    { name: 'Member of Parliament (MP)', email: 'mp@janconnect.gov.in', pass: 'mp123', role: 'mp' },
    { name: 'District Officer', email: 'officer@janconnect.gov.in', pass: 'officer123', role: 'officer' },
    { name: 'Citizen Portal', email: 'citizen@gmail.com', pass: 'citizen123', role: 'citizen' }
  ]);

  // Central State for all issues in the Digital Twin
  const [issues, setIssues] = useState([
    {
      id: 'WO-1024',
      title: 'Sector 4 School Road Pothole',
      description: 'Severe pothole cluster outside the main school gate causing traffic delays and vehicle damage.',
      category: 'Road',
      priorityScore: 68,
      status: 'Pending',
      affectedPopulation: 1200,
      estCost: 3500,
      department: 'Public Works',
      coordinates: { x: 380, y: 110 },
      createdAt: '2026-06-26T08:00:00Z'
    },
    {
      id: 'WO-1025',
      title: 'Broken Main Water Conduit',
      description: 'Massive water leakage from the primary supply grid pipeline near Sector 5 market, flooding adjacent roads.',
      category: 'Water',
      priorityScore: 88,
      status: 'In Progress',
      affectedPopulation: 2500,
      estCost: 4800,
      department: 'Water & Sanitation',
      coordinates: { x: 380, y: 220 },
      createdAt: '2026-06-26T09:15:00Z'
    },
    {
      id: 'WO-1026',
      title: 'Fluctuating Substation Transformer',
      description: 'Sparking transmission cables and humming noise coming from Sector 2 substation. Power outages reported.',
      category: 'Electricity',
      priorityScore: 82,
      status: 'Pending',
      affectedPopulation: 1800,
      estCost: 6500,
      department: 'Grid & Energy',
      coordinates: { x: 550, y: 220 },
      createdAt: '2026-06-26T10:30:00Z'
    },
    {
      id: 'WO-1027',
      title: 'Overflowing Sewage Line',
      description: 'Clogged sewage pipeline backing up into residential streets, causing heavy sanitation and odor concerns.',
      category: 'Sanitation',
      priorityScore: 54,
      status: 'In Progress',
      affectedPopulation: 600,
      estCost: 2000,
      department: 'Water & Sanitation',
      coordinates: { x: 300, y: 240 },
      createdAt: '2026-06-26T11:00:00Z'
    },
    {
      id: 'WO-1028',
      title: 'Hospital ICU Air Purifier Failure',
      description: 'The clean-air regulation system in District Hospital Ward B is malfunctioning. Needs immediate diagnostics.',
      category: 'Health',
      priorityScore: 94,
      status: 'Pending',
      affectedPopulation: 140,
      estCost: 8000,
      department: 'Health Services',
      coordinates: { x: 620, y: 300 },
      createdAt: '2026-06-26T12:00:00Z'
    }
  ]);

  // Compute live statistics based on issues list
  const getStats = () => {
    const total = issues.length;
    const active = issues.filter(i => i.status !== 'Resolved').length;
    const resolved = issues.filter(i => i.status === 'Resolved').length;
    const resolvedRate = total > 0 ? Math.round((resolved / total) * 100) : 100;
    return { total, active, resolved, resolvedRate };
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveRole(user.role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const stats = getStats();

  // If not logged in, render Login card page
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} users={users} setUsers={setUsers} />;
  }

  return (
    <div className="app-container">
      {/* Background decoration glow balls */}
      <div className="glow-spot-1"></div>
      <div className="glow-spot-2"></div>

      {/* Main Sticky Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="brand-section">
            <Cpu className="logo-icon" size={24} />
            <span className="brand-text">JanConnect</span>
          </div>

          {/* Quick Real-time State Strip */}
          <div className="dashboard-stats-strip">
            <div className="stat-strip-item">
              <span className="stat-strip-label">Global Status</span>
              <span className="stat-strip-value" style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span className="issue-priority-pulse low"></span> Operational
              </span>
            </div>
            <div className="stat-strip-item">
              <span className="stat-strip-label">Active / Total</span>
              <span className="stat-strip-value">{stats.active} / {stats.total}</span>
            </div>
            <div className="stat-strip-item">
              <span className="stat-strip-label">Resolution Rate</span>
              <span className="stat-strip-value" style={{ color: 'var(--primary)' }}>{stats.resolvedRate}%</span>
            </div>
          </div>

          {/* Auth info & logout control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '0.35rem 0.75rem', borderRadius: '8px' }}>
              <User size={14} style={{ color: 'var(--primary)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{currentUser.name}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>{currentUser.email}</span>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="btn btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="content-body">
        {activeRole === 'mp' && (
          <MPEngagement issues={issues} setIssues={setIssues} stats={stats} />
        )}
        {activeRole === 'officer' && (
          <DistrictOfficer issues={issues} setIssues={setIssues} stats={stats} />
        )}
        {activeRole === 'citizen' && (
          <CitizenPortal issues={issues} setIssues={setIssues} />
        )}
        {activeRole === 'simulator' && (
          <AIEngineSimulator issues={issues} setIssues={setIssues} />
        )}
      </main>
    </div>
  );
}
