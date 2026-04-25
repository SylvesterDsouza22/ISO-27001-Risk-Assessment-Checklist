import React from 'react';

const QuestionCard = ({ question, index, isAnswered, answerValue, onAnswer }) => {
  const val = answerValue ? answerValue.toString().trim().toLowerCase() : '';
  const isYes = val === 'yes';
  const isNo = val === 'no';

  return (
    <div className="glass-panel" style={{ 
      padding: '1.5rem', 
      marginBottom: '1rem',
      borderLeft: isNo ? '4px solid var(--danger)' : isYes ? '4px solid var(--success)' : '1px solid var(--border)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ 
              background: 'var(--bg-surface)', 
              color: 'var(--primary)',
              padding: '0.25rem 0.75rem', 
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              Q{index + 1}
            </span>
            <span style={{ 
              background: 'var(--primary-glow)', 
              color: '#fff',
              padding: '0.25rem 0.75rem', 
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
            }}>
              Control {question.control}: {question.controlName}
            </span>
            <span style={{ 
              background: 'rgba(255,255,255,0.1)', 
              color: 'var(--text-muted)',
              padding: '0.25rem 0.75rem', 
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
            }}>
              Weight: {question.weight}
            </span>
          </div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0' }}>{question.text}</h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem', flex: '0 0 auto' }}>
          <button 
            onClick={() => onAnswer(question.id, 'Yes')}
            style={{ 
              backgroundColor: isYes ? 'var(--success)' : 'rgba(255,255,255,0.05)',
              color: isYes ? '#fff' : 'var(--text-main)',
              boxShadow: isYes ? '0 0 15px var(--success-glow)' : 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: `1px solid ${isYes ? 'var(--success)' : 'var(--border)'}`,
              fontWeight: '600',
              minWidth: '80px'
            }}
          >
            Yes
          </button>
          <button 
            onClick={() => onAnswer(question.id, 'No')}
            style={{ 
              backgroundColor: isNo ? 'var(--danger)' : 'rgba(255,255,255,0.05)',
              color: isNo ? '#fff' : 'var(--text-main)',
              boxShadow: isNo ? '0 0 15px var(--danger-glow)' : 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: `1px solid ${isNo ? 'var(--danger)' : 'var(--border)'}`,
              fontWeight: '600',
              minWidth: '80px'
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
