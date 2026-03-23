import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Map } from '@/maps';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { DeleteAccountPage } from './pages/DeleteAccountPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/delete-account" element={<DeleteAccountPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App