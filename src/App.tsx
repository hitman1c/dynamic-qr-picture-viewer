import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SectionRedirect from './components/SectionRedirect';
import SiteLayout from './components/SiteLayout';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import PictureViewPage from './pages/PictureViewPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<SectionRedirect section="features" />} />
          <Route path="/about" element={<SectionRedirect section="about" />} />
          <Route path="/team" element={<SectionRedirect section="team" />} />
          <Route path="/how-it-works" element={<SectionRedirect section="how-it-works" />} />
          <Route path="/faq" element={<SectionRedirect section="faq" />} />
        </Route>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/view/:id" element={<PictureViewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
