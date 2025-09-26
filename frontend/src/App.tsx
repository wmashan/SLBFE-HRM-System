import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserAccountCreation from './pages/UserAccountCreation';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-account" element={<UserAccountCreation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;