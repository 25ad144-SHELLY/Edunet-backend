import React, { useState } from 'react';
import type { UserRole, User } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle 
} from '../services/authService';
import { 
  X, 
  GraduationCap, 
  Building2, 
  Briefcase, 
  ArrowRight, 
  Lock, 
  Mail, 
  Sparkles,
  UserCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'student'
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update selected role if initialRole changes when opening
  React.useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole, isOpen]);

  // Clear errors when switching modes or roles
  React.useEffect(() => {
    setErrorMessage(null);
  }, [authMode, selectedRole]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (authMode === 'login') {
        const user = await signInWithEmail(email.trim(), password);
        onLoginSuccess(user);
        onClose();
      } else {
        const profileData = {
          name: name.trim() || 'Alex Chen',
          role: selectedRole,
          organization: selectedRole === 'student' 
            ? (institutionName.trim() || 'Apex Institute of Technology') 
            : selectedRole === 'institute' 
            ? (institutionName.trim() || 'Apex Institute of Technology') 
            : (companyName.trim() || 'TechCorp Solutions')
        };
        const user = await signUpWithEmail(email.trim(), password, profileData);
        onLoginSuccess(user);
        onClose();
      }
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      let msg = 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/invalid-email') msg = 'Invalid email address format.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      }
      if (err.code === 'auth/email-already-in-use') msg = 'An account with this email already exists.';
      if (err.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await signInWithGoogle();
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage('Google Sign-In failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoQuickLogin = (role: UserRole) => {
    const demo = DEMO_USERS[role];
    onLoginSuccess(demo);
    onClose();
  };

  const roleMeta = {
    student: {
      title: 'Student Portal',
      subtitle: 'Skill assessments, career roadmaps, verified digital portfolio & internships.',
      icon: GraduationCap,
      idLabel: 'Student Roll No / University ID',
      emailPlaceholder: 'alex.chen@university.edu',
      demoUser: DEMO_USERS.student
    },
    institute: {
      title: 'Institute & Academician',
      subtitle: 'Placement readiness analytics, faculty development programs & research grants.',
      icon: Building2,
      idLabel: 'Faculty / Institutional Code',
      emailPlaceholder: 'dean.academics@apex-tech.edu',
      demoUser: DEMO_USERS.institute
    },
    industry: {
      title: 'Industry & Recruiter',
      subtitle: 'Post internships, define competency requirements & hire verified talent.',
      icon: Briefcase,
      idLabel: 'Corporate Domain ID',
      emailPlaceholder: 'talent@techcorp.io',
      demoUser: DEMO_USERS.industry
    }
  };

  const CurrentRoleIcon = roleMeta[selectedRole].icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-xl rounded-2xl border border-brand-300 shadow-2xl overflow-hidden transition-all my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-200 bg-brand-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <div>
              <h3 className="text-lg font-bold text-black leading-tight">Access Edunet Portal</h3>
              <p className="text-xs text-brand-500 font-medium">Firebase Authentication & Cloud Sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-brand-400 hover:text-black hover:bg-brand-200/60 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Error Message Notification */}
          {errorMessage && (
            <div className="p-3 bg-brand-100 border border-brand-300 rounded-xl text-xs font-semibold text-black flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-black shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 3 Role Selection Cards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-500 mb-3">
              Step 1: Choose Your Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              
              {/* Option 1: Student */}
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  selectedRole === 'student'
                    ? 'border-black bg-black text-white shadow-md'
                    : 'border-brand-200 bg-white text-black hover:border-brand-400 hover:bg-brand-50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <GraduationCap className={`w-5 h-5 ${selectedRole === 'student' ? 'text-white' : 'text-black'}`} />
                  {selectedRole === 'student' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm leading-tight">Student</div>
                  <div className={`text-[11px] mt-1 line-clamp-2 ${selectedRole === 'student' ? 'text-brand-300' : 'text-brand-500'}`}>
                    Skill tests & internships
                  </div>
                </div>
              </button>

              {/* Option 2: Institute */}
              <button
                type="button"
                onClick={() => setSelectedRole('institute')}
                className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  selectedRole === 'institute'
                    ? 'border-black bg-black text-white shadow-md'
                    : 'border-brand-200 bg-white text-black hover:border-brand-400 hover:bg-brand-50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <Building2 className={`w-5 h-5 ${selectedRole === 'institute' ? 'text-white' : 'text-black'}`} />
                  {selectedRole === 'institute' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm leading-tight">Institute</div>
                  <div className={`text-[11px] mt-1 line-clamp-2 ${selectedRole === 'institute' ? 'text-brand-300' : 'text-brand-500'}`}>
                    Academicians & FDPs
                  </div>
                </div>
              </button>

              {/* Option 3: Industry */}
              <button
                type="button"
                onClick={() => setSelectedRole('industry')}
                className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  selectedRole === 'industry'
                    ? 'border-black bg-black text-white shadow-md'
                    : 'border-brand-200 bg-white text-black hover:border-brand-400 hover:bg-brand-50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <Briefcase className={`w-5 h-5 ${selectedRole === 'industry' ? 'text-white' : 'text-black'}`} />
                  {selectedRole === 'industry' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm leading-tight">Industry</div>
                  <div className={`text-[11px] mt-1 line-clamp-2 ${selectedRole === 'industry' ? 'text-brand-300' : 'text-brand-500'}`}>
                    Post jobs & hire talent
                  </div>
                </div>
              </button>

            </div>
          </div>

          {/* Role Summary Banner */}
          <div className="p-3 bg-brand-100/70 border border-brand-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg border border-brand-200 text-black">
                <CurrentRoleIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-black">{roleMeta[selectedRole].title}</h4>
                <p className="text-[11px] text-brand-600">{roleMeta[selectedRole].subtitle}</p>
              </div>
            </div>
          </div>

          {/* Google Quick Sign-In Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 bg-white border border-brand-300 rounded-xl hover:bg-brand-50 transition-colors flex items-center justify-center space-x-2 text-xs font-bold text-black shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.43 7.37 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.57 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-brand-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] uppercase font-bold tracking-wider text-brand-400 absolute">
              or with email
            </span>
          </div>

          {/* Login / Sign Up Toggle */}
          <div className="flex border-b border-brand-200">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`pb-2.5 text-sm font-semibold transition-colors relative mr-6 ${
                authMode === 'login' ? 'text-black' : 'text-brand-400 hover:text-black'
              }`}
            >
              Sign In to {roleMeta[selectedRole].title.split(' ')[0]}
              {authMode === 'login' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`pb-2.5 text-sm font-semibold transition-colors relative ${
                authMode === 'register' ? 'text-black' : 'text-brand-400 hover:text-black'
              }`}
            >
              Create Account
              {authMode === 'register' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></span>
              )}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-brand-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-50 border border-brand-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            )}

            {selectedRole === 'student' && authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-brand-700 mb-1">Institution / College Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Institute of Technology"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-50 border border-brand-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            )}

            {selectedRole === 'institute' && authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-brand-700 mb-1">Designation & Department</label>
                <input
                  type="text"
                  placeholder="e.g. Head of Placement / Computer Science"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-50 border border-brand-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            )}

            {selectedRole === 'industry' && authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-brand-700 mb-1">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. TechCorp Solutions Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-50 border border-brand-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-brand-700 mb-1">
                {selectedRole === 'student' ? 'Official / College Email' : selectedRole === 'institute' ? 'Institutional Email' : 'Work Email'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder={roleMeta[selectedRole].emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-brand-50 border border-brand-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
                <Mail className="w-4 h-4 text-brand-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-brand-700">Password</label>
                {authMode === 'login' && (
                  <span className="text-[11px] text-brand-400">Min 6 characters</span>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-brand-50 border border-brand-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
                <Lock className="w-4 h-4 text-brand-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black text-white font-semibold text-sm rounded-xl hover:bg-brand-800 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{authMode === 'login' ? `Sign In with Firebase` : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Preset */}
          <div className="pt-2 border-t border-brand-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                Quick Test-Drive Access
              </span>
              <span className="text-[11px] text-brand-400">Instant evaluation</span>
            </div>
            
            <button
              type="button"
              onClick={() => handleDemoQuickLogin(selectedRole)}
              className="w-full py-2.5 px-4 bg-brand-100 hover:bg-brand-200 text-black text-xs font-semibold rounded-lg border border-brand-300 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2 text-left">
                <UserCheck className="w-4 h-4 text-brand-700" />
                <div>
                  <span className="font-bold">Instant Demo: {roleMeta[selectedRole].demoUser.name}</span>
                  <span className="text-brand-500 text-[11px] block">{roleMeta[selectedRole].demoUser.title}</span>
                </div>
              </div>
              <span className="text-xs font-bold underline">Launch &rarr;</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-brand-50 border-t border-brand-200 text-center">
          <p className="text-[11px] text-brand-500">
            Connected to Firebase Authentication & Cloud Firestore (users/{`{uid}`})
          </p>
        </div>

      </div>
    </div>
  );
};
