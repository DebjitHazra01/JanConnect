import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Upload, AlertTriangle, CheckCircle, 
  Clock, Send, Sparkles, MapPin, Image 
} from 'lucide-react';

export default function CitizenPortal({ issues, setIssues, currentUser }) {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Road');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [customImage, setCustomImage] = useState(null);
  
  // Real-time AI pre-analysis state
  const [aiPred, setAiPred] = useState({
    category: 'Road',
    priority: 'Low',
    priorityScore: 30,
    department: 'Public Works',
    confidence: 0,
    submitting: false
  });

  // Derive issues from global state to maintain single source of truth
  const citizenIssues = issues.filter(issue => 
    issue.reportedBy === currentUser?.email || 
    issue.reportedBy === 'system'
  );

  // Pre-configured mock images corresponding to issues
  const mockImages = [
    { name: 'Pothole / Road Damage', type: 'Road', url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=150' },
    { name: 'Water Pipe Leakage', type: 'Water', url: 'https://images.unsplash.com/photo-1542013936693-8848e574047a?w=150' },
    { name: 'Garbage Dump', type: 'Sanitation', url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=150' },
    { name: 'Power Line Sparks', type: 'Electricity', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=150' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result); // Base64 Data URL
        setSelectedPhoto('Custom Upload');
      };
      reader.readAsDataURL(file);
    }
  };

  // Perform a simulated "AI Pre-Analysis" as the citizen types
  useEffect(() => {
    if (description.trim().length === 0) {
      setAiPred({
        category: category,
        priority: 'Low',
        priorityScore: 25,
        department: getDeptForCategory(category),
        confidence: 0
      });
      return;
    }

    // A simple keywords-based heuristic to simulate AI Natural Language Processing (NLP)
    const text = (title + ' ' + description).toLowerCase();
    let estimatedCategory = category;
    let priorityScore = 30;
    
    // NLP Keyword extraction simulation
    if (text.includes('water') || text.includes('leak') || text.includes('clog') || text.includes('pipe') || text.includes('drain')) {
      estimatedCategory = 'Water';
      priorityScore += 25;
    } else if (text.includes('garbage') || text.includes('waste') || text.includes('trash') || text.includes('clean') || text.includes('smell')) {
      estimatedCategory = 'Sanitation';
      priorityScore += 15;
    } else if (text.includes('wire') || text.includes('spark') || text.includes('power') || text.includes('blackout') || text.includes('electricity') || text.includes('light')) {
      estimatedCategory = 'Electricity';
      priorityScore += 35;
    } else if (text.includes('pothole') || text.includes('road') || text.includes('tarmac') || text.includes('bridge') || text.includes('crack')) {
      estimatedCategory = 'Road';
      priorityScore += 20;
    } else if (text.includes('accident') || text.includes('danger') || text.includes('safety') || text.includes('child') || text.includes('school')) {
      priorityScore += 25; // Increase priority for high safety risk
    }

    // Cap score at 98
    priorityScore = Math.min(98, priorityScore);
    
    let priorityLevel = 'Low';
    if (priorityScore >= 80) priorityLevel = 'Critical';
    else if (priorityScore >= 50) priorityLevel = 'Medium';

    setAiPred({
      category: estimatedCategory,
      priority: priorityLevel,
      priorityScore: priorityScore,
      department: getDeptForCategory(estimatedCategory),
      confidence: Math.min(99, 65 + (description.length / 5))
    });

  }, [description, title, category]);

  function getDeptForCategory(cat) {
    switch (cat) {
      case 'Road': return 'Public Works';
      case 'Water': 
      case 'Sanitation': return 'Water & Sanitation';
      case 'Electricity': return 'Grid & Energy';
      case 'Health': return 'Health Services';
      case 'Education': return 'Education Dept';
      default: return 'Public Works';
    }
  }

  // Handle reporting complaint
  const handleReport = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    // Simulate pipeline trigger animation
    setAiPred(prev => ({ ...prev, submitting: true }));

    setTimeout(() => {
      // 1. Generate Coordinates
      const x = Math.floor(Math.random() * 500) + 150;
      const y = Math.floor(Math.random() * 300) + 80;

      // Extract image source
      const imgUrl = selectedPhoto === 'Custom Upload' ? customImage : mockImages.find(i => i.name === selectedPhoto)?.url || null;

      const newIssue = {
        id: `WO-${Date.now().toString().slice(-4)}`,
        title,
        description,
        category: aiPred.category,
        priorityScore: aiPred.priorityScore,
        status: 'Pending',
        affectedPopulation: Math.floor(Math.random() * 800) + 100,
        estCost: aiPred.priorityScore * 50,
        department: aiPred.department,
        coordinates: { x, y },
        createdAt: new Date().toISOString(),
        imageUrl: imgUrl,
        reportedBy: currentUser?.email || 'citizen@gmail.com'
      };

      // Update central global state database
      setIssues(prev => [newIssue, ...prev]);

      // Reset form
      setTitle('');
      setDescription('');
      setSelectedPhoto(null);
      setCustomImage(null);
      setAiPred(prev => ({ ...prev, submitting: false }));
      
      alert(`Report submitted successfully! AI Pipeline auto-classified issue as [${newIssue.category}] and assigned Priority Score: ${newIssue.priorityScore}. Route ID: ${newIssue.id}`);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            Citizen Report Portal
          </h1>
          <p style={{ marginTop: '0.25rem' }}>Empowering citizens to co-manage West Bengaluru constituency</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <Smartphone size={16} style={{ color: 'var(--success)' }} />
          <span>Portal App: Active</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Complaint Submission */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} style={{ color: 'var(--success)' }} /> File a New Incident
          </h2>
          
          <form onSubmit={handleReport} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Incident / Complaint Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="form-input" 
                placeholder="Give a short title..." 
                required 
                disabled={aiPred.submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Select Initial Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="form-select"
                disabled={aiPred.submitting}
              >
                <option value="Road">Road Pothole / Street Blockage</option>
                <option value="Water">Water Leak / Open Drain / Clogging</option>
                <option value="Electricity">Sparking Grid Lines / Power Cut</option>
                <option value="Sanitation">Piled Garbage / Overflowing Waste Bin</option>
                <option value="Health">Community Clinic issue</option>
                <option value="Crop Health">Crop disease / Tree fall</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Provide Description (AI will auto-analyze keywords)</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="form-textarea" 
                placeholder="Describe details: e.g. There is a huge water leakage from a broken pipe near sector 4 school, flooding the street..." 
                required
                disabled={aiPred.submitting}
              />
            </div>

            {/* Media Upload Active Input & Mock presets */}
            <div className="form-group">
              <label className="form-label">Attach Media Evidence (Upload your own photo or choose mock preset)</label>
              
              {/* File Uploader Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--border-color)', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', justifyContent: 'center', transition: 'background 0.2s' }} className="file-upload-label">
                  <Upload size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{customImage ? 'Change Uploaded Photo' : 'Upload Custom Image File'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={aiPred.submitting} />
                </label>
                {customImage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                    <img src={customImage} alt="Uploaded preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 500 }}>✓ Custom Image file loaded successfully</span>
                  </div>
                )}
              </div>

              {/* Presets Title */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Or choose from pre-configured preset photos:</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
                {mockImages.map((img) => (
                  <div 
                    key={img.name} 
                    onClick={() => {
                      if (!aiPred.submitting) {
                        setSelectedPhoto(img.name);
                        setCustomImage(null); // clear custom upload if preset is chosen
                      }
                    }}
                    style={{
                      border: selectedPhoto === img.name ? '2px solid var(--success)' : '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '0.25rem',
                      cursor: 'pointer',
                      background: selectedPhoto === img.name ? 'rgba(0, 255, 135, 0.05)' : 'rgba(0,0,0,0.1)',
                      textAlign: 'center',
                      fontSize: '0.7rem'
                    }}
                  >
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>
                      {img.name.split(' / ')[0]}
                    </div>
                    <div style={{ height: '48px', overflow: 'hidden', borderRadius: '4px', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image size={16} style={{ color: 'var(--text-secondary)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ background: 'linear-gradient(135deg, var(--success) 0%, #10b981 100%)', color: '#000', boxShadow: '0 4px 15px rgba(0, 255, 135, 0.3)' }}
              disabled={aiPred.submitting}
            >
              {aiPred.submitting ? (
                <>
                  <Sparkles size={16} className="marker-pulse" /> Running AI Ingestion Engine...
                </>
              ) : (
                <>
                  <Send size={16} /> Submit to Digital Twin Map
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: AI Pre-Analysis & Track Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Real-time AI Pre-Analysis Indicator */}
          <div className="glass-panel" style={{ border: description.trim() ? '1px solid rgba(0, 240, 255, 0.25)' : '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sparkles size={18} style={{ color: 'var(--primary)' }} /> AI Real-time Pre-Analysis
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Our Natural Language Processor (NLP) dynamically parses text details below to determine severity:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Detected Category:</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{aiPred.category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Assigned Department:</span>
                <span style={{ fontWeight: 600, color: '#c084fc' }}>{aiPred.department}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Est. Priority Level:</span>
                <span style={{ 
                  fontWeight: 600, 
                  color: aiPred.priority === 'Critical' ? 'var(--danger)' : aiPred.priority === 'Medium' ? 'var(--warning)' : 'var(--success)'
                }}>
                  {aiPred.priority} ({aiPred.priorityScore} pts)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>NLP Parser Confidence:</span>
                <span style={{ fontWeight: 600 }}>{description.trim() ? `${aiPred.confidence}%` : 'N/A'}</span>
              </div>
            </div>

            {/* Simulated Processing Visual */}
            {description.trim() && (
              <div style={{ marginTop: '1rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginBottom: '4px' }}>EXTRACTED DATA NODES:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {description.toLowerCase().includes('water') && <span style={{ background: 'rgba(0,191,255,0.15)', color: '#00bfff', padding: '1px 6px', borderRadius: '4px' }}>#water</span>}
                  {description.toLowerCase().includes('leak') && <span style={{ background: 'rgba(0,191,255,0.15)', color: '#00bfff', padding: '1px 6px', borderRadius: '4px' }}>#leakage</span>}
                  {description.toLowerCase().includes('school') && <span style={{ background: 'rgba(255,183,0,0.15)', color: 'var(--warning)', padding: '1px 6px', borderRadius: '4px' }}>#school_nearby</span>}
                  {description.toLowerCase().includes('pothole') && <span style={{ background: 'rgba(241,243,249,0.1)', color: '#f1f3f9', padding: '1px 6px', borderRadius: '4px' }}>#pothole</span>}
                  {description.toLowerCase().includes('danger') && <span style={{ background: 'rgba(255,0,85,0.15)', color: 'var(--danger)', padding: '1px 6px', borderRadius: '4px' }}>#safety_risk</span>}
                  <span style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '1px 6px', borderRadius: '4px' }}>+gps_location</span>
                </div>
              </div>
            )}
          </div>

          {/* Track Previous Reports */}
          <div className="glass-panel">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Your Reported Complaints</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {citizenIssues.map(issue => {
                const isPending = issue.status === 'Pending';
                const isInProgress = issue.status === 'In Progress';
                const isResolved = issue.status === 'Resolved';

                return (
                  <div key={issue.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{issue.title}</span>
                      {isPending && <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}><Clock size={10} /> Pending</span>}
                      {isInProgress && <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}><Clock size={10} /> In Progress</span>}
                      {isResolved && <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}><CheckCircle size={10} /> Resolved</span>}
                    </div>
                    
                    {/* Inline Image and Details layout */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', alignItems: 'flex-start' }}>
                      {issue.imageUrl && (
                        <img 
                          src={issue.imageUrl} 
                          alt={issue.title} 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }} 
                        />
                      )}
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {issue.description}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      <span>ID: {issue.id} • {issue.department}</span>
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
