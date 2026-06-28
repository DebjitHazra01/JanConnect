import React, { useState } from 'react';
import { 
  Users, DollarSign, AlertTriangle, CheckCircle, 
  Layers, Sparkles, Lightbulb, TrendingUp, TrendingDown,
  Activity, MapPin, Eye
} from 'lucide-react';

export default function MPEngagement({ issues, setIssues, stats }) {
  const [selectedLayers, setSelectedLayers] = useState({
    infrastructure: true,
    water: true,
    health: true,
    education: true,
    environment: true
  });
  
  const [selectedIssue, setSelectedIssue] = useState(null);

  const toggleLayer = (layer) => {
    setSelectedLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Filter issues based on active map layers
  const visibleIssues = issues.filter(issue => {
    if (issue.status === 'Resolved') return false; // Only show active issues on map
    if (issue.category === 'Road' || issue.category === 'Electricity') return selectedLayers.infrastructure;
    if (issue.category === 'Water' || issue.category === 'Sanitation') return selectedLayers.water;
    if (issue.category === 'Health') return selectedLayers.health;
    if (issue.category === 'Education') return selectedLayers.education;
    if (issue.category === 'Environment' || issue.category === 'Crop Health') return selectedLayers.environment;
    return true;
  });

  // Calculate department budgets for the charts
  const departmentStats = [
    { name: 'Public Works', budget: 12.5, spent: 9.8, color: '#00f0ff' },
    { name: 'Water & Sanitation', budget: 8.0, spent: 6.2, color: '#00bfff' },
    { name: 'Health Services', budget: 10.5, spent: 7.9, color: '#ff0055' },
    { name: 'Education Dept', budget: 6.5, spent: 5.8, color: '#ffb700' },
    { name: 'Grid & Energy', budget: 9.0, spent: 7.1, color: '#a855f7' }
  ];

  // AI recommendations (sort active issues by severity and priority)
  const aiRecommendations = [...issues]
    .filter(i => i.status !== 'Resolved')
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Title & Sparkle tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            Constituency Digital Twin <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(0, 240, 255, 0.15)', color: 'var(--primary)', border: '1px solid rgba(0, 240, 255, 0.3)', verticalAlign: 'middle' }}>LIVE FEED</span>
          </h1>
          <p style={{ marginTop: '0.25rem' }}>Constituency: West Bengaluru (District-4) • Real-time AI Governance Console</p>
        </div>
        <div className="badge badge-indigo" style={{ padding: '0.5rem 1rem' }}>
          <Sparkles size={14} style={{ color: '#c084fc' }} />
          <span>AI Model Version: 2.4-Gov-Pro</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-card-left">
            <span className="stat-card-title">Total Population</span>
            <span className="stat-card-value">1.24M</span>
            <span className="stat-card-trend up">
              <TrendingUp size={12} /> 1.2% Growth
            </span>
          </div>
          <div className="stat-card-icon cyan">
            <Users size={20} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-card-left">
            <span className="stat-card-title">Active Issues</span>
            <span className="stat-card-value">{stats.active}</span>
            <span className="stat-card-trend down" style={{ color: stats.active > 5 ? 'var(--warning)' : 'var(--success)' }}>
              {stats.active > 8 ? 'High Load' : 'Stable'}
            </span>
          </div>
          <div className="stat-card-icon amber">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-card-left">
            <span className="stat-card-title">Resolution Rate</span>
            <span className="stat-card-value">{stats.resolvedRate}%</span>
            <span className="stat-card-trend up">
              <TrendingUp size={12} /> +2.4% this week
            </span>
          </div>
          <div className="stat-card-icon emerald">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-card-left">
            <span className="stat-card-title">Fund Utilization</span>
            <span className="stat-card-value">79.2%</span>
            <span className="stat-card-trend up">
              <TrendingUp size={12} /> 46.5M Budget
            </span>
          </div>
          <div className="stat-card-icon purple">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      {/* Main Map & Detail Panel Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Interactive Geospatial Twin */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} style={{ color: 'var(--primary)' }} /> Live Geospatial Twin Layer Map
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>*Interactive Map Pins</div>
          </div>

          <div className="map-viewport">
            {/* SVG Interactive Vector Map */}
            <svg className="map-svg" viewBox="0 0 800 480">
              {/* Definitions for map gradients */}
              <defs>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0b0f19" stopOpacity="1" />
                </radialGradient>
              </defs>
              
              {/* Map Base Background */}
              <rect width="800" height="480" fill="url(#mapGlow)" rx="12" />

              {/* Constituency Border (Shaded Polygon) */}
              <polygon 
                points="100,80 350,50 650,80 750,220 700,420 400,450 150,380 80,240" 
                fill="#131828" 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="1.5"
              />

              {/* Environment / Parks Layer */}
              <g className={`map-layer ${selectedLayers.environment ? 'active' : ''}`} fill="rgba(0, 255, 135, 0.04)" stroke="rgba(0, 255, 135, 0.2)" strokeWidth="1">
                {/* Forest Reserve North East */}
                <path d="M 500,70 Q 580,50 640,90 T 700,180 Q 650,220 550,180 Z" />
                {/* Lake/Reservoir Center */}
                <path d="M 380,220 Q 420,200 450,240 T 420,280 Q 370,260 380,220 Z" fill="rgba(0, 191, 255, 0.08)" stroke="rgba(0, 191, 255, 0.3)" />
                {/* Park South West */}
                <path d="M 180,300 Q 230,290 250,330 T 200,370 Q 150,350 180,300 Z" />
              </g>

              {/* Water Pipeline Layer */}
              <g className={`map-layer ${selectedLayers.water ? 'active' : ''}`} fill="none" stroke="#00bfff" strokeWidth="2" opacity="0.6">
                {/* Main Water Conduit */}
                <path d="M 100,240 Q 300,240 380,220 T 700,220" className="map-layer-accent" />
                {/* Branch Pipelines */}
                <path d="M 380,220 L 400,450" />
                <path d="M 300,240 L 150,380" />
                <path d="M 550,220 L 500,70" />
              </g>

              {/* Infrastructure / Roads Layer */}
              <g className={`map-layer ${selectedLayers.infrastructure ? 'active' : ''}`} fill="none" stroke="rgba(241, 243, 249, 0.3)" strokeWidth="3" strokeLinecap="round">
                {/* Express Highway (Main Road Network) */}
                <path d="M 80,240 Q 200,100 350,50 T 650,80" />
                <path d="M 150,380 Q 400,300 700,420" />
                <path d="M 350,50 Q 420,250 400,450" />
              </g>

              {/* Health Assets Layer */}
              <g className={`map-layer ${selectedLayers.health ? 'active' : ''}`} fill="rgba(255, 0, 85, 0.2)" stroke="#ff0055" strokeWidth="1">
                {/* Community Health Center West */}
                <circle cx="160" cy="180" r="10" />
                {/* District Hospital East */}
                <circle cx="620" cy="300" r="15" />
              </g>

              {/* Education Assets Layer */}
              <g className={`map-layer ${selectedLayers.education ? 'active' : ''}`} fill="rgba(255, 183, 0, 0.2)" stroke="#ffb700" strokeWidth="1">
                {/* Central High School */}
                <polygon points="360,120 375,105 390,120 390,135 360,135" />
                {/* Primary School South */}
                <polygon points="280,380 292,370 304,380 304,392 280,392" />
              </g>

              {/* Active Complaint Pins Overlay */}
              {visibleIssues.map((issue) => {
                const priorityColor = 
                  issue.priorityScore >= 80 ? 'var(--danger)' : 
                  issue.priorityScore >= 50 ? 'var(--warning)' : 
                  'var(--success)';

                return (
                  <g 
                    key={issue.id} 
                    className="map-marker"
                    transform={`translate(${issue.coordinates.x}, ${issue.coordinates.y})`}
                    onClick={() => setSelectedIssue(issue)}
                  >
                    {/* Ring Pulse */}
                    <circle cx="0" cy="0" r="12" fill={priorityColor} opacity="0.15" className="marker-pulse" />
                    <circle cx="0" cy="0" r="7" fill={priorityColor} stroke="#000" strokeWidth="1.5" />
                    {/* Tiny text indicating priority */}
                    <text y="-12" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" style={{ pointerEvents: 'none' }}>
                      {issue.priorityScore}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Custom Layer Selector Panel */}
            <div className="map-layer-selector">
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>LAYER LAYERS</div>
              <div className={`layer-toggle layer-roads ${selectedLayers.infrastructure ? 'active' : ''}`} onClick={() => toggleLayer('infrastructure')}>
                <div style={{ width: '8px', height: '8px', background: '#f1f3f9', borderRadius: '50%' }}></div>
                Roads & Transport
              </div>
              <div className={`layer-toggle layer-water ${selectedLayers.water ? 'active' : ''}`} onClick={() => toggleLayer('water')}>
                <div style={{ width: '8px', height: '8px', background: '#00bfff', borderRadius: '50%' }}></div>
                Water Grid Network
              </div>
              <div className={`layer-toggle layer-health ${selectedLayers.health ? 'active' : ''}`} onClick={() => toggleLayer('health')}>
                <div style={{ width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%' }}></div>
                Health Centers
              </div>
              <div className={`layer-toggle layer-education ${selectedLayers.education ? 'active' : ''}`} onClick={() => toggleLayer('education')}>
                <div style={{ width: '8px', height: '8px', background: 'var(--warning)', borderRadius: '50%' }}></div>
                Schools & Colleges
              </div>
              <div className={`layer-toggle layer-environment ${selectedLayers.environment ? 'active' : ''}`} onClick={() => toggleLayer('environment')}>
                <div style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%' }}></div>
                Environment & Parks
              </div>
            </div>

            {/* Map Legend */}
            <div className="map-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: 'var(--danger)' }}></div>
                <span>Critical Priority (&gt;=80)</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: 'var(--warning)' }}></div>
                <span>Medium Priority (50-79)</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: 'var(--success)' }}></div>
                <span>Low Priority (&lt;50)</span>
              </div>
            </div>
          </div>

          {/* Selected Hotspot Detailed View */}
          {selectedIssue ? (
            <div className="twin-detail-overlay">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`issue-priority-pulse ${selectedIssue.priorityScore >= 80 ? 'high' : selectedIssue.priorityScore >= 50 ? 'medium' : 'low'}`}></span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ID: {selectedIssue.id} • {selectedIssue.category}</span>
                  </div>
                  <h3 style={{ fontSize: '1rem', marginTop: '0.25rem' }}>{selectedIssue.title}</h3>
                </div>
                <div className="badge badge-cyan">Score: {selectedIssue.priorityScore}</div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                {selectedIssue.imageUrl && (
                  <img 
                    src={selectedIssue.imageUrl} 
                    alt={selectedIssue.title} 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }} 
                  />
                )}
                <p style={{ fontSize: '0.85rem', margin: 0, flex: 1 }}>{selectedIssue.description}</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>POPULATION IMPACTED</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedIssue.affectedPopulation} citizens</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>EST. RESOLUTION COST</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${selectedIssue.estCost.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>WORKFLOW ROUTED</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedIssue.department}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }} onClick={() => setSelectedIssue(null)}>
                  Close Panel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Click any active map pin hotspot to inspect the digital twin node.
            </div>
          )}
        </div>

        {/* Right Column: AI recommendations & Budgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* AI Decision Recommendations */}
          <div className="glass-panel">
            <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Lightbulb size={18} style={{ color: 'var(--warning)' }} /> AI Action Recommendations
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {aiRecommendations.length > 0 ? (
                aiRecommendations.map((rec, idx) => {
                  const priorityClass = rec.priorityScore >= 80 ? 'badge-crimson' : rec.priorityScore >= 50 ? 'badge-amber' : 'badge-emerald';
                  return (
                    <div key={rec.id} style={{ display: 'flex', gap: '0.75rem', borderBottom: idx < aiRecommendations.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', paddingBottom: '0.75rem' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold', fontSize: '0.8rem', flexShrink: 0, justifyContent: 'center' }}>
                        {idx + 1}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{rec.title}</span>
                          <span className={`badge ${priorityClass}`} style={{ fontSize: '0.65rem', padding: '1px 5px' }}>Score {rec.priorityScore}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          AI Analysis recommends prioritizing due to a high density of affected population ({rec.affectedPopulation} citizens). Est. Budget needed: ${rec.estCost.toLocaleString()}.
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem' }}>
                  No active issues. Constituency is operating at 100% efficiency.
                </div>
              )}
            </div>
          </div>

          {/* Fund Utilization Chart */}
          <div className="glass-panel">
            <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Activity size={18} style={{ color: 'var(--success)' }} /> Department Fund Utilization
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Total Budget: $46.5M • Allocated vs. Actual Spent ($ Millions)
            </p>
            
            {/* Custom Interactive SVG Chart */}
            <div className="chart-container">
              {departmentStats.map((dept, idx) => {
                const maxBudget = 15; // Normalizer for height
                const budgetHeight = (dept.budget / maxBudget) * 160; // Max chart height is ~180px
                const spentHeight = (dept.spent / maxBudget) * 160;

                return (
                  <div key={idx} className="chart-bar-wrapper">
                    <div className="chart-bar-group">
                      {/* Budget Bar (Semi-transparent) */}
                      <div 
                        className="chart-bar" 
                        data-value={`Budget: $${dept.budget}M`}
                        style={{ 
                          height: `${budgetHeight}px`, 
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                      ></div>
                      {/* Spent Bar (Colored Glow) */}
                      <div 
                        className="chart-bar" 
                        data-value={`Spent: $${dept.spent}M`}
                        style={{ 
                          height: `${spentHeight}px`, 
                          backgroundColor: dept.color,
                          boxShadow: `0 0 10px ${dept.color}44`
                        }}
                      ></div>
                    </div>
                    {/* Shortened Label to fit well */}
                    <span className="chart-label" style={{ fontSize: '0.65rem' }}>
                      {dept.name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Chart Legend */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{ width: '12px', height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.15)' }}></div>
                <span>Allocated Budget</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                <span>Actual Spent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
