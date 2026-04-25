import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS } from '../utils/constants';
import { useAssessment } from '../context/AssessmentContext';
import QuestionCard from '../components/QuestionCard';
import { ArrowRight, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

const QuestionnaireView = () => {
  const navigate = useNavigate();
  const { answers, handleAnswerChange, calculateResults, companyName } = useAssessment();

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = QUESTIONS.length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const isComplete = answeredCount === totalQuestions;

  // Group questions by category
  const groupedQuestions = useMemo(() => {
    const groups = {};
    QUESTIONS.forEach(q => {
      if (!groups[q.category]) groups[q.category] = [];
      groups[q.category].push(q);
    });
    return groups;
  }, []);

  const categories = Object.keys(groupedQuestions);
  // Start with the first category open
  const [openSection, setOpenSection] = useState(categories[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateResults(); // Trigger compute
    navigate('/dashboard');
  };

  const getSectionProgress = (category) => {
    const qs = groupedQuestions[category];
    const answered = qs.filter(q => answers.hasOwnProperty(q.id)).length;
    return `${answered}/${qs.length}`;
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
      <header className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h2 className="text-gradient">Security Assessment</h2>
          <p style={{ color: 'var(--text-muted)' }}>Evaluating: <strong style={{ color: 'var(--text-main)' }}>{companyName || 'Unknown'}</strong></p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
      </header>

      {/* Progress Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: '600' }}>Overall Progress</span>
          <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{progressPercent}%</span>
        </div>
        <div style={{ height: '8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${progressPercent}%`, 
            background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 10px var(--primary-glow)'
          }}></div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {categories.map((cat, catIndex) => {
          const isOpen = openSection === cat;
          return (
            <div key={cat} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <div 
                style={{ 
                  padding: '1.25rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: isOpen ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderBottom: isOpen ? '1px solid var(--border)' : 'none'
                }}
                onClick={() => setOpenSection(isOpen ? null : cat)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {isOpen ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: isOpen ? 'var(--text-main)' : 'var(--text-muted)' }}>{cat}</h3>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', background: 'var(--bg-dark)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                  {getSectionProgress(cat)}
                </div>
              </div>
              
              {isOpen && (
                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {groupedQuestions[cat].map((q, index) => (
                      <QuestionCard 
                        key={q.id}
                        question={q}
                        index={QUESTIONS.findIndex(x => x.id === q.id)} // Keep global index
                        isAnswered={answers.hasOwnProperty(q.id)}
                        answerValue={answers.hasOwnProperty(q.id) ? answers[q.id] : null}
                        onAnswer={handleAnswerChange}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleSubmit}
          style={{ 
            padding: '1rem 2rem',
            cursor: 'pointer',
            opacity: isComplete ? 1 : 0.8
          }}
        >
          Generate Report <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default QuestionnaireView;
