import React from 'react';
import type { User, UserRole } from '../types';
import { ChevronRight, Menu, X, GraduationCap, Building2, Briefcase } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onOpenLogin: (role?: UserRole) => void;
  onLogout: () => void;
  onNavigateToDashboard?: () => void;
  activeView: 'landing' | 'dashboard';
  setActiveView: (view: 'landing' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenLogin,
  onLogout,
  onNavigateToDashboard,
  activeView,
  setActiveView,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Top Left: Logo & Subtitle */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('landing')}>
            {/* Minimalist Geometric Logo Mark */}
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white shadow-sm">
              <div className="grid grid-cols-2 gap-1 p-1.5">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm opacity-80"></div>
                <div className="w-2 h-2 bg-white rounded-sm opacity-80"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-2xl tracking-tight text-black leading-none">
                Edunet
              </span>
              <span className="text-[11px] font-medium tracking-wider text-brand-500 uppercase mt-1">
                Professional Suite
              </span>
            </div>
          </div>

          {/* Middle: Portal Name & Navigation Links */}
          <div className="hidden lg:flex items-center flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 border border-brand-200 rounded-full text-xs font-semibold text-brand-700 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
              Academia — Industry Collaboration Portal
            </div>
            <nav className="flex items-center space-x-8 text-sm font-medium text-brand-600">
              <a href="#roles" className="hover:text-black transition-colors">Portals & Roles</a>
              <a href="#skill-mapping" className="hover:text-black transition-colors">Skill Mapping</a>
              <a href="#internships" className="hover:text-black transition-colors">Internships & Jobs</a>
              <a href="#academics" className="hover:text-black transition-colors">Academicians & FDPs</a>
              <a href="#preview" className="hover:text-black transition-colors">Live Preview</a>
            </nav>
          </div>

          {/* Top Right: Authentication & Action Triggers */}
          <div className="hidden sm:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    if (onNavigateToDashboard) onNavigateToDashboard();
                    setActiveView(activeView === 'dashboard' ? 'landing' : 'dashboard');
                  }}
                  className="px-4 py-2 text-sm font-medium border border-black rounded-lg hover:bg-brand-50 transition-colors flex items-center gap-2"
                >
                  {activeView === 'dashboard' ? 'View Landing Page' : 'Go to Dashboard'}
                </button>
                <div className="flex items-center gap-2 pl-2 border-l border-brand-200">
                  <div className="w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center font-semibold text-xs overflow-hidden">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-black leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-brand-500 font-semibold">{currentUser.role}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 text-xs text-brand-600 hover:text-black hover:bg-brand-100 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenLogin()}
                  className="px-5 py-2.5 text-sm font-semibold text-black hover:bg-brand-100 rounded-lg transition-colors border border-brand-300"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenLogin('student')}
                  className="px-5 py-2.5 text-sm font-semibold bg-black text-white rounded-lg hover:bg-brand-800 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-brand-600 hover:text-black hover:bg-brand-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-brand-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <div className="text-xs font-semibold text-brand-600 py-1">
            Academia — Industry Collaboration Portal
          </div>
          <div className="flex flex-col space-y-3 text-sm font-medium">
            <a 
              href="#roles" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1 hover:bg-brand-50 rounded"
            >
              Portals & Roles
            </a>
            <a 
              href="#skill-mapping" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1 hover:bg-brand-50 rounded"
            >
              Skill Mapping & Assessment
            </a>
            <a 
              href="#internships" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1 hover:bg-brand-50 rounded"
            >
              Internships & Placements
            </a>
            <a 
              href="#academics" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1 hover:bg-brand-50 rounded"
            >
              Academicians & FDPs
            </a>
          </div>

          <div className="pt-4 border-t border-brand-200 space-y-2">
            {currentUser ? (
              <>
                <div className="text-xs text-brand-600">Signed in as <span className="font-bold text-black">{currentUser.name}</span> ({currentUser.role})</div>
                <button
                  onClick={() => {
                    setActiveView(activeView === 'dashboard' ? 'landing' : 'dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-sm font-semibold bg-black text-white rounded-lg"
                >
                  {activeView === 'dashboard' ? 'View Landing Page' : 'Go to Dashboard'}
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-sm text-brand-600 border border-brand-300 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-sm font-semibold border border-black rounded-lg text-black hover:bg-brand-50"
                >
                  Log In
                </button>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={() => {
                      onOpenLogin('student');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 text-xs font-medium bg-brand-100 rounded text-black flex flex-col items-center"
                  >
                    <GraduationCap className="w-4 h-4 mb-1" />
                    Student
                  </button>
                  <button
                    onClick={() => {
                      onOpenLogin('institute');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 text-xs font-medium bg-brand-100 rounded text-black flex flex-col items-center"
                  >
                    <Building2 className="w-4 h-4 mb-1" />
                    Institute
                  </button>
                  <button
                    onClick={() => {
                      onOpenLogin('industry');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 text-xs font-medium bg-brand-100 rounded text-black flex flex-col items-center"
                  >
                    <Briefcase className="w-4 h-4 mb-1" />
                    Industry
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
