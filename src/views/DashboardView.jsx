import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import DecisionTreeViewer from '../components/DecisionTreeViewer';
import { generatePDFReport } from '../utils/pdfExport';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, LabelList } from 'recharts';
import { Download, AlertCircle, ShieldAlert, ArrowLeft, FileText, Target, BrainCircuit, Crosshair } from 'lucide-react';

const DashboardView = () => {
  const navigate = useNavigate();
  const { companyName, calculateResults, saveAssessment } = useAssessment();
  const results = calculateResults();
  
  const [expandedCriticality, setExpandedCriticality] = useState(null);

  React.useEffect(() => {
    saveAssessment();
  }, []);

  if (!results) return null;

  const handleDownloadPDF = () => {
    generatePDFReport('report-content', companyName, results.score);
  };

  const chartData = [
    { name: 'Score', value: results.score },
    { name: 'Remaining', value: 100 - results.score }
  ];
  
  const COLORS = ['var(--primary)', 'var(--bg-surface)'];

  const getStatusColor = (status) => {
    if (status === 'SATISFIED') return 'var(--success)';
    if (status === 'PARTIALLY SATISFIED') return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <header className="flex-between" style={{ marginBottom: '2rem' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/assessment')}>
          <ArrowLeft size={18} /> Back to Survey
        </button>
        <button className="btn btn-primary" onClick={handleDownloadPDF}>
          <Download size={18} /> Export PDF Report
        </button>
      </header>

      <div id="report-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', background: 'var(--bg-dark)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        
        {/* 1. Executive Summary & Header */}
        <div className="glass-panel text-center" style={{ borderTop: `4px solid ${getStatusColor(results.status)}` }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>ISO 27001 Audit Report</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Organization: <strong style={{color: 'var(--text-main)'}}>{companyName || 'Unknown'}</strong></p>
          <div style={{ marginTop: '1rem', display: 'inline-block', padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface)', border: `1px solid ${getStatusColor(results.status)}`, color: getStatusColor(results.status), fontWeight: 'bold' }}>
            {results.status}
          </div>
          <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', textAlign: 'left', borderLeft: '4px solid var(--primary)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              <FileText size={18} /> Executive Summary
            </h4>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6' }}>{results.executiveSummary}</p>
          </div>
        </div>

        {/* 2. Top Level Metrics */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Score Card */}
          <div className="glass-panel flex-center" style={{ flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem' }}>Compliance Score</h3>
            <div style={{ width: '200px', height: '200px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2.5rem', fontWeight: 'bold' }}>
                {results.score}%
              </div>
            </div>
          </div>

          {/* Risk Card */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
             <h3 style={{ marginBottom: '1.5rem' }}>Risk Analysis</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1.5rem', borderRadius: '50%', background: results.riskLevel === 'Low Risk' ? 'rgba(16,185,129,0.1)' : results.riskLevel === 'Medium Risk' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)' }}>
                <ShieldAlert size={48} color={results.riskLevel === 'Low Risk' ? 'var(--success)' : results.riskLevel === 'Medium Risk' ? 'var(--warning)' : 'var(--danger)'} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: results.riskLevel === 'Low Risk' ? 'var(--success)' : results.riskLevel === 'Medium Risk' ? 'var(--warning)' : 'var(--danger)' }}>
                  {results.riskLevel}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>Raw Risk Exposure: {results.riskPercent}%</div>
              </div>
            </div>
             {/* Criticality Counts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
              <div onClick={() => setExpandedCriticality(expandedCriticality === 'critical' ? null : 'critical')} style={{ padding: '0.5rem', textAlign: 'center', background: expandedCriticality === 'critical' ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'background 0.2s' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--danger)' }}>{results.criticalityCounts.critical}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Critical</div>
              </div>
              <div onClick={() => setExpandedCriticality(expandedCriticality === 'high' ? null : 'high')} style={{ padding: '0.5rem', textAlign: 'center', background: expandedCriticality === 'high' ? 'rgba(245,158,11,0.2)' : 'rgba(245,158,11,0.1)', border: '1px solid var(--warning)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'background 0.2s' }}>
                 <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--warning)' }}>{results.criticalityCounts.high}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High</div>
              </div>
              <div onClick={() => setExpandedCriticality(expandedCriticality === 'medium' ? null : 'medium')} style={{ padding: '0.5rem', textAlign: 'center', background: expandedCriticality === 'medium' ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)', border: '1px solid #3b82f6', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'background 0.2s' }}>
                 <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>{results.criticalityCounts.medium}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Medium</div>
              </div>
              <div onClick={() => setExpandedCriticality(expandedCriticality === 'low' ? null : 'low')} style={{ padding: '0.5rem', textAlign: 'center', background: expandedCriticality === 'low' ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'background 0.2s' }}>
                 <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--success)' }}>{results.criticalityCounts.low}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Low</div>
              </div>
            </div>
            {expandedCriticality && results.criticalityCounts.lists[expandedCriticality].length > 0 && (
              <div className="animate-fade-in" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-main)', textTransform: 'capitalize' }}>{expandedCriticality} Risk Findings</h4>
                <ul style={{ paddingLeft: '1.5rem', margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {results.criticalityCounts.lists[expandedCriticality].map((item, idx) => (
                    <li key={idx}><strong style={{ color: 'var(--text-main)' }}>{item.control}:</strong> {item.controlName}</li>
                  ))}
                </ul>
              </div>
            )}
            {expandedCriticality && results.criticalityCounts.lists[expandedCriticality].length === 0 && (
              <div className="animate-fade-in" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                No findings in this category.
              </div>
            )}
          </div>
        </div>

        {/* 3. Maturity and AI Insights */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="glass-panel" style={{ borderLeft: '4px solid var(--primary)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              <Target size={20} /> Maturity Level
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Level {results.maturityModel.level}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{results.maturityModel.description}</p>
            
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '1.5rem', height: '10px' }}>
              {[1,2,3,4,5].map(lvl => (
                <div key={lvl} style={{ flex: 1, borderRadius: '2px', background: lvl <= results.maturityModel.level ? 'var(--primary)' : 'var(--bg-surface)' }} />
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ borderLeft: '4px solid var(--success)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--success)' }}>
              <BrainCircuit size={20} /> AI Insights
            </h3>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: '1.05rem' }}>
              "{results.aiInsights}"
            </p>
          </div>
        </div>

        {/* 4. Domain Breakdown */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '2rem' }}>Domain-wise Breakdown</h3>
          <div style={{ width: '100%', height: '450px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.domainBreakdown} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)" />
                <YAxis dataKey="domain" type="category" width={120} stroke="var(--text-main)" />
                <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} />
                <Bar dataKey="score" fill="var(--primary)" barSize={20} radius={[0, 4, 4, 0]}>
                   <LabelList dataKey="score" position="right" fill="var(--text-main)" formatter={(val) => `${val}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Heatmap */}
        <div className="glass-panel">
           <h3 style={{ marginBottom: '1.5rem' }}>Risk Heatmap (ISO Controls)</h3>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
             {results.heatmapData.map((item, i) => (
                <div key={i} style={{ 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  textAlign: 'center',
                  background: item.answeredYes ? 'rgba(16,185,129,0.1)' : item.risk === 'High' || item.risk === 'Critical' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                  border: `1px solid ${item.answeredYes ? 'var(--success)' : item.risk === 'High' || item.risk === 'Critical' ? 'var(--danger)' : 'var(--warning)'}`
                }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{item.control}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.controlName}>
                     {item.controlName}
                  </div>
                </div>
             ))}
           </div>
        </div>

        {/* Tree Vis */}
        <DecisionTreeViewer results={results} />

        {/* Recommendations & Action Plan */}
        <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ borderTop: '4px solid var(--danger)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', marginBottom: '1.5rem' }}>
              <AlertCircle /> Weak Areas & AI Recommendations
            </h3>
            {results.recommendations.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {results.recommendations.map((rec, i) => (
                  <div key={i} style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{rec.control}: {rec.controlName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>&rarr; {rec.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No critical vulnerabilities identified in scope.</p>
            )}
          </div>

          <div className="glass-panel" style={{ borderTop: '4px solid #3b82f6' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', marginBottom: '1.5rem' }}>
              <Crosshair /> Strategic Action Plan
            </h3>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-main)', lineHeight: '1.8' }}>
              {results.actionPlan.map((step, i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>{step}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* 16. Assumptions */}
        <div style={{ textAlign: 'center', padding: '2rem 1rem', marginTop: '2rem', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <p style={{ marginBottom: '0.5rem' }}><strong>Assumptions & Limitations:</strong></p>
          <p>This assessment is based exclusively on self-reported data. No technical validation, automated enumeration, or manual penetration testing was performed as part of this module. Results may differ significantly during a comprehensive external audit. This report does not guarantee full ISO 27001 certification compliance.</p>
        </div>

      </div>
    </div>
  );
};

export default DashboardView;
