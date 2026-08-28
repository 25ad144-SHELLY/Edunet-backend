import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  FileText, 
  Briefcase, 
  Sparkles, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  FileCheck, 
  FileQuestion, 
  Award, 
  Layers, 
  BarChart2, 
  RotateCcw,
  X,
  Target,
  BrainCircuit,
  Check,
  Loader2
} from 'lucide-react';
import { SKILL_TESTS_DATA, submitAssessmentResult, getUserAssessments } from '../services/assessmentService';

export const SkillTests = ({
  user,
  onNavigate,
  onLogout,
  onBackToLanding,
  initialTestId = null,
}) => {
  const activeNav = 'Skill Tests';

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All'); // 'All' | 'Technical' | 'Soft Skills'
  const [selectedDifficulty, setSelectedDifficulty] = useState('All'); // 'All' | 'Beginner' | 'Intermediate' | 'Advanced'

  // Tests list state
  const [tests, setTests] = useState(SKILL_TESTS_DATA);
  const [userAssessments, setUserAssessments] = useState([]);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(true);

  // Active modal / subview state
  const [activeAssessment, setActiveAssessment] = useState(() => {
    if (initialTestId) {
      const found = SKILL_TESTS_DATA.find(t => t.id === initialTestId);
      if (found) return { test: found, step: 'detail', currentQuestion: 0, answers: {}, score: 0 };
    }
    return null;
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Fetch user completed assessments from Firestore
  useEffect(() => {
    let isMounted = true;
    async function loadAssessments() {
      const uid = user?.id || 'usr_student_01';
      try {
        const assessments = await getUserAssessments(uid);
        if (isMounted) {
          setUserAssessments(assessments);
          if (assessments.length > 0) {
            // Merge completed assessments into test modules
            setTests(prev => prev.map(t => {
              const match = assessments.find(a => a.testId === t.id);
              if (match) {
                return {
                  ...t,
                  progress: 100,
                  previousScore: match.score
                };
              }
              return t;
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching Firestore assessments:', err);
      } finally {
        if (isMounted) setIsLoadingAssessments(false);
      }
    }

    loadAssessments();
    return () => { isMounted = false; };
  }, [user?.id]);

  // Compute live statistics from assessments
  const stats = useMemo(() => {
    const completedCount = userAssessments.length > 0 ? userAssessments.length : 12;
    const avgScore = userAssessments.length > 0
      ? Math.round(userAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / userAssessments.length)
      : 85;
    
    // Unique skills evaluated
    const uniqueSkills = new Set();
    userAssessments.forEach(a => {
      if (Array.isArray(a.skillsEvaluated)) {
        a.skillsEvaluated.forEach(s => uniqueSkills.add(s));
      }
    });
    const skillsCount = uniqueSkills.size > 0 ? uniqueSkills.size : 8;
    const remainingCount = Math.max(0, tests.length - (userAssessments.length || 5));

    return {
      completedCount,
      avgScore,
      skillsCount,
      remainingCount
    };
  }, [userAssessments, tests]);

  // Filtered Tests
  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            test.skillsEvaluated.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || test.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesDifficulty = selectedDifficulty === 'All' || test.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [tests, searchQuery, selectedCategory, selectedDifficulty]);

  // Test Taking Handlers
  const handleOpenDetail = (test) => {
    setActiveAssessment({
      test,
      step: 'detail',
      currentQuestion: 0,
      answers: {},
      score: 0,
    });
  };

  const handleStartTest = () => {
    if (!activeAssessment?.test) return;
    setActiveAssessment(prev => ({
      ...prev,
      step: 'taking',
      currentQuestion: 0,
      answers: {},
      score: 0,
    }));
  };

  const handleSelectAnswer = (questionId, optionIndex) => {
    setActiveAssessment(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: optionIndex
      }
    }));
  };

  const handleSubmitTest = async () => {
    if (!activeAssessment) return;
    const { test, answers } = activeAssessment;
    const questions = test.sampleQuestions || [];
    
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    // Score computation (e.g. 85 / 100)
    const computedScore = questions.length > 0
      ? Math.round((correctCount / questions.length) * 30 + 70) // Normalize to positive score range 70-100
      : 85;

    // Structured submit to assessment service (Persists to Firestore)
    const uid = user?.id || 'usr_student_01';
    const resultDoc = await submitAssessmentResult(
      uid, 
      test.id, 
      answers, 
      computedScore, 
      test.title, 
      test.skillsEvaluated
    );

    // Update local test list & assessments
    setTests(prev => prev.map(t => {
      if (t.id === test.id) {
        return {
          ...t,
          progress: 100,
          previousScore: computedScore
        };
      }
      return t;
    }));

    setUserAssessments(prev => [resultDoc, ...prev]);

    setActiveAssessment(prev => ({
      ...prev,
      step: 'result',
      score: computedScore,
    }));

    showToast('Assessment saved to Firestore & skill profile updated!');
  };

  const handleCloseModal = () => {
    setActiveAssessment(null);
  };

  return (
    <div className="min-h-screen bg-white text-black flex antialiased w-full max-w-[1440px] mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-black text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR (Identical to Student Dashboard) */}
      <aside className="w-64 bg-white border-r border-brand-200 flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
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
              onClick={() => onNavigate ? onNavigate('/student') : null}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Dashboard'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-brand-700" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('/student/profile') : null}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Profile'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <UserIcon className="w-4 h-4 text-brand-700" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('/student/assessments') : null}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Skill Tests'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <FileText className="w-4 h-4 text-black" />
              <span>Skill Tests</span>
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('/student/internships') : null}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Internships & Jobs'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <Briefcase className="w-4 h-4 text-brand-700" />
              <span>Internships & Jobs</span>
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('/student/roadmap') : null}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'AI Career Roadmap'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <Sparkles className="w-4 h-4 text-brand-700" />
              <span>AI Career Roadmap</span>
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('/student/settings') : null}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Settings'
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

      {/* MAIN CONTENT AREA (Desktop layout ~1280px wide) */}
      <main className="flex-1 bg-[#FAFAFA] min-h-screen overflow-y-auto">
        
        {/* TOP BAR */}
        <div className="bg-white border-b border-brand-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-black leading-tight">
              Skill Tests
            </h1>
            <p className="text-xs text-brand-500 mt-0.5">
              Assess your skills, identify your strengths and discover areas for improvement.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Skill Level Badge on right */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-200 rounded-lg text-xs font-semibold text-brand-700">
              <TrendingUp className="w-3.5 h-3.5 text-black" />
              <span>Your Skill Level: <strong className="text-black">Intermediate</strong></span>
            </div>

            <button
              onClick={() => onNavigate ? onNavigate('/student') : null}
              className="text-xs font-semibold px-3 py-1.5 border border-brand-300 rounded-lg hover:bg-brand-50 text-black transition-colors"
            >
              &larr; Dashboard
            </button>

            <button 
              className="p-1.5 text-brand-500 hover:text-black rounded-lg hover:bg-brand-100 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="w-1.5 h-1.5 bg-black rounded-full absolute top-1.5 right-1.5"></span>
            </button>

            <div 
              className="flex items-center space-x-2.5 pl-2 border-l border-brand-200 cursor-pointer"
              onClick={() => onNavigate ? onNavigate('/student/profile') : null}
            >
              <span className="text-sm font-bold text-black">
                {user?.name || 'Alex Chen'}
              </span>
              <div className="w-8 h-8 rounded-full bg-brand-200 border border-brand-300 overflow-hidden flex items-center justify-center font-bold text-xs">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>AC</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="p-8 max-w-6xl mx-auto space-y-6 text-left">

          {/* 1. FOUR STATISTIC CARDS (Horizontal Row) */}
          <div className="grid grid-cols-4 gap-4">
            
            {/* Card 1: Tests Completed */}
            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-brand-500">
                <span className="text-xs font-semibold text-brand-700">Tests Completed</span>
                <FileCheck className="w-4 h-4 text-brand-400" />
              </div>
              <div className="text-3xl font-extrabold text-black mt-3">
                {stats.completedCount}
              </div>
            </div>

            {/* Card 2: Average Score */}
            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-brand-500">
                <span className="text-xs font-semibold text-brand-700">Average Score</span>
                <Award className="w-4 h-4 text-brand-400" />
              </div>
              <div className="text-3xl font-extrabold text-black mt-3">
                {stats.avgScore}%
              </div>
            </div>

            {/* Card 3: Skills Assessed */}
            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-brand-500">
                <span className="text-xs font-semibold text-brand-700">Skills Assessed</span>
                <Layers className="w-4 h-4 text-brand-400" />
              </div>
              <div className="text-3xl font-extrabold text-black mt-3">
                {stats.skillsCount}
              </div>
            </div>

            {/* Card 4: Tests Remaining */}
            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-brand-500">
                <span className="text-xs font-semibold text-brand-700">Tests Remaining</span>
                <FileQuestion className="w-4 h-4 text-brand-400" />
              </div>
              <div className="text-3xl font-extrabold text-black mt-3">
                {stats.remainingCount}
              </div>
            </div>

          </div>

          {/* 2. SEARCH AND FILTER BAR */}
          <div className="bg-white rounded-xl border border-brand-200 p-4 shadow-xs flex items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brand-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search tests by title, skill, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-brand-50/70 border border-brand-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-black placeholder:text-brand-400"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-brand-500">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-brand-300 text-xs font-medium rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="All">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Soft Skills">Soft Skills</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-brand-500">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-white border border-brand-300 text-xs font-medium rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="All">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

          </div>

          {/* 3. TEST MODULES GRID (3 columns) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-black">
                Available Assessments ({filteredTests.length})
              </h2>
              <span className="text-xs text-brand-500 font-medium">
                Verified Skill Standard aligned with Industry Matrix
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredTests.map((test) => {
                const isStarted = test.progress > 0 && test.progress < 100;
                const isCompleted = test.progress === 100;

                return (
                  <div
                    key={test.id}
                    className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs flex flex-col justify-between hover:border-brand-400 transition-colors"
                  >
                    <div>
                      {/* Top badge row */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold text-brand-500 bg-brand-100 px-2 py-0.5 rounded">
                          {test.category}
                        </span>
                        <span className={`text-[11px] font-semibold ${
                          test.difficulty === 'Beginner' ? 'text-brand-600' :
                          test.difficulty === 'Intermediate' ? 'text-brand-800 font-bold' :
                          'text-black font-extrabold'
                        }`}>
                          {test.difficulty}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-extrabold text-sm text-black leading-snug">
                        {test.title}
                      </h3>
                      <p className="text-xs text-brand-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {test.description}
                      </p>

                      {/* Skills Covered Pills */}
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {test.skillsEvaluated.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-brand-50 border border-brand-200 text-[10px] font-medium text-brand-700 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                        {test.skillsEvaluated.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-brand-50 text-[10px] text-brand-400 rounded-md">
                            +{test.skillsEvaluated.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Row (Meta + CTA) */}
                    <div className="mt-5 pt-4 border-t border-brand-200 space-y-3">
                      {/* Duration and Questions Count */}
                      <div className="flex items-center justify-between text-xs text-brand-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-brand-400" />
                          {test.duration}
                        </span>
                        <span>{test.questionsCount} Questions</span>
                      </div>

                      {/* Progress Bar (if in progress or completed) */}
                      {test.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold text-brand-600">
                            <span>{isCompleted ? 'Completed' : 'In Progress'}</span>
                            <span>{test.previousScore ? `Score: ${test.previousScore}%` : `${test.progress}%`}</span>
                          </div>
                          <div className="w-full bg-brand-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-black h-1.5 rounded-full"
                              style={{ width: `${test.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Button Action */}
                      <button
                        onClick={() => handleOpenDetail(test)}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-2xs ${
                          isCompleted
                            ? 'bg-brand-100 hover:bg-brand-200 text-black border border-brand-300'
                            : isStarted
                            ? 'bg-black text-white hover:bg-brand-800'
                            : 'bg-black text-white hover:bg-brand-800'
                        }`}
                      >
                        <span>
                          {isCompleted ? 'Retake Test' : isStarted ? 'Continue Test' : 'Start Test'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </main>

      {/* ASSESSMENT MODAL DIALOG (Detail -> Taking -> Result) */}
      {activeAssessment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-300 max-w-xl w-full p-6 text-left shadow-2xl animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brand-200 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <BrainCircuit className="w-5 h-5 text-black" />
                <h3 className="font-extrabold text-base text-black">
                  {activeAssessment.test.title}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-xs text-brand-400 hover:text-black font-bold p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: DETAIL VIEW */}
            {activeAssessment.step === 'detail' && (
              <div className="space-y-4">
                <p className="text-xs text-brand-600 leading-relaxed">
                  {activeAssessment.test.description}
                </p>

                <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-brand-500">Category:</span>
                    <span className="font-bold text-black">{activeAssessment.test.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-brand-500">Difficulty:</span>
                    <span className="font-bold text-black">{activeAssessment.test.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-brand-500">Duration:</span>
                    <span className="font-bold text-black">{activeAssessment.test.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-brand-500">Questions:</span>
                    <span className="font-bold text-black">{activeAssessment.test.questionsCount} (Sample set: 3)</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-500 mb-2">
                    Competencies Measured:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeAssessment.test.skillsEvaluated.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white border border-brand-300 text-xs font-medium text-black rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-200 flex justify-end gap-2">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-brand-300 rounded-lg text-xs font-bold text-brand-700 hover:bg-brand-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartTest}
                    className="px-5 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-brand-800 flex items-center space-x-1.5"
                  >
                    <span>Begin Assessment Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: TEST TAKING VIEW */}
            {activeAssessment.step === 'taking' && (
              <div className="space-y-5">
                {(() => {
                  const questions = activeAssessment.test.sampleQuestions || [];
                  const currentQ = questions[activeAssessment.currentQuestion] || questions[0];
                  const qIndex = activeAssessment.currentQuestion;
                  const totalQ = questions.length;
                  const isLastQ = qIndex === totalQ - 1;
                  const hasAnsweredCurrent = activeAssessment.answers[currentQ?.id] !== undefined;

                  if (!currentQ) {
                    return <div>No questions available for this module.</div>;
                  }

                  return (
                    <>
                      {/* Question progress header */}
                      <div className="flex items-center justify-between text-xs font-bold text-brand-500">
                        <span>Question {qIndex + 1} of {totalQ}</span>
                        <span className="px-2 py-0.5 bg-brand-100 text-black rounded">
                          Skill: {currentQ.skill}
                        </span>
                      </div>

                      {/* Question prompt */}
                      <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl">
                        <h4 className="text-sm font-bold text-black leading-snug">
                          {currentQ.question}
                        </h4>
                      </div>

                      {/* Option choices */}
                      <div className="space-y-2">
                        {currentQ.options.map((opt, optIdx) => {
                          const isSelected = activeAssessment.answers[currentQ.id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectAnswer(currentQ.id, optIdx)}
                              className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-start space-x-3 ${
                                isSelected
                                  ? 'border-black bg-black text-white shadow-xs'
                                  : 'border-brand-200 bg-white hover:border-brand-400 text-black hover:bg-brand-50'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                isSelected ? 'bg-white text-black' : 'bg-brand-100 text-brand-700'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1 leading-relaxed">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Footer navigation */}
                      <div className="pt-4 border-t border-brand-200 flex items-center justify-between">
                        <button
                          disabled={qIndex === 0}
                          onClick={() => setActiveAssessment(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }))}
                          className="px-3 py-1.5 border border-brand-300 rounded-lg text-xs font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-40"
                        >
                          Previous
                        </button>

                        <div className="flex gap-2">
                          {!isLastQ ? (
                            <button
                              disabled={!hasAnsweredCurrent}
                              onClick={() => setActiveAssessment(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }))}
                              className="px-5 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-brand-800 disabled:opacity-40 flex items-center space-x-1"
                            >
                              <span>Next Question</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              disabled={!hasAnsweredCurrent}
                              onClick={handleSubmitTest}
                              className="px-6 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-brand-800 disabled:opacity-40 flex items-center space-x-1.5"
                            >
                              <span>Submit & Score</span>
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* STEP 3: RESULT VIEW */}
            {activeAssessment.step === 'result' && (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 bg-brand-100 border border-brand-300 rounded-full flex items-center justify-center mx-auto text-black">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-lg font-extrabold text-black">Assessment Completed!</h4>
                  <p className="text-xs text-brand-500 mt-0.5">
                    Your score has been stored in your verified Firestore profile.
                  </p>
                </div>

                <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl max-w-xs mx-auto space-y-1">
                  <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider block">
                    Calculated Score
                  </span>
                  <span className="text-3xl font-black text-black">
                    {activeAssessment.score}%
                  </span>
                </div>

                <p className="text-xs text-brand-600 px-4 leading-relaxed">
                  Your skill profile in Firestore has been updated. This score is immediately reflected in the AI Career Gap analysis.
                </p>

                <div className="pt-4 border-t border-brand-200 flex justify-center gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-5 py-2 border border-brand-300 rounded-lg text-xs font-bold text-black hover:bg-brand-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleCloseModal();
                      onNavigate?.('/student/roadmap');
                    }}
                    className="px-5 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-brand-800 flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View in AI Roadmap</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default SkillTests;
