import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const LandingView = () => {
  const navigate = useNavigate();
  const { companyName, setCompanyName } = useAssessment();

  const handleStart = (e) => {
    e.preventDefault();
    if (companyName.trim()) {
      navigate('/assessment');
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            background: 'var(--bg-surface)', 
            padding: '1.5rem', 
            borderRadius: '50%',
            boxShadow: 'var(--shadow-glow)',
            border: '1px solid var(--border)'
          }}>
            <ShieldCheck size={64} color="var(--primary)" />
          </div>
        </div>
        
        <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>
          ISO 27001 Compliance Checker
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>
          An intelligent system that evaluates your company's security posture against ISO 27001 standards using structured logic and risk scoring.
        </p>

        <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-main)' }}>
              Company Name
            </label>
            <input 
              type="text" 
              required
              className="input-field" 
              placeholder="e.g. Acme Corp..."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>
            Start Assessment <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ marginTop: '3rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <p>Powered by Advanced Generative AI & Decision Tree Logic</p>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
