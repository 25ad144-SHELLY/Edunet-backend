import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  FileText, 
  Briefcase, 
  Sparkles, 
  Settings, 
  LogOut, 
  Bell, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  TrendingUp, 
  Layers, 
  RotateCcw, 
  Check, 
  Search,
  BookOpen,
  Code2,
  FolderGit2,
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { generateAndSaveRoadmap, getUserRoadmap } from '../services/aiRoadmapService';
import { updateStudentCareerGoal } from '../services/profileService';

export const AIRoadmap = ({
  user,
  onNavigate,
  onLogout,
  onBackToLanding,
}) => {
  const activeNav = 'AI Career Roadmap';

  // Career input state
  const [careerInput, setCareerInput] = useState('');
  const [activeCareer, setActiveCareer] = useState('Frontend Developer');

  // Roadmap data & loading states
  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const exampleCareers = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'AI/ML Engineer',
    'Cybersecurity Analyst',
    'Data Analyst',
    'Cloud Engineer',
    'UI/UX Designer',
  ];

  // Helper to extract clean career title from freeform text
  const extractCareerTitle = (text) => {
    if (!text) return 'Frontend Developer';
    const cleaned = text.trim();
    
    // Exact or case-insensitive match against example list
    const found = exampleCareers.find(c => cleaned.toLowerCase() === c.toLowerCase() || cleaned.toLowerCase().includes(c.toLowerCase()));
    if (found) return found;

    // Pattern matching e.g. "I want to become a Product Engineer"
    const match = cleaned.match(/(?:become|career as|career in|role as|be a|as a|for)\s+(?:a\s+|an\s+)?([A-Za-z\s/]+)/i);
    if (match && match[1]) {
      return match[1].trim();
    }
    return cleaned;
  };

  // 1. Initial Load: Check Firestore users/{uid}/roadmap/current first
  useEffect(() => {
    let isMounted = true;
    async function loadInitialRoadmap() {
      const uid = user?.id || 'usr_student_01';
      try {
        const stored = await getUserRoadmap(uid);
        if (isMounted) {
          if (stored) {
            setRoadmapData(stored);
            setActiveCareer(stored.targetCareer || 'Frontend Developer');
            setCareerInput(stored.targetCareer || 'Frontend Developer');
          } else {
            // Generate baseline roadmap for student
            const generated = await generateAndSaveRoadmap(uid, 'Frontend Developer');
            if (isMounted) {
              setRoadmapData(generated);
              setActiveCareer(generated.targetCareer);
              setCareerInput(generated.targetCareer);
            }
          }
        }
      } catch (err) {
        console.error('Error loading initial roadmap:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialRoadmap();
    return () => { isMounted = false; };
  }, [user?.id]);

  // 2. Main Analyze & Generation Flow
  const handleAnalyzeCareer = async (targetTitle) => {
    const rawTarget = targetTitle || careerInput || activeCareer || 'Frontend Developer';
    const finalCareer = extractCareerTitle(rawTarget);
    
    setActiveCareer(finalCareer);
    setCareerInput(finalCareer);
    setIsGenerating(true);

    const steps = [
      'Analyzing your career path...',
      'Comparing your skills...',
      'Finding your skill gaps...',
      'Building your personalized roadmap...',
      'Your roadmap is ready.'
    ];

    for (let i = 0; i < steps.length - 1; i++) {
      setGenerationStep(steps[i]);
      await new Promise(r => setTimeout(r, 400));
    }

    const uid = user?.id || 'usr_student_01';
    try {
      // 1. Generate and save to Firestore: users/{uid}/roadmap/current
      const result = await generateAndSaveRoadmap(uid, finalCareer);
      
      // 2. Sync careerGoal with users/{uid} profile
      try {
        await updateStudentCareerGoal(uid, finalCareer);
      } catch (e) {
        // non-blocking
      }

      setRoadmapData(result);
      setGenerationStep(steps[steps.length - 1]);
      await new Promise(r => setTimeout(r, 250));
      showToast(`Personalized roadmap generated for ${finalCareer}`);
    } catch (err) {
      console.error('Failed to generate roadmap:', err);
      showToast("We couldn't generate your roadmap right now. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const query = careerInput.trim() || activeCareer || 'Frontend Developer';
    handleAnalyzeCareer(query);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Aug 28, 2026';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return 'Aug 28, 2026';
    }
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
              <FileText className="w-4 h-4 text-brand-700" />
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
              <Sparkles className="w-4 h-4 text-black" />
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

      {/* MAIN CONTENT AREA (~1280px Desktop) */}
      <main className="flex-1 bg-[#FAFAFA] min-h-screen overflow-y-auto">
        
        {/* TOP BAR */}
        <div className="bg-white border-b border-brand-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-black leading-tight">
              AI Career Roadmap
            </h1>
            <p className="text-xs text-brand-500 mt-0.5">
              Tell Edunet where you want your career to go. We'll analyze your current skills and create a personalized path.
            </p>
          </div>

          <div className="flex items-center space-x-4">
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

        {/* BODY CONTAINER */}
        <div className="p-8 max-w-6xl mx-auto space-y-6 text-left">

          {/* 1. CAREER INPUT / CHAT-STYLE HERO BOX */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-black flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Target Career Goal Analysis</span>
                </h2>
                <p className="text-xs text-brand-500 mt-0.5">
                  Enter any career in natural language or select from popular industry tracks.
                </p>
              </div>

              {roadmapData && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-brand-500 font-medium">
                    Last analyzed: <strong>{formatDate(roadmapData.lastUpdated)}</strong>
                  </span>
                  <button
                    disabled={isGenerating}
                    onClick={() => handleAnalyzeCareer(activeCareer)}
                    className="px-3 py-1.5 bg-brand-100 hover:bg-brand-200 text-black border border-brand-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Regenerate Roadmap</span>
                  </button>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleFormSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={careerInput}
                  onChange={(e) => setCareerInput(e.target.value)}
                  placeholder='e.g. "I want to become a Frontend Developer" or "I want a career in cybersecurity"'
                  disabled={isGenerating}
                  className="w-full px-4 py-3 bg-brand-50/70 border border-brand-300 rounded-xl text-xs font-medium text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-brand-400"
                />
              </div>
              <button
                type="submit"
                disabled={isGenerating}
                onClick={handleFormSubmit}
                className="px-6 py-3 bg-black text-white text-xs font-bold rounded-xl hover:bg-brand-800 transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50 shadow-xs cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze My Career</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Example Chips */}
            <div className="flex items-center flex-wrap gap-2 pt-1">
              <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider">
                Popular Tracks:
              </span>
              {exampleCareers.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCareerInput(c);
                    setActiveCareer(c);
                    handleAnalyzeCareer(c);
                  }}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                    activeCareer.toLowerCase() === c.toLowerCase()
                      ? 'bg-black text-white border-black font-bold'
                      : 'bg-white text-brand-700 border-brand-200 hover:border-brand-400 hover:bg-brand-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 2. LOADING STATE WITH ANIMATED STAGES */}
          {isGenerating && (
            <div className="bg-white rounded-xl border border-brand-200 p-8 shadow-xs text-center space-y-3 animate-fadeIn">
              <Loader2 className="w-8 h-8 animate-spin text-black mx-auto" />
              <h3 className="text-sm font-extrabold text-black">{generationStep}</h3>
              <p className="text-xs text-brand-500">
                Evaluating assessed proficiency across verified test benchmarks...
              </p>
            </div>
          )}

          {/* 3. MAIN ROADMAP RESULTS (When not generating) */}
          {!isGenerating && roadmapData && (
            <>
              {/* ROW 1: CAREER READINESS & AI CAREER INSIGHT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1.1 Large Career Readiness Card (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-brand-200 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
                        Career Readiness Score
                      </span>
                      <span className="px-2.5 py-0.5 bg-brand-100 text-black text-xs font-extrabold rounded-md">
                        {roadmapData.level} Tier
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-black text-black">
                        {roadmapData.readinessScore}%
                      </span>
                      <span className="text-xs font-semibold text-brand-600">
                        match for {roadmapData.targetCareer}
                      </span>
                    </div>

                    <p className="text-xs text-brand-500 mt-1">
                      You're on your way to becoming a {roadmapData.targetCareer}.
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-brand-100 rounded-full h-2.5 overflow-hidden mt-4">
                      <div
                        className="bg-black h-2.5 rounded-full transition-all duration-700"
                        style={{ width: `${roadmapData.readinessScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Highlights Sub-section */}
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-brand-200 text-xs">
                    <div>
                      <span className="font-bold text-black block mb-1">Strongest Areas:</span>
                      <div className="flex flex-wrap gap-1">
                        {roadmapData.strengths.length > 0 ? (
                          roadmapData.strengths.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-brand-100 text-black font-semibold rounded text-[11px]">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-brand-500">Completing more skill tests will reveal top strengths.</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-black block mb-1">Needs Improvement:</span>
                      <div className="flex flex-wrap gap-1">
                        {roadmapData.highPriorityGaps.slice(0, 3).map((g, i) => (
                          <span key={i} className="px-2 py-0.5 bg-brand-50 border border-brand-300 text-black font-semibold rounded text-[11px]">
                            {g.skill} (-{g.gap}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1.2 AI Career Insight Card (5 cols) */}
                <div className="lg:col-span-5 bg-black text-white rounded-xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-white" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        AI Career Insight
                      </h3>
                    </div>
                    <p className="text-xs text-brand-200 leading-relaxed font-normal">
                      {roadmapData.aiInsight}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-800 flex items-center justify-between text-xs text-brand-300">
                    <span>Target: {roadmapData.targetCareer}</span>
                    <button
                      onClick={() => onNavigate ? onNavigate('/student/assessments') : null}
                      className="text-white font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Take Skill Test</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* ROW 2: SKILL GAP DESKTOP TABLE */}
              <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-200">
                  <div>
                    <h3 className="text-base font-extrabold text-black">Your Skill Gap Breakdown</h3>
                    <p className="text-xs text-brand-500">
                      Comparing verified student proficiency against {roadmapData.targetCareer} industry benchmarks.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-black bg-brand-100 px-3 py-1 rounded-lg">
                    {roadmapData.skillGaps.length} Skills Analyzed
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-brand-200 text-brand-500 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-3">Skill Competency</th>
                        <th className="py-3 px-3">Current Level</th>
                        <th className="py-3 px-3">Required Target</th>
                        <th className="py-3 px-3">Skill Gap</th>
                        <th className="py-3 px-3">Priority</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-100 font-medium">
                      {roadmapData.skillGaps.map((item, idx) => (
                        <tr key={idx} className="hover:bg-brand-50/60 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-black flex items-center gap-2">
                            <span>{item.skill}</span>
                            {item.currentLevel >= item.requiredLevel && (
                              <span className="text-[10px] bg-brand-100 text-black px-1.5 py-0.2 rounded font-bold">
                                Met ✓
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-brand-700">
                            {item.currentLevel}%
                          </td>
                          <td className="py-3.5 px-3 text-black font-bold">
                            {item.requiredLevel}%
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${item.gap >= 30 ? 'text-black font-extrabold' : item.gap >= 15 ? 'text-brand-800' : 'text-brand-500'}`}>
                                {item.gap > 0 ? `${item.gap}%` : '0%'}
                              </span>
                              <div className="w-16 bg-brand-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-1.5 rounded-full ${item.gap >= 30 ? 'bg-black' : item.gap >= 15 ? 'bg-brand-700' : 'bg-brand-400'}`}
                                  style={{ width: `${Math.min(item.gap, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.priority === 'High' ? 'bg-black text-white' :
                              item.priority === 'Medium' ? 'bg-brand-200 text-black' :
                              'bg-brand-100 text-brand-600'
                            }`}>
                              {item.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => onNavigate ? onNavigate('/student/assessments') : null}
                              className="text-xs font-bold text-black hover:underline cursor-pointer"
                            >
                              Test Skill &rarr;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ROW 3: PERSONALIZED 8-WEEK ROADMAP TIMELINE */}
              <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-brand-200">
                  <div>
                    <h3 className="text-base font-extrabold text-black">Your Personalized Learning Roadmap</h3>
                    <p className="text-xs text-brand-500">
                      Tailored 8-week path structured to systematically eliminate your priority skill gaps.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-brand-600 bg-brand-100 px-3 py-1 rounded-lg">
                    8 Weeks Duration
                  </span>
                </div>

                <div className="space-y-4">
                  {roadmapData.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-brand-50/60 border border-brand-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-300 transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-black text-white text-[11px] font-bold rounded">
                            {m.week}
                          </span>
                          <h4 className="font-extrabold text-sm text-black">{m.title}</h4>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            m.status === 'Completed' ? 'bg-brand-200 text-black' :
                            m.status === 'In Progress' ? 'bg-brand-100 text-black border border-brand-300' :
                            'text-brand-500'
                          }`}>
                            {m.status}
                          </span>
                        </div>

                        {/* Topics */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          <span className="text-[11px] font-bold text-brand-500">Key Topics:</span>
                          {m.topics.map((t, i) => (
                            <span key={i} className="text-[11px] bg-white border border-brand-200 px-2 py-0.5 rounded text-brand-700">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Practice Task */}
                        <p className="text-xs text-brand-600 pt-1">
                          <strong className="text-black">Practice Task:</strong> {m.practiceTask}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center md:flex-col md:items-end justify-between gap-2 border-t md:border-t-0 md:border-l border-brand-200 pt-3 md:pt-0 md:pl-4">
                        <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">
                          Focus: {m.focusSkill}
                        </span>
                        <button
                          onClick={() => onNavigate ? onNavigate('/student/assessments') : null}
                          className="px-3 py-1.5 bg-white border border-brand-300 hover:bg-brand-100 rounded-lg text-xs font-bold text-black transition-colors cursor-pointer"
                        >
                          Assessment &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROW 4: RECOMMENDED PROJECTS TARGETING GAPS */}
              <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-brand-200">
                  <div>
                    <h3 className="text-base font-extrabold text-black">Recommended Capstone Projects</h3>
                    <p className="text-xs text-brand-500">
                      Portfolio-grade projects specifically formulated to bridge your identified skill gaps.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-black bg-brand-100 px-3 py-1 rounded-lg">
                    Gap-Targeted
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {roadmapData.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-5 border border-brand-200 rounded-xl bg-white hover:border-black transition-colors flex flex-col justify-between shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-black px-2 py-0.5 rounded">
                            {proj.difficulty}
                          </span>
                          <FolderGit2 className="w-4 h-4 text-brand-400" />
                        </div>

                        <h4 className="font-extrabold text-sm text-black leading-snug">
                          {proj.title}
                        </h4>

                        <p className="text-xs text-brand-600 mt-2 leading-relaxed">
                          {proj.reason}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-1">
                          {proj.skills.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-brand-50 border border-brand-200 text-[10px] font-medium text-brand-700 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-brand-200">
                        <button 
                          onClick={() => showToast(`Project specification for "${proj.title}" saved to your student workspace.`)}
                          className="w-full py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-brand-800 transition-colors cursor-pointer"
                        >
                          Start Project Guide
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

      </main>

    </div>
  );
};

export default AIRoadmap;
