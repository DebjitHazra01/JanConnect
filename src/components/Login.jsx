import React, { useState } from 'react';
import { Cpu, Key, Mail, Sparkles, AlertCircle, User, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Login({ onLoginSuccess, users, setUsers }) {
  const [showDemoSelector, setShowDemoSelector] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Sign In inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up inputs
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('mp'); // default to MP

  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAutofill = (user) => {
    setEmail(user.email);
    setPassword(user.pass || 'mp123'); // fallback password
    setError('');
  };

  const handleDemoLogin = (role) => {
    // Find matching pre-seeded account
    const match = users.find(u => u.role === role);
    if (match) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess({
          email: match.email,
          role: match.role,
          name: match.name
        });
      }, 800);
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');
    
    // Find matching profile in the dynamic user database
    const match = users.find(c => c.email.toLowerCase() === email.toLowerCase().trim() && (c.pass === password || c.password === password));
    
    if (match) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess({
          email: match.email,
          role: match.role,
          name: match.name
        });
      }, 1000);
    } else {
      setIsShaking(true);
      setError('Invalid email or password. Please try again.');
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = newEmail.toLowerCase().trim();

    // Check if email already registered
    const exists = users.some(u => u.email.toLowerCase() === trimmedEmail);
    if (exists) {
      setIsShaking(true);
      setError('An account with this email address already exists.');
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      const newUser = {
        name: newName,
        email: trimmedEmail,
        pass: newPassword, // standard field used by autofill / lookup
        password: newPassword,
        role: newRole
      };

      // Add to main state database
      setUsers(prev => [...prev, newUser]);
      
      // Auto Login on Sign Up
      onLoginSuccess({
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      });

      alert(`Account created successfully! Auto-logged in as: ${newUser.name}`);
    }, 1200);
  };

  const toggleMode = () => {
    setError('');
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="login-container">
      {/* Background decorations */}
      <div className="glow-spot-1"></div>
      <div className="glow-spot-2"></div>

      <div className={`glass-panel login-card ${isShaking ? 'login-error-shake' : ''}`}>
        {/* Card Header */}
        <div className="login-header">
          <Cpu className="login-logo" size={42} />
          <h1>JanConnect</h1>
          <p style={{ fontSize: '0.85rem' }}>
            {showDemoSelector 
              ? 'Constituency Digital Twin Platform Explorer' 
              : isRegistering 
                ? 'Create Your Dynamic Credentials Profile' 
                : 'Constituency Digital Twin Authentication'}
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 0, 85, 0.1)', border: '1px solid rgba(255, 0, 85, 0.25)', borderRadius: '8px', padding: '0.75rem', color: 'var(--danger)', fontSize: '0.8rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Forms / Role selectors */}
        {showDemoSelector ? (
          /* ONE-CLICK DEMO ROLE SELECTOR VIEW */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', marginTop: '0.5rem' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              Choose a Demo Role to log in instantly:
            </div>
            
            {/* MP button */}
            <button 
              onClick={() => handleDemoLogin('mp')}
              className="btn"
              disabled={loading}
              style={{
                width: '100%',
                background: 'rgba(0, 240, 255, 0.08)',
                border: '1px solid var(--primary)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                fontSize: '0.95rem',
                gap: '1rem',
                boxShadow: '0 4px 15px rgba(0, 240, 255, 0.05)',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 240, 255, 0.15)';
                e.currentTarget.style.background = 'rgba(0, 240, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 240, 255, 0.05)';
                e.currentTarget.style.background = 'rgba(0, 240, 255, 0.08)';
              }}
            >
              <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '3px', boxShadow: '0 0 8px var(--primary)', flexShrink: 0 }}></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600 }}>Continue as MP (Demo)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>View live Twin Map & SVG Fund Utilization</span>
              </div>
            </button>

            {/* Officer button */}
            <button 
              onClick={() => handleDemoLogin('officer')}
              className="btn"
              disabled={loading}
              style={{
                width: '100%',
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid #a855f7',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                fontSize: '0.95rem',
                gap: '1rem',
                boxShadow: '0 4px 15px rgba(168, 85, 247, 0.05)',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.15)';
                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.05)';
                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.08)';
              }}
            >
              <div style={{ width: '12px', height: '12px', background: '#a855f7', borderRadius: '3px', boxShadow: '0 0 8px #a855f7', flexShrink: 0 }}></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600 }}>Continue as District Officer (Demo)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Dispatch work orders & view photo attachments</span>
              </div>
            </button>

            {/* Citizen button */}
            <button 
              onClick={() => handleDemoLogin('citizen')}
              className="btn"
              disabled={loading}
              style={{
                width: '100%',
                background: 'rgba(0, 255, 135, 0.08)',
                border: '1px solid var(--success)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                fontSize: '0.95rem',
                gap: '1rem',
                boxShadow: '0 4px 15px rgba(0, 255, 135, 0.05)',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 255, 135, 0.15)';
                e.currentTarget.style.background = 'rgba(0, 255, 135, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 135, 0.05)';
                e.currentTarget.style.background = 'rgba(0, 255, 135, 0.08)';
              }}
            >
              <div style={{ width: '12px', height: '12px', background: 'var(--success)', borderRadius: '3px', boxShadow: '0 0 8px var(--success)', flexShrink: 0 }}></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600 }}>Continue as Citizen (Demo)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>File complaints, upload images, NLP pre-analysis</span>
              </div>
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              <button 
                type="button" 
                onClick={() => setShowDemoSelector(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-sans)' }}
              >
                Or Sign In with Email & Custom Password
              </button>
            </div>
          </div>
        ) : (
          /* TRADITIONAL FORM LOGIN / REGISTRATION */
          <div>
            {!isRegistering ? (
              /* SIGN IN VIEW */
              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={14} /> Email Address
                  </label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="form-input" 
                    placeholder="mp@janconnect.gov.in"
                    required 
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Key size={14} /> Password
                  </label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="form-input" 
                    placeholder="••••••••"
                    required 
                    disabled={loading}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.8rem' }}>
                  <button 
                    type="button" 
                    onClick={() => { setShowDemoSelector(true); setError(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-sans)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <ArrowLeft size={10} /> Back to Demo Roles
                  </button>
                  <button 
                    type="button" 
                    onClick={toggleMode} 
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-sans)' }}
                  >
                    Create Account
                  </button>
                </div>
              </form>
            ) : (
              /* SIGN UP / REGISTER VIEW */
              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <User size={14} /> Full Name
                  </label>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    className="form-input" 
                    placeholder="e.g. John Doe"
                    required 
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={14} /> Email Address
                  </label>
                  <input 
                    type="email" 
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)} 
                    className="form-input" 
                    placeholder="e.g. john@gov.in"
                    required 
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Key size={14} /> Custom Password
                  </label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="form-input" 
                    placeholder="Set your password..."
                    required 
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Assign Dashboard Access Role</label>
                  <select 
                    value={newRole} 
                    onChange={(e) => setNewRole(e.target.value)} 
                    className="form-select"
                    disabled={loading}
                  >
                    <option value="mp">Member of Parliament (MP Dashboard)</option>
                    <option value="officer">District Officer Dashboard</option>
                    <option value="citizen">Citizen Portal</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem', background: 'linear-gradient(135deg, var(--success) 0%, #10b981 100%)', color: '#000', boxShadow: '0 4px 15px rgba(0, 255, 135, 0.3)' }}
                  disabled={loading}
                >
                  {loading ? 'Creating Credentials Profile...' : 'Register & Auto-Login'}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.8rem' }}>
                  <button 
                    type="button" 
                    onClick={() => { setShowDemoSelector(true); setError(''); setIsRegistering(false); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-sans)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <ArrowLeft size={10} /> Back to Demo Roles
                  </button>
                  <button 
                    type="button" 
                    onClick={toggleMode} 
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-sans)' }}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Credentials cheat helper toggle (only shown on Sign In) */}
            {!isRegistering && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button 
                  onClick={() => setShowHelper(!showHelper)}
                  className="credentials-hint-btn"
                >
                  {showHelper ? 'Hide Credentials Profile List' : 'Need credentials? View profile profiles'}
                </button>
                
                {showHelper && (
                  <div className="credentials-modal">
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Sparkles size={12} style={{ color: 'var(--warning)' }} /> Click Autofill for Profile Profiles:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {users.map(u => (
                        <div key={u.email} className="credential-item-row">
                          <div style={{ textAlign: 'left' }}>
                            <div className="credential-role-name">{u.name}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{u.email} • pass: {u.pass || u.password}</div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleAutofill(u)}
                            className="quick-autofill-btn"
                          >
                            Autofill
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
