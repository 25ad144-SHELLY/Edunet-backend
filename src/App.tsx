import { useState, useEffect } from 'react';
import type { User, UserRole } from './types';
import { DEMO_USERS } from './data/mockData';
import { onAuthStateChange, signOutUser } from './services/authService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RoleExplorer } from './components/RoleExplorer';
import { SkillMappingSection } from './components/SkillMappingSection';
import { InternshipsSection } from './components/InternshipsSection';
import { AcademicCollaboration } from './components/AcademicCollaboration';
import { DashboardPreviewSection } from './components/DashboardPreviewSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { StudentProfile } from './pages/StudentProfile.jsx';
import { SkillTests } from './pages/SkillTests.jsx';
import { Internships } from './pages/Internships.jsx';
import { Settings } from './pages/Settings.jsx';
import { AIRoadmap } from './pages/AIRoadmap.jsx';
import { InstituteDashboard } from './components/dashboards/InstituteDashboard';
import { IndustryDashboard } from './components/dashboards/IndustryDashboard';
import { Loader2 } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('student');
  const [activeView, setActiveView] = useState<'landing' | 'dashboard'>(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    return path.startsWith('/student') || path.startsWith('/institute') || path.startsWith('/industry')
      ? 'dashboard'
      : 'landing';
  });

  // 1. Firebase Authentication Listener (persists across page reloads)
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser);
        const path = window.location.pathname;
        if (path.startsWith('/student') || path.startsWith('/institute') || path.startsWith('/industry')) {
          setActiveView('dashboard');
        }
      } else {
        // If not logged in and directly accessing a student route, allow fallback to demo student for prototype
        const path = window.location.pathname;
        if (path.startsWith('/student')) {
          setCurrentUser(DEMO_USERS.student);
        } else {
          setCurrentUser(null);
        }
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Browser back/forward navigation sync
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path === '/' || path === '' || path === '/landing' || path === '/login') {
        setActiveView('landing');
        if (path === '/login') {
          setIsAuthModalOpen(true);
        }
      } else {
        setActiveView('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    if (path === '/' || path === '/landing' || path === '/login') {
      setActiveView('landing');
      if (path === '/login') {
        setIsAuthModalOpen(true);
      }
    } else {
      setActiveView('dashboard');
      if (path.startsWith('/student') && !currentUser) {
        setCurrentUser(DEMO_USERS.student);
      }
    }
  };

  // Open modal with specific role preselected
  const handleOpenLogin = (role: UserRole = 'student') => {
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveView('dashboard');
    if (user.role === 'student') {
      handleNavigate('/student');
    } else if (user.role === 'institute') {
      handleNavigate('/institute');
    } else if (user.role === 'industry') {
      handleNavigate('/industry');
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error('Error signing out:', err);
    }
    setCurrentUser(null);
    setActiveView('landing');
    handleNavigate('/login');
  };

  const handleExploreSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Initial Firebase Auth Loading State
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center space-y-3 antialiased">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-sm">
          E
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-brand-600">
          <Loader2 className="w-4 h-4 animate-spin text-black" />
          <span>Verifying authentication...</span>
        </div>
      </div>
    );
  }

  // 1. ROUTE: /student/profile
  if ((currentPath === '/student/profile' || (activeView === 'dashboard' && currentPath.endsWith('/profile'))) && (!currentUser || currentUser.role === 'student')) {
    const activeStudent = currentUser || DEMO_USERS.student;
    return (
      <StudentProfile
        user={activeStudent}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onBackToLanding={() => handleNavigate('/')}
      />
    );
  }

  // 2. ROUTE: /student/assessments or /student/assessments/:testId
  if (currentPath.startsWith('/student/assessments') && (!currentUser || currentUser.role === 'student')) {
    const activeStudent = currentUser || DEMO_USERS.student;
    const testIdMatch = currentPath.split('/student/assessments/')[1];
    const testId = testIdMatch ? testIdMatch.split('/')[0] : null;

    return (
      <SkillTests
        user={activeStudent}
        initialTestId={testId}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onBackToLanding={() => handleNavigate('/')}
      />
    );
  }

  // 3. ROUTE: /student/internships or /student/internships/:internshipId
  if (currentPath.startsWith('/student/internships') && (!currentUser || currentUser.role === 'student')) {
    const activeStudent = currentUser || DEMO_USERS.student;
    const internshipIdMatch = currentPath.split('/student/internships/')[1];
    const internshipId = internshipIdMatch ? internshipIdMatch.split('/')[0] : null;

    return (
      <Internships
        user={activeStudent}
        initialInternshipId={internshipId}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onBackToLanding={() => handleNavigate('/')}
      />
    );
  }

  // 4. ROUTE: /student/roadmap
  if (currentPath.startsWith('/student/roadmap') && (!currentUser || currentUser.role === 'student')) {
    const activeStudent = currentUser || DEMO_USERS.student;
    return (
      <AIRoadmap
        user={activeStudent}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onBackToLanding={() => handleNavigate('/')}
      />
    );
  }

  // 5. ROUTE: /student/settings
  if (currentPath.startsWith('/student/settings') && (!currentUser || currentUser.role === 'student')) {
    const activeStudent = currentUser || DEMO_USERS.student;
    return (
      <Settings
        user={activeStudent}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onBackToLanding={() => handleNavigate('/')}
      />
    );
  }

  // 6. ROUTE: /student (Dashboard)
  if ((currentPath.startsWith('/student') || (activeView === 'dashboard' && (!currentUser || currentUser.role === 'student')))) {
    const activeStudent = currentUser || DEMO_USERS.student;
    return (
      <StudentDashboard
        user={activeStudent}
        onLogout={handleLogout}
        onBackToLanding={() => handleNavigate('/')}
        onNavigate={handleNavigate}
        activePath={currentPath}
      />
    );
  }

  // 7. ROUTE: Institute Dashboard
  if (activeView === 'dashboard' && currentUser?.role === 'institute') {
    return (
      <InstituteDashboard
        user={currentUser}
        onLogout={handleLogout}
        onBackToLanding={() => handleNavigate('/')}
      />
    );
  }

  // 8. ROUTE: Industry Dashboard
  if (activeView === 'dashboard' && currentUser?.role === 'industry') {
    return (
      <IndustryDashboard
        user={currentUser}
        onLogout={handleLogout}
        onBackToLanding={() => handleNavigate('/')}
      />
    );
  }

  // 9. Landing Page View
  return (
    <div className="min-h-screen bg-white text-black flex flex-col antialiased selection:bg-black selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        onNavigateToDashboard={() => handleNavigate(currentUser?.role === 'student' ? '/student' : '/dashboard')}
        activeView={activeView}
        setActiveView={(view) => {
          if (view === 'landing') handleNavigate('/');
          else handleNavigate(currentUser?.role === 'student' ? '/student' : '/dashboard');
        }}
      />

      {/* Main Landing Sections */}
      <main className="flex-1">
        
        {/* 1. Hero Section */}
        <Hero
          onOpenLogin={handleOpenLogin}
          onExploreSection={handleExploreSection}
        />

        {/* 2. Three-Pillar Role Explorer (Student, Institute, Industry) */}
        <RoleExplorer
          onOpenLogin={handleOpenLogin}
        />

        {/* 3. Skill Mapping & Assessment Engine Preview */}
        <SkillMappingSection
          onStartFullAssessment={() => handleNavigate('/student/assessments')}
        />

        {/* 4. Industry Internships & Jobs Hub */}
        <InternshipsSection
          onOpenLogin={handleOpenLogin}
        />

        {/* 5. Academician & Higher Education Suite (FDPs, Faculty Internships) */}
        <AcademicCollaboration
          onOpenLogin={handleOpenLogin}
        />

        {/* 6. Live Dashboard Preview (Reference UI) */}
        <DashboardPreviewSection
          onOpenLogin={handleOpenLogin}
        />

      </main>

      {/* Footer */}
      <Footer onOpenLogin={handleOpenLogin} />

      {/* 3-Role Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={authModalRole}
      />

    </div>
  );
}

export default App;
