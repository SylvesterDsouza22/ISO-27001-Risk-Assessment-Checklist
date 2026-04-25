export const QUESTIONS = [
  // Policies & Governance (A.5, A.6, A.18)
  { id: 'q1', text: 'Is there a documented Information Security Policy in place?', control: 'A.5', controlName: 'Information Security Policies', weight: 8, category: 'Policies & Governance' },
  { id: 'q5', text: 'Is there a formal risk assessment and treatment process?', control: 'A.6', controlName: 'Organization of Information Security', weight: 9, category: 'Policies & Governance' },
  { id: 'q11', text: 'Are legal, regulatory, and contractual security requirements identified and followed?', control: 'A.18', controlName: 'Compliance', weight: 9, category: 'Policies & Governance' },
  { id: 'q6', text: 'Are employees given regular security awareness training?', control: 'A.7', controlName: 'Human Resource Security', weight: 6, category: 'Policies & Governance' },
  { id: 'q23', text: 'Are periodic penetration tests or security audits conducted?', control: 'A.18', controlName: 'Security Testing', weight: 9, category: 'Policies & Governance' },

  // Access Control (A.9)
  { id: 'q2', text: 'Are access control policies defined and enforced?', control: 'A.9', controlName: 'Access Control', weight: 10, category: 'Access Control' },
  { id: 'q3', text: 'Is multi-factor authentication (MFA) implemented for critical systems?', control: 'A.9', controlName: 'Access Control', weight: 10, category: 'Access Control' },
  { id: 'q12', text: 'Is privileged (admin/root) access restricted, monitored, and audited?', control: 'A.9', controlName: 'Access Control', weight: 10, category: 'Access Control' },
  
  // Asset Management (A.8)
  { id: 'q13', text: 'Is there an inventory of all information assets (hardware, software, data) maintained?', control: 'A.8', controlName: 'Asset Management', weight: 8, category: 'Asset Management' },
  { id: 'q14', text: 'Are assets classified based on sensitivity (Confidential, Internal, Public)?', control: 'A.8', controlName: 'Asset Management', weight: 7, category: 'Asset Management' },
  
  // Cryptography (A.10)
  { id: 'q4', text: 'Are sensitive data encrypted at rest and in transit?', control: 'A.10', controlName: 'Cryptography', weight: 10, category: 'Cryptography' },

  // Physical Security (A.11)
  { id: 'q15', text: 'Are physical access controls implemented for secure areas (e.g., server rooms)?', control: 'A.11', controlName: 'Physical & Environmental Security', weight: 8, category: 'Physical Security' },
  { id: 'q16', text: 'Are environmental protections (fire suppression, UPS, cooling) in place?', control: 'A.11', controlName: 'Physical & Environmental Security', weight: 7, category: 'Physical Security' },

  // Operations Security (A.12)
  { id: 'q8', text: 'Are logs monitored and security events tracked?', control: 'A.12', controlName: 'Operations Security', weight: 8, category: 'Operations Security' },
  { id: 'q17', text: 'Are logs regularly reviewed, monitored, and securely retained?', control: 'A.12', controlName: 'Operations Security', weight: 8, category: 'Operations Security' },
  { id: 'q18', text: 'Are systems regularly scanned for vulnerabilities and patched promptly?', control: 'A.12', controlName: 'Operations Security', weight: 9, category: 'Operations Security' },
  
  // Network Security (A.13)
  { id: 'q19', text: 'Are firewalls, IDS/IPS, and network segmentation implemented?', control: 'A.13', controlName: 'Network Security', weight: 9, category: 'Network Security' },

  // Secure Development (A.14)
  { id: 'q20', text: 'Are secure coding practices followed during application development?', control: 'A.14', controlName: 'Secure Development', weight: 8, category: 'Secure Development' },
  { id: 'q21', text: 'Are applications tested for security vulnerabilities before deployment?', control: 'A.14', controlName: 'Secure Development', weight: 8, category: 'Secure Development' },

  // Supplier Security (A.15)
  { id: 'q9', text: 'Are third-party/vendor risks assessed and managed?', control: 'A.15', controlName: 'Supplier Relationships', weight: 7, category: 'Supplier Security' },

  // Incident Management (A.16)
  { id: 'q7', text: 'Is there a tested incident plans?', control: 'A.16', controlName: 'Incident Management', weight: 10, category: 'Incident Management' },

  // Business Continuity (A.17)
  { id: 'q10', text: 'Is there a business continuity and disaster recovery plan?', control: 'A.17', controlName: 'Business Continuity', weight: 9, category: 'Business Continuity' },
  { id: 'q22', text: 'Are regular data backups performed and periodically tested for restoration?', control: 'A.17', controlName: 'Business Continuity', weight: 10, category: 'Business Continuity' }
];

export const getAIRecommendation = (questionId) => {
  const recommendations = {
    q1: "Develop and formally approve a comprehensive Information Security Policy document aligned with organizational goals, and communicate it to all employees.",
    q5: "Establish a formal risk management framework (e.g., ISO 27005) to systematically identify, assess, and treat information security risks.",
    q11: "Identify and document all legal, regulatory, and contractual obligations relating to information security and ensure compliance is regularly reviewed.",
    q6: "Conduct quarterly security awareness programs covering phishing, password hygiene, and data handling procedures for all staff.",
    q2: "Implement Role-Based Access Control (RBAC) and enforce the principle of least privilege across all systems.",
    q3: "Deploy Multi-Factor Authentication (MFA) across all administrative accounts, VPNs, and critical infrastructure access points immediately.",
    q12: "Implement a Privileged Access Management (PAM) solution to secure, monitor, and regularly audit all administrator activities.",
    q13: "Implement a centralized asset management system to maintain an accurate hardware and software inventory.",
    q14: "Define a formal data classification scheme (e.g., Public, Internal, Confidential) and label assets accordingly.",
    q4: "Use AES-256 for data at rest and enforce TLS 1.2 or higher for all data in transit.",
    q15: "Install and strictly monitor physical access controls (biometrics/badges) at all secure facilities and data centers.",
    q16: "Deploy necessary environmental controls including UPS, generators, specialized cooling, and fire suppression systems.",
    q8: "Deploy a SIEM solution to centralize log monitoring and set up real-time alerting for suspicious security events.",
    q17: "Implement a robust log retention and review policy, securing logs against tampering and unauthorized access.",
    q18: "Establish an automated vulnerability scanning and patch management process with defined SLAs for critical CVEs.",
    q19: "Deploy next-generation firewalls, IDS/IPS, and strict network segmentation to isolate sensitive workloads.",
    q20: "Adopt secure SDLC practices, integrating security directly into the CI/CD pipeline, and conduct peer code reviews.",
    q21: "Perform mandatory automated SAST/DAST testing before moving any application into a production environment.",
    q9: "Implement a vendor risk management program requiring security assessments for all third parties handling sensitive data.",
    q7: "Develop and test an incident response plan aligned with ISO 27001 A.16. Conduct tabletop exercises at least annually.",
    q10: "Draft a Business Continuity Plan (BCP) and Disaster Recovery Plan (DRP), ensuring critical systems have defined RTOs/RPOs.",
    q22: "Establish an automated backup schedule (3-2-1 rule) and frequently test restoration procedures for data integrity.",
    q23: "Schedule periodic independent penetration testing and vulnerability assessments to validate external and internal security posture."
  };
  return recommendations[questionId];
};
