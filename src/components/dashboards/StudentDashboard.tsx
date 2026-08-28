import React, { useState, useEffect, useMemo } from 'react';
import type { User } from '../../types';
import { getStudentProfile } from '../../services/profileService';
import { getUserAssessments } from '../../services/assessmentService';
import { calculateCareerReadiness } from '../../utils/careerReadiness';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  FileText, 
  Briefcase, 
  Sparkles, 
  Settings, 
  LogOut, 
  Bell, 
  TrendingUp, 
  FileQuestion, 
  FileCheck, 
  FolderCheck,
  CheckCircle2,
  X
} from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
  onBackToLanding?: () => void;
  onNavigate?: (path: string) => void;
  activePath?: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onLogout,
  onBackToLanding,
  onNavigate,
  activePath = '/student',
}) => {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [activeTestNotification, setActiveTestNotification] = useState<string | null>(null);

  // Firestore Data States
  const [profileSkills, setProfileSkills] = useState<Record<string, number>>({
    JavaScript: 75,
    React: 60,
    HTML: 90,
    CSS: 80,
    Git: 45
  });
  const [careerGoal, setCareerGoal] = useState<string>('Frontend Developer');
  const [assessmentsCount, setAssessmentsCount] = useState<number>(12);
  const [avgScore, setAvgScore] = useState<number>(85);

  useEffect(() => {
    let isMounted = true;
    async function loadFirestoreData() {
      const uid = user?.id || 'usr_student_01';
      try {
        const [profile, assessments] = await Promise.all([
          getStudentProfile(uid),
          getUserAssessments(uid)
        ]);

        if (isMounted) {
          if (profile) {
            if (profile.skills) setProfileSkills(profile.skills);
            if (profile.careerGoal) setCareerGoal(profile.careerGoal);
          }

          if (assessments && assessments.length > 0) {
            setAssessmentsCount(assessments.length);
            const total = assessments.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0);
            setAvgScore(Math.round(total / assessments.length));
          }
        }
      } catch (err) {
        console.error('Error loading Firestore dashboard data:', err);
      }
    }

    loadFirestoreData();
    return () => { isMounted = false; };
  }, [user?.id]);

  // Compute live readiness level
  const readinessResult = useMemo(() => {
    return calculateCareerReadiness(profileSkills, careerGoal);
  }, [profileSkills, careerGoal]);

  const handleApply = (id: string) => {
    if (!appliedJobs.includes(id)) {
      setAppliedJobs(prev => [...prev, id]);
    }
  };

  const startTest = (testTitle: string) => {
    setActiveTestNotification(`Starting test: ${testTitle}. Assessment environment loaded.`);
    setTimeout(() => setActiveTestNotification(null), 4000);
  };

  // Contribution grid simulation (7 days x 14 columns)
  const contributionMatrix = [
    [0, 1, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0],
    [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0],
    [0, 0, 1, 4, 0, 1, 0, 0, 1, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  ];

  const getColorClass = (level: number) => {
    switch (level) {
      case 4: return 'bg-black';
      case 3: return 'bg-brand-700';
      case 2: return 'bg-brand-400';
      case 1: return 'bg-brand-200';
      default: return 'bg-brand-100';
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col md:flex-row antialiased">
      
      {/* Toast notification */}
      {activeTestNotification && (
        <div className="fixed top-5 right-5 z-50 bg-black text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-white" />
          <span>{activeTestNotification}</span>
        </div>
      )}

      {/* LEFT SIDEBAR (Matching reference image) */}
      <aside className="w-full md:w-64 bg-white border-r border-brand-200 flex flex-col justify-between p-6 shrink-0">
        <div>
          {/* Logo & Subtitle */}
          <div className="flex flex-col text-left mb-8 cursor-pointer" onClick={onBackToLanding}>
            <span className="font-extrabold text-2xl tracking-tight text-black leading-none">
              Edunet
            </span>
            <span className="text-[11px] font-medium tracking-wider text-brand-500 uppercase mt-1">
              Professional Suite
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-left text-sm font-medium">
            <button
              onClick={() => {
                setActiveNav('Dashboard');
                onNavigate?.('/student');
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activePath === '/student' || activeNav === 'Dashboard'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-black" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('Profile');
                onNavigate?.('/student/profile');
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activePath === '/student/profile' || activeNav === 'Profile'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <UserIcon className="w-4 h-4 text-brand-700" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('Skill Tests');
                onNavigate?.('/student/assessments');
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activePath === '/student/assessments' || activeNav === 'Skill Tests'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <FileText className="w-4 h-4 text-brand-700" />
              <span>Skill Tests</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('Internships');
                onNavigate?.('/student/internships');
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activePath === '/student/internships' || activeNav === 'Internships'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <Briefcase className="w-4 h-4 text-brand-700" />
              <span>Internships & Jobs</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('AI Career Roadmap');
                onNavigate?.('/student/roadmap');
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activePath === '/student/roadmap' || activeNav === 'AI Career Roadmap'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <Sparkles className="w-4 h-4 text-brand-700" />
              <span>AI Career Roadmap</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('Settings');
                onNavigate?.('/student/settings');
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activePath === '/student/settings' || activeNav === 'Settings'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <Settings className="w-4 h-4 text-brand-700" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="pt-6 border-t border-brand-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-brand-600 hover:text-black hover:bg-brand-50 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4 text-brand-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 bg-[#FAFAFA] min-h-screen overflow-y-auto">
        
        {/* TOP BAR */}
        <div className="bg-white border-b border-brand-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="text-left">
            <h1 className="text-lg font-bold text-black leading-tight">
              Edunet Student Platform
            </h1>
            <p className="text-xs text-brand-500 mt-0.5">
              Live Cloud Firestore Synchronized Workspace
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              className="p-1.5 text-brand-500 hover:text-black rounded-lg hover:bg-brand-100 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="w-1.5 h-1.5 bg-black rounded-full absolute top-1.5 right-1.5"></span>
            </button>

            <div 
              className="flex items-center space-x-2.5 pl-2 border-l border-brand-200 cursor-pointer"
              onClick={() => onNavigate?.('/student/profile')}
            >
              <span className="text-sm font-bold text-black">
                {user.name}
              </span>
              <div className="w-8 h-8 rounded-full bg-brand-200 border border-brand-300 overflow-hidden flex items-center justify-center font-bold text-xs">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.name.split(' ').map(n => n[0]).join('')}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD BODY */}
        <div className="p-8 max-w-6xl mx-auto space-y-6 text-left">
          
          {/* WELCOME / TARGET CAREER HERO BANNER */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h2 className="text-2xl font-extrabold text-black flex items-center gap-2">
                <span>Good day, {user.name.split(' ')[0] || 'Student'}</span>
                <span className="text-2xl">👋</span>
              </h2>
              <p className="text-xs sm:text-sm text-brand-500 mt-1">
                Continue building the verified skills you need for your career.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="text-left sm:text-right border-l-2 sm:border-l-0 sm:border-r-2 border-brand-200 pl-2 sm:pl-0 sm:pr-3">
                <span className="text-[10px] uppercase font-bold text-brand-400 block tracking-wider">
                  Target Career
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-black">
                  {careerGoal}
                </span>
              </div>
              <button
                onClick={() => onNavigate ? onNavigate('/student/roadmap') : setShowRoadmapModal(true)}
                className="px-4 py-2.5 bg-black text-white text-xs font-bold rounded-md hover:bg-brand-800 transition-colors shrink-0 shadow-xs"
              >
                View Career Roadmap
              </button>
            </div>
          </div>

          {/* 4 METRIC TILES (Tests Taken, Avg Score, Applications, Skill Level) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Tile 1: Tests Taken */}
            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-brand-500">
                <span className="text-xs font-semibold text-brand-700">Tests Taken</span>
                <FileQuestion className="w-4 h-4 text-brand-400" />
              </div>
              <div className="text-3xl font-extrabold text-black mt-3">
                {assessmentsCount}
              </div>
            </div>

            {/* Tile 2: Avg Score */}
            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-brand-500">
                <span className="text-xs font-semibold text-brand-700">Avg Score</span>
                <FileCheck className="w-4 h-4 text-brand-400" />
              </div>
              <div className="text-3xl font-extrabold text-black mt-3">
                {avgScore}%
              </div>
            </div>

            {/* Tile 3: Applications */}
            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-brand-500">
                <span className="text-xs font-semibold text-brand-700">Applications</span>
                <FolderCheck className="w-4 h-4 text-brand-400" />
              </div>
              <div className="text-3xl font-extrabold text-black mt-3">
                3
              </div>
            </div>

            {/* Tile 4: Skill Level */}
            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-brand-500">
                <span className="text-xs font-semibold text-brand-700">Skill Level</span>
                <TrendingUp className="w-4 h-4 text-brand-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-black mt-3 tracking-tight">
                {readinessResult.level}
              </div>
            </div>

          </div>

          {/* RECENTLY VIEWED SKILL TESTS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-black">
                Recently Viewed Skill Tests
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Test Card 1 */}
              <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs flex flex-col justify-between hover:border-black transition-colors">
                <div>
                  <h4 className="font-bold text-sm text-black">React Fundamentals</h4>
                  <p className="text-xs text-brand-500 mt-1 leading-relaxed">
                    Test your knowledge of hooks, components, and state.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs text-brand-400 font-medium">45 mins</span>
                  <button
                    onClick={() => onNavigate ? onNavigate('/student/assessments/react-fundamentals') : startTest('React Fundamentals')}
                    className="text-xs font-bold text-black hover:underline"
                  >
                    Start Test
                  </button>
                </div>
              </div>

              {/* Test Card 2 */}
              <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs flex flex-col justify-between hover:border-black transition-colors">
                <div>
                  <h4 className="font-bold text-sm text-black">Advanced CSS</h4>
                  <p className="text-xs text-brand-500 mt-1 leading-relaxed">
                    Flexbox, Grid, and responsive design patterns.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs text-brand-400 font-medium">30 mins</span>
                  <button
                    onClick={() => onNavigate ? onNavigate('/student/assessments/advanced-css') : startTest('Advanced CSS')}
                    className="text-xs font-bold text-black hover:underline"
                  >
                    Start Test
                  </button>
                </div>
              </div>

              {/* Test Card 3 */}
              <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs flex flex-col justify-between hover:border-black transition-colors">
                <div>
                  <h4 className="font-bold text-sm text-black">JavaScript ES6+</h4>
                  <p className="text-xs text-brand-500 mt-1 leading-relaxed">
                    Modern syntax, promises, and async programming.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs text-brand-400 font-medium">60 mins</span>
                  <button
                    onClick={() => onNavigate ? onNavigate('/student/assessments/javascript-es6') : startTest('JavaScript ES6+')}
                    className="text-xs font-bold text-black hover:underline"
                  >
                    Start Test
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* YOUR ACTIVITY SECTION (Circle score + Contribution Grid) */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-black mb-4">
              Your Activity
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Score Gauge & Level Breakdown */}
              <div className="lg:col-span-5 flex items-center space-x-6 border-b lg:border-b-0 lg:border-r border-brand-200 pb-6 lg:pb-0 lg:pr-6">
                
                {/* Circular Gauge */}
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-brand-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-black"
                      strokeDasharray={`${avgScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-extrabold text-black leading-none">{avgScore}</span>
                    <span className="text-[10px] text-brand-500 font-semibold mt-0.5">/ 100</span>
                  </div>
                </div>

                {/* Difficulty Levels */}
                <div className="space-y-2 flex-1 text-xs">
                  <div>
                    <div className="flex justify-between text-brand-600 font-medium mb-0.5">
                      <span>Easy</span>
                      <span className="font-bold text-black">40/50</span>
                    </div>
                    <div className="w-full h-1.5 bg-brand-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-brand-600 font-medium mb-0.5">
                      <span>Medium</span>
                      <span className="font-bold text-black">35/50</span>
                    </div>
                    <div className="w-full h-1.5 bg-brand-200 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-700 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-brand-600 font-medium mb-0.5">
                      <span>Hard</span>
                      <span className="font-bold text-black">10/20</span>
                    </div>
                    <div className="w-full h-1.5 bg-brand-200 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right: Contribution Activity Matrix */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-semibold text-brand-500 text-[11px]">Contribution Activity</span>
                  <div className="flex items-center space-x-1 text-[10px] text-brand-500">
                    <span>Less</span>
                    <span className="w-2.5 h-2.5 bg-brand-100 rounded-xs inline-block"></span>
                    <span className="w-2.5 h-2.5 bg-brand-200 rounded-xs inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-xs inline-block bg-brand-400"></span>
                    <span className="w-2.5 h-2.5 bg-black rounded-xs inline-block"></span>
                    <span>More</span>
                  </div>
                </div>

                <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto pb-1">
                  {contributionMatrix.map((row, rIdx) =>
                    row.map((val, cIdx) => (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`w-3.5 h-3.5 rounded-xs transition-colors hover:ring-1 hover:ring-black cursor-pointer ${getColorClass(val)}`}
                        title={`Day activity score: ${val}`}
                      />
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* TWO COLUMN ROW: MY SKILL PROGRESS + AI CAREER ROADMAP */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: My Skill Progress */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-brand-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-black mb-5">
                My Skill Progress
              </h3>

              <div className="space-y-4 text-xs">
                {Object.entries(profileSkills).slice(0, 3).map(([skillName, level]) => (
                  <div key={skillName}>
                    <div className="flex justify-between font-bold text-black mb-1">
                      <span>{skillName}</span>
                      <span>{level}%</span>
                    </div>
                    <div className="w-full h-2 bg-brand-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${level >= 75 ? 'bg-black' : 'bg-brand-600'}`} 
                        style={{ width: `${level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: AI Career Roadmap (Solid Dark Card matching screenshot) */}
            <div className="lg:col-span-5 bg-black text-white rounded-xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-2">
                  AI Career Roadmap
                </h3>
                <p className="text-xs text-brand-300 leading-relaxed">
                  Based on your recent tests, we've updated your learning path to focus on state management.
                </p>

                {/* Milestone Pills */}
                <div className="space-y-2 mt-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </div>
                    <span className="font-medium text-white">Week 1–2: Advanced CSS Layouts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full border border-white text-white flex items-center justify-center font-bold text-[10px]">
                      2
                    </div>
                    <span className="text-brand-300">Week 3–4: React Hooks & State</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-brand-800">
                <button
                  onClick={() => onNavigate ? onNavigate('/student/roadmap') : setShowRoadmapModal(true)}
                  className="w-full py-2 bg-white text-black font-bold text-xs rounded hover:bg-brand-100 transition-colors text-center"
                >
                  Open Full Roadmap &rarr;
                </button>
              </div>
            </div>

          </div>

          {/* RECOMMENDED INTERNSHIPS (Bottom Section) */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-black">
                  Recommended Internships
                </h3>
                <p className="text-xs text-brand-500">
                  Opportunities matching your assessed skill profile
                </p>
              </div>
              <button 
                onClick={() => onNavigate?.('/student/internships')}
                className="text-xs font-bold text-black hover:underline"
              >
                View all &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Internship 1 */}
              <div className="border border-brand-200 rounded-lg p-4 flex flex-col justify-between hover:border-brand-400 transition-colors">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-black">Frontend Engineer Intern</h4>
                      <p className="text-xs text-brand-600 font-medium mt-0.5">TechCorp Labs • Remote</p>
                    </div>
                    <span className="px-2 py-0.5 bg-brand-100 text-black text-[10px] font-bold rounded">
                      92% Match
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-brand-500">
                    <span>₹25,000/mo</span>
                    <span>•</span>
                    <span>3 Months</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-100 flex items-center justify-between">
                  <span className="text-[11px] text-brand-400 font-medium">React, HTML, CSS</span>
                  <button
                    onClick={() => handleApply('job-1')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                      appliedJobs.includes('job-1')
                        ? 'bg-brand-200 text-black cursor-default'
                        : 'bg-black text-white hover:bg-brand-800'
                    }`}
                  >
                    {appliedJobs.includes('job-1') ? 'Applied ✓' : 'Quick Apply'}
                  </button>
                </div>
              </div>

              {/* Internship 2 */}
              <div className="border border-brand-200 rounded-lg p-4 flex flex-col justify-between hover:border-brand-400 transition-colors">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-black">UI/UX Design & Dev Intern</h4>
                      <p className="text-xs text-brand-600 font-medium mt-0.5">DesignSystems Inc • Hybrid</p>
                    </div>
                    <span className="px-2 py-0.5 bg-brand-100 text-black text-[10px] font-bold rounded">
                      85% Match
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-brand-500">
                    <span>₹20,000/mo</span>
                    <span>•</span>
                    <span>6 Months</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-100 flex items-center justify-between">
                  <span className="text-[11px] text-brand-400 font-medium">Figma, React, CSS</span>
                  <button
                    onClick={() => handleApply('job-2')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                      appliedJobs.includes('job-2')
                        ? 'bg-brand-200 text-black cursor-default'
                        : 'bg-black text-white hover:bg-brand-800'
                    }`}
                  >
                    {appliedJobs.includes('job-2') ? 'Applied ✓' : 'Quick Apply'}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* ROADMAP MODAL DIALOG */}
      {showRoadmapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-300 max-w-xl w-full p-6 text-left shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-brand-200 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-black" />
                <h3 className="font-extrabold text-base text-black">AI Career Roadmap: {careerGoal}</h3>
              </div>
              <button 
                onClick={() => setShowRoadmapModal(false)}
                className="text-brand-400 hover:text-black font-bold p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-brand-600 mb-4 leading-relaxed">
              This personalized roadmap benchmarks your assessed skills against real industry competency frameworks.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-brand-50 border border-brand-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-black">Week 1–2: Advanced CSS & Responsive Architecture</div>
                  <div className="text-[11px] text-brand-500">Container queries, subgrid, and modern responsive layouts</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
              </div>

              <div className="p-3 bg-brand-100/70 border border-black/20 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-black">Week 3–4: React State Management & Performance</div>
                  <div className="text-[11px] text-brand-600">Zustand, React Query, and Profiler diagnostics</div>
                </div>
                <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">In Progress</span>
              </div>

              <div className="p-3 bg-brand-50 border border-brand-200 rounded-lg flex items-center justify-between opacity-75">
                <div>
                  <div className="font-bold text-xs text-black">Week 5–6: End-to-End Testing & CI Pipelines</div>
                  <div className="text-[11px] text-brand-500">Playwright, Vitest, and GitHub Actions automation</div>
                </div>
                <span className="text-[10px] font-medium text-brand-400">Upcoming</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-200 flex justify-end gap-2">
              <button
                onClick={() => setShowRoadmapModal(false)}
                className="px-4 py-2 border border-brand-300 rounded-lg text-xs font-bold text-brand-700 hover:bg-brand-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowRoadmapModal(false);
                  onNavigate?.('/student/roadmap');
                }}
                className="px-5 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-brand-800"
              >
                Open Full Roadmap Hub
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
