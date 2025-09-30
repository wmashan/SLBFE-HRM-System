import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserAccountCreation from './pages/UserAccountCreation';
import LoginPage from './pages/LoginPage';
import HRManagerDashboard from './pages/HRManagerDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-account" element={<UserAccountCreation />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/hr-dashboard" element={<HRManagerDashboard />} />
          {/* Default dashboard route for backward compatibility */}
          <Route path="/dashboard" element={<HRManagerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;