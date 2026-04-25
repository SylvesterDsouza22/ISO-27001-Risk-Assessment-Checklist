import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AssessmentProvider } from './context/AssessmentContext';
import LandingView from './views/LandingView';
import QuestionnaireView from './views/QuestionnaireView';
import DashboardView from './views/DashboardView';

function App() {
  return (
    <AssessmentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingView />} />
          <Route path="/assessment" element={<QuestionnaireView />} />
          <Route path="/dashboard" element={<DashboardView />} />
        </Routes>
      </Router>
    </AssessmentProvider>
  );
}

export default App;
