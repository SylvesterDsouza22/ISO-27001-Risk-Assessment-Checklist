import React from 'react';
import { AlertTriangle, XOctagon, CheckCircle, AlertCircle } from 'lucide-react';

const DecisionTreeViewer = ({ results }) => {
  if (!results) return null;

  const { treeTriggers, riskLevel, status } = results;

  const hasCritical = riskLevel === "Critical Failure";
  const hasHigh = riskLevel === "High Risk" || hasCritical;
  const hasMedium = riskLevel === "Medium Risk" || hasHigh;

  const triggerString = treeTriggers.join(" | ");

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Decision Tree Logic Path</h3>
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-dark)' }}>
        
        {/* Base Flow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: hasCritical ? 0.4 : 1 }}>
          <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            System Evaluated Score
          </div>
          <div style={{ height: '2px', background: 'var(--border)', flex: 1, position: 'relative' }}>
             <div style={{ position: 'absolute', right: 0, top: '-4px', width: '10px', height: '10px', background: 'var(--text-muted)', transform: 'rotate(45deg)' }}></div>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: status === 'SATISFIED' ? '1px solid var(--success)' : status === 'PARTIALLY SATISFIED' ? '1px solid var(--warning)' : '1px solid var(--border)' }}>
            Base Risk: {status}
          </div>
        </div>

        {/* Medium Risk Branch */}
        {hasMedium && !hasHigh && !hasCritical && (
          <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '2rem', borderLeft: '2px dashed #3b82f6' }}>
            <div style={{ width: '20px', height: '2px', background: '#3b82f6' }}></div>
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.1)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid #3b82f6',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#3b82f6'
            }}>
              <AlertCircle size={20} />
               <span>{triggerString}</span>
            </div>
          </div>
        )}

        {/* High Risk Branch */}
        {hasHigh && !hasCritical && (
          <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '2rem', borderLeft: '2px dashed var(--warning)' }}>
            <div style={{ width: '20px', height: '2px', background: 'var(--warning)' }}></div>
            <div style={{ 
              background: 'rgba(245, 158, 11, 0.1)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--warning)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--warning)'
            }}>
              <AlertTriangle size={20} />
               <span>{triggerString}</span>
            </div>
          </div>
        )}

        {/* Critical Branch */}
        {hasCritical && (
          <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '2rem', borderLeft: '2px dashed var(--danger)' }}>
            <div style={{ width: '20px', height: '2px', background: 'var(--danger)' }}></div>
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--danger)'
            }}>
              <XOctagon size={20} />
               <span>{triggerString}</span>
            </div>
          </div>
        )}

        {!hasMedium && !hasHigh && !hasCritical && (
           <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '2rem', borderLeft: '2px dashed var(--success)' }}>
           <div style={{ width: '20px', height: '2px', background: 'var(--success)' }}></div>
           <div style={{ 
             background: 'rgba(16, 185, 129, 0.1)', 
             padding: '1rem', 
             borderRadius: 'var(--radius-sm)', 
             border: '1px solid var(--success)',
             display: 'flex',
             alignItems: 'center',
             gap: '0.75rem',
             color: 'var(--success)'
           }}>
             <CheckCircle size={20} />
              <span>{triggerString}</span>
           </div>
         </div>
        )}

      </div>
    </div>
  );
};

export default DecisionTreeViewer;
