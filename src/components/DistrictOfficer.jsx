import React, { useState } from 'react';
import { 
  Wrench, Clock, User, PlusCircle, CheckCircle, 
  Play, Send, AlertCircle, FileText, CheckCircle2 
} from 'lucide-react';

export default function DistrictOfficer({ issues, setIssues, stats }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Road',
    affectedPopulation: 500,
    estCost: 1500,
    department: 'Public Works'
  });

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'new'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'affectedPopulation' || name === 'estCost' ? parseInt(value) || 0 : value
    }));
  };

  // Auto set department based on category selection
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    let department = 'Public Works';
    let estCost = 2500;
    
    if (category === 'Water' || category === 'Sanitation') {
      department = 'Water & Sanitation';
      estCost = 1500;
    } else if (category === 'Electricity') {
      department = 'Grid & Energy';
      estCost = 3000;
    } else if (category === 'Health') {
      department = 'Health Services';
      estCost = 5000;
    } else if (category === 'Education') {
      department = 'Education Dept';
      estCost = 4500;
    } else if (category === 'Crop Health') {
      department = 'Agriculture & Environment';
      estCost = 2000;
    }

    setFormData(prev => ({ ...prev, category, department, estCost }));
  };

  // Submit manual work order
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    // Generate random coordinates inside constituency boundary
    const x = Math.floor(Math.random() * 500) + 150;
    const y = Math.floor(Math.random() * 300) + 80;

    const newIssue = {
      id: `WO-${Date.now().toString().slice(-4)}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priorityScore: Math.floor(Math.random() * 40) + 50, // Auto calculated mock score
      status: 'Pending',
      affectedPopulation: formData.affectedPopulation,
      estCost: formData.estCost,
      department: formData.department,
      coordinates: { x, y },
      createdAt: new Date().toISOString()
    };

    setIssues(prev => [newIssue, ...prev]);
    setFormData({
      title: '',
      description: '',
      category: 'Road',
      affectedPopulation: 500,
      estCost: 1500,
      department: 'Public Works'
    });
    setActiveTab('orders');
  };

  // Update workflow status
  const updateStatus = (id, newStatus) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === id) {
        return { ...issue, status: newStatus };
      }
      return issue;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          District Officer Dashboard
        </h1>
        <p style={{ marginTop: '0.25rem' }}>District: D-4 (Bengaluru West) • Operational Dispatch & Field Work Management</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '1.5rem', marginBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '2px solid #a855f7' : '2px solid transparent',
            color: activeTab === 'orders' ? '#a855f7' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.95rem',
            padding: '0.5rem 0',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Wrench size={16} /> Active Work Orders ({issues.filter(i => i.status !== 'Resolved').length})
        </button>
        <button 
          onClick={() => setActiveTab('new')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'new' ? '2px solid #a855f7' : '2px solid transparent',
            color: activeTab === 'new' ? '#a855f7' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.95rem',
            padding: '0.5rem 0',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <PlusCircle size={16} /> Create Work Order
        </button>
      </div>

      {/* Main Body */}
      {activeTab === 'orders' ? (
        <div className="dashboard-grid">
          {/* Work Orders List */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
            <h2 style={{ fontSize: '1.25rem' }}>Workflow Queue</h2>
            
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Issue Detail</th>
                    <th>Dept / Score</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map(issue => {
                    const isPending = issue.status === 'Pending';
                    const isInProgress = issue.status === 'In Progress';
                    const isResolved = issue.status === 'Resolved';
                    
                    let priorityBadge = 'badge-emerald';
                    if (issue.priorityScore >= 80) priorityBadge = 'badge-crimson';
                    else if (issue.priorityScore >= 50) priorityBadge = 'badge-amber';

                    return (
                      <tr key={issue.id} style={{ opacity: isResolved ? 0.6 : 1 }}>
                        <td style={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{issue.id}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            {issue.imageUrl && (
                              <img 
                                src={issue.imageUrl} 
                                alt={issue.title} 
                                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0, marginTop: '0.25rem' }} 
                              />
                            )}
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{issue.title}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {issue.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{issue.department}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                            <span className={`badge ${priorityBadge}`} style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                              Score {issue.priorityScore}
                            </span>
                          </div>
                        </td>
                        <td>
                          {isPending && <span className="badge badge-amber"><Clock size={12} /> Pending</span>}
                          {isInProgress && <span className="badge badge-cyan"><Play size={12} /> In Progress</span>}
                          {isResolved && <span className="badge badge-emerald"><CheckCircle size={12} /> Resolved</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            {isPending && (
                              <button 
                                onClick={() => updateStatus(issue.id, 'In Progress')}
                                className="btn btn-secondary" 
                                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderColor: 'var(--primary-glow)' }}
                                title="Dispatch Field Team"
                              >
                                Dispatch
                              </button>
                            )}
                            {isInProgress && (
                              <button 
                                onClick={() => updateStatus(issue.id, 'Resolved')}
                                className="btn btn-primary" 
                                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', background: 'var(--success)', color: '#000', boxShadow: 'none' }}
                                title="Mark Work Complete"
                              >
                                Resolve
                              </button>
                            )}
                            {isResolved && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <CheckCircle2 size={14} style={{ color: 'var(--success)' }} /> Closed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Operations Monitor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Stats */}
            <div className="glass-panel">
              <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Ops Monitoring</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justify: 'space-between', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Pending Dispatch:</span>
                  <span style={{ fontWeight: 600, color: 'var(--warning)' }}>
                    {issues.filter(i => i.status === 'Pending').length}
                  </span>
                </div>
                <div style={{ display: 'flex', justify: 'space-between', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Teams In Field:</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                    {issues.filter(i => i.status === 'In Progress').length}
                  </span>
                </div>
                <div style={{ display: 'flex', justify: 'space-between', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Completed Work:</span>
                  <span style={{ fontWeight: 600, color: 'var(--success)' }}>
                    {issues.filter(i => i.status === 'Resolved').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Department Load */}
            <div className="glass-panel">
              <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Team Load by Dept</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Public Works', 'Water & Sanitation', 'Grid & Energy', 'Health Services'].map(dept => {
                  const deptIssues = issues.filter(i => i.department === dept && i.status !== 'Resolved');
                  const percent = Math.min(100, (deptIssues.length / 5) * 100);
                  
                  return (
                    <div key={dept} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span>{dept}</span>
                        <span style={{ fontWeight: 600 }}>{deptIssues.length} active</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${percent}%`, 
                          background: percent > 80 ? 'var(--danger)' : percent > 40 ? 'var(--warning)' : 'var(--primary)'
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Create Work Order Form */
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }} className="glass-panel">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} style={{ color: '#a855f7' }} /> Manual Work Order Request
          </h2>
          <form onSubmit={handleSubmitOrder}>
            <div className="form-group">
              <label className="form-label">Task / Work Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                className="form-input" 
                placeholder="e.g. Broken water conduit at Sector 4 Junction" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description / Scope of Work</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                className="form-textarea" 
                placeholder="Describe the issue and requirements..." 
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select name="category" value={formData.category} onChange={handleCategoryChange} className="form-select">
                  <option value="Road">Road & Infrastructure</option>
                  <option value="Water">Water Infrastructure</option>
                  <option value="Electricity">Electricity Grid</option>
                  <option value="Sanitation">Sanitation / Trash</option>
                  <option value="Health">Health Facility</option>
                  <option value="Crop Health">Crop / Park Environment</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Department</label>
                <input 
                  type="text" 
                  name="department" 
                  value={formData.department} 
                  className="form-input" 
                  disabled 
                  style={{ opacity: 0.7, background: 'rgba(0,0,0,0.2)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Est. Affected Population</label>
                <input 
                  type="number" 
                  name="affectedPopulation" 
                  value={formData.affectedPopulation} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  min="1" 
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Est. Budget Cost ($)</label>
                <input 
                  type="number" 
                  name="estCost" 
                  value={formData.estCost} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  min="100" 
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setActiveTab('orders')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', color: '#fff', boxShadow: '0 4px 15px rgba(168,85,247,0.3)' }}
              >
                <Send size={16} /> Dispatch Work Order
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
