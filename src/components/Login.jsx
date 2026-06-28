import React, { useState } from 'react';
import { Cpu, ShieldAlert, Key, Mail, Sparkles, AlertCircle, User, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Login({ onLoginSuccess, users, setUsers }) {
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
          <h1>CivicTwin AI</h1>
          <p style={{ fontSize: '0.85rem' }}>
            {isRegistering ? 'Create Your Dynamic Credentials Profile' : 'Constituency Digital Twin Authentication'}
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 0, 85, 0.1)', border: '1px solid rgba(255, 0, 85, 0.25)', borderRadius: '8px', padding: '0.75rem', color: 'var(--danger)', fontSize: '0.8rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Forms */}
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
                placeholder="mp@civictwin.gov.in"
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

            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Don't have credentials? </span>
              <button 
                type="button" 
                onClick={toggleMode} 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-sans)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
              >
                Sign Up <ArrowRight size={12} />
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

            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Already registered? </span>
              <button 
                type="button" 
                onClick={toggleMode} 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-sans)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
              >
                <ArrowLeft size={12} /> Sign In
              </button>
            </div>
          </form>
        )}

        {/* Credentials cheat helper toggle (only shown on Sign In) */}
        {!isRegistering && (
          <div style={{ textAlign: 'center' }}>
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
    </div>
  );
}
