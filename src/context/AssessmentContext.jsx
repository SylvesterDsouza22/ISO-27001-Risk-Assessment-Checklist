import React, { createContext, useState, useContext, useEffect } from 'react';
import { QUESTIONS, getAIRecommendation } from '../utils/constants';

const AssessmentContext = createContext();

export const useAssessment = () => useContext(AssessmentContext);

export const AssessmentProvider = ({ children }) => {
  const [companyName, setCompanyName] = useState('');
  const [answers, setAnswers] = useState({}); // { q1: true, q2: false, ... }
  const [pastAssessments, setPastAssessments] = useState([]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('ccns_assessments');
    if (saved) {
      try {
        setPastAssessments(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse past assessments");
      }
    }
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateResults = () => {
    const totalQuestions = QUESTIONS.length;
    let obtainedScore = 0;
    let totalPossibleScore = 0;
    let noAnswersCount = 0;

    QUESTIONS.forEach(q => {
      totalPossibleScore += q.weight;
      const val = answers[q.id] ? answers[q.id].toString().trim().toLowerCase() : '';
      const isYes = val === 'yes';

      if (isYes) {
        obtainedScore += q.weight;
      } else {
        noAnswersCount += 1; // Unanswered or anything else counts as No for risk purposes
      }
    });

    const complianceScorePercent = Math.round((obtainedScore / totalPossibleScore) * 100);
    
    // Determine Compliance Status
    let complianceStatus = "NOT SATISFIED";
    if (complianceScorePercent >= 85) {
      complianceStatus = "SATISFIED";
    } else if (complianceScorePercent >= 60) {
      complianceStatus = "PARTIALLY SATISFIED";
    }

    // Determine Risk %
    let rawRiskPercent = Math.round((noAnswersCount / totalQuestions) * 100);
    
    // Determine basic Risk Level
    let riskLevel = "Low Risk";
    if (rawRiskPercent >= 30 && rawRiskPercent <= 60) {
      riskLevel = "Medium Risk";
    } else if (rawRiskPercent > 60) {
      riskLevel = "High Risk";
    }

    // Custom Decision Tree Overrides (Helper to parse "no")
    const isAnswerNo = (qId) => {
      const val = answers[qId] ? answers[qId].toString().trim().toLowerCase() : '';
      return val !== 'yes'; // If it's not strictly 'yes', it's a 'no'
    };

    const isAccessNo = isAnswerNo('q2');
    const isMFANo = isAnswerNo('q3');
    const isPrivilegedNo = isAnswerNo('q12');
    const isEncNo = isAnswerNo('q4');
    const isIncNo = isAnswerNo('q7');
    const isBackupNo = isAnswerNo('q22');
    const isVulnMgmtNo = isAnswerNo('q18');

    let treeTriggers = [];

    if (isMFANo || isPrivilegedNo) {
      riskLevel = "High Risk";
      treeTriggers.push("High Risk Path: MFA or Privileged Access Control is lacking.");
    }
    
    if (isEncNo && isBackupNo) {
      riskLevel = "Critical Failure";
      treeTriggers.push("Critical Failure: Both Encryption and Backup are lacking.");
      complianceStatus = "NOT SATISFIED"; // Force not satisfied on critical failure
    }

    if (isVulnMgmtNo && riskLevel !== "Critical Failure" && riskLevel !== "High Risk") {
      riskLevel = "Medium Risk";
      treeTriggers.push("Medium Risk Escalation: Vulnerability Management is lacking.");
    }

    if (!isMFANo && !isEncNo && !isIncNo && !isBackupNo) {
      if (riskLevel !== "Critical Failure" && riskLevel !== "High Risk") {
        treeTriggers.push("Secure Baseline: Critical controls (MFA, Encryption, Incident, Backup) are satisfied.");
      }
    }

    // Determine Weak and Strong Areas & Recommendations
    const weakAreas = [];
    const strongAreas = [];
    const recommendations = [];

    QUESTIONS.forEach(q => {
      const val = answers[q.id] ? answers[q.id].toString().trim().toLowerCase() : '';
      const answeredYes = val === 'yes';
      
      if (answeredYes) {
        strongAreas.push(q);
      } else {
        weakAreas.push(q);
        recommendations.push({
          control: q.control,
          controlName: q.controlName,
          text: getAIRecommendation(q.id)
        });
      }
    });

    // Step 7: Domain-Wise
    const domainScores = {};
    QUESTIONS.forEach(q => {
      const val = answers[q.id] ? answers[q.id].toString().trim().toLowerCase() : '';
      const answeredYes = val === 'yes';

      if (!domainScores[q.category]) {
        domainScores[q.category] = { earned: 0, total: 0 };
      }
      domainScores[q.category].total += q.weight;
      if (answeredYes) {
        domainScores[q.category].earned += q.weight;
      }
    });

    const domainBreakdown = Object.keys(domainScores).map(cat => ({
      domain: cat,
      score: Math.round((domainScores[cat].earned / domainScores[cat].total) * 100)
    }));

    // Step 8: Heatmap
    const heatmapData = QUESTIONS.map(q => {
      const val = answers[q.id] ? answers[q.id].toString().trim().toLowerCase() : '';
      const isYes = val === 'yes';
      let riskVal = 'Low';
      if (!isYes) {
         if (q.weight >= 9) riskVal = 'High';
         else if (q.weight >= 7) riskVal = 'Medium';
         else riskVal = 'Low';
      }
      return { id: q.id, control: q.control, controlName: q.controlName, risk: riskVal, answeredYes: isYes, weight: q.weight };
    });

    // Step 12: Criticality
    let criticalIssues = 0;
    let highIssues = 0;
    let mediumIssues = 0;
    let lowIssues = 0;

    let criticalItems = [];
    let highItems = [];
    let mediumItems = [];
    let lowItems = [];

    QUESTIONS.forEach(q => {
      const val = answers[q.id] ? answers[q.id].toString().trim().toLowerCase() : '';
      if (val !== 'yes') {
         if (q.weight >= 10) { criticalIssues++; criticalItems.push(q); }
         else if (q.weight >= 8) { highIssues++; highItems.push(q); }
         else if (q.weight >= 6) { mediumIssues++; mediumItems.push(q); }
         else { lowIssues++; lowItems.push(q); }
      }
    });

    const criticalityCounts = { 
      critical: criticalIssues, 
      high: highIssues, 
      medium: mediumIssues, 
      low: lowIssues,
      lists: {
        critical: criticalItems,
        high: highItems,
        medium: mediumItems,
        low: lowItems
      }
    };

    // Step 9: Maturity Model
    let maturityLvl = 1;
    let maturityDesc = "Level 1 - Initial";
    if (complianceScorePercent >= 90) {
      maturityLvl = 5; maturityDesc = "Level 5 - Optimized";
    } else if (complianceScorePercent >= 75) {
      maturityLvl = 4; maturityDesc = "Level 4 - Managed";
    } else if (complianceScorePercent >= 60) {
      maturityLvl = 3; maturityDesc = "Level 3 - Defined";
    } else if (complianceScorePercent >= 40) {
      maturityLvl = 2; maturityDesc = "Level 2 - Developing";
    }

    const maturityModel = { level: maturityLvl, description: maturityDesc };

    // Step 10 & 14: Summary & Insights
    let executiveSummary = "";
    let aiInsights = "";
    
    if (criticalIssues > 0 || highIssues > 1) {
      executiveSummary = "The organization shows significant compliance gaps with ISO 27001 requirements. Immediate action is needed to secure critical infrastructure.";
      aiInsights = `Identified ${criticalIssues} critical weaknesses. Major concerns in structural preventive controls. Probability of breach is currently elevated.`;
    } else if (mediumIssues > 0 || highIssues === 1) {
      executiveSummary = "The organization demonstrates partial compliance. Core controls are somewhat established, but key operational gaps still pose medium-to-high risks.";
      aiInsights = "Some preventive controls observed, but detective/response controls require tightening. Recommend focused remediation on identified weak spots.";
    } else {
      executiveSummary = "The organization demonstrates strong compliance with ISO 27001 controls. No critical gaps identified. Overall security posture is robust.";
      aiInsights = "Strong preventive and detective controls observed. Low probability of security breach. Recommend continuous monitoring and annual exercises.";
    }

    // Step 15: Action Plan (Prioritized)
    const actionPlan = [];
    
    // Immediate
    if (criticalIssues > 0) {
      actionPlan.push("[IMMEDIATE] Address Critical path failures (MFA, Encryption, Backup, Incident Response) to prevent systemic compromise.");
    } else if (isMFANo || isEncNo || isBackupNo) {
      actionPlan.push("[IMMEDIATE] Address lacking critical foundational controls.");
    }

    // Short-term
    if (highIssues > 0 || mediumIssues > 0) {
      actionPlan.push("[SHORT-TERM] Deploy compensating controls for High/Medium risk operational vulnerabilities.");
    }
    if (domainBreakdown.some(d => d.score < 60)) {
      actionPlan.push(`[SHORT-TERM] Implement policies for underperforming domain(s): ${domainBreakdown.filter(d => d.score < 60).map(d => d.domain).join(', ')}.`);
    }

    // Long-term
    actionPlan.push("[LONG-TERM] Integrate automated SIEM logging and continuous monitoring across environments.");
    actionPlan.push("[LONG-TERM] Conduct periodic independent penetration testing and annual ISO 27001 compliance reviews.");

    return {
      score: complianceScorePercent,
      status: complianceStatus,
      riskPercent: rawRiskPercent,
      riskLevel,
      treeTriggers,
      weakAreas,
      strongAreas,
      recommendations,
      domainBreakdown,
      heatmapData,
      criticalityCounts,
      maturityModel,
      executiveSummary,
      aiInsights,
      actionPlan
    };
  };

  const saveAssessment = () => {
    const results = calculateResults();
    const assessmentRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      companyName: companyName || 'Unknown Company',
      answers,
      results
    };
    
    const updatedHistory = [...pastAssessments, assessmentRecord];
    setPastAssessments(updatedHistory);
    localStorage.setItem('ccns_assessments', JSON.stringify(updatedHistory));
  };

  const resetAssessment = () => {
    setCompanyName('');
    setAnswers({});
  };

  return (
    <AssessmentContext.Provider value={{
      companyName,
      setCompanyName,
      answers,
      handleAnswerChange,
      calculateResults,
      saveAssessment,
      pastAssessments,
      resetAssessment
    }}>
      {children}
    </AssessmentContext.Provider>
  );
};
