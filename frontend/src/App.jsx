import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Results from "./pages/Results";
import Pricing from "./pages/Pricing";
import SignIn from "./pages/SignIn";
import CoverLetter from "./pages/CoverLetter";
import JobTracker from "./pages/JobTracker";
import InterviewPrep from "./pages/InterviewPrep";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeTemplates from "./pages/ResumeTemplates";
import ResumeExamples from "./pages/ResumeExamples";
import ResumeGuide from "./pages/ResumeGuide";
import Organizations from "./pages/Organizations";
import ResumeHistory from "./pages/ResumeHistory";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResumeCompare from "./pages/ResumeCompare";
import SharedResult from "./pages/SharedResult";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import CommandPalette from "./components/CommandPalette";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CommandPalette />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/results" element={<Results />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/cover-letter" element={<CoverLetter />} />
          <Route path="/job-tracker" element={<JobTracker />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/resume-templates" element={<ResumeTemplates />} />
          <Route path="/resume-examples" element={<ResumeExamples />} />
          <Route path="/resume-guide" element={<ResumeGuide />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/resume-history" element={<ResumeHistory />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/resume-compare" element={<ResumeCompare />} />
          <Route path="/share/:id" element={<SharedResult />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}