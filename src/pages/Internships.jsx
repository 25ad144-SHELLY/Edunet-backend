import React, { useState, useMemo } from 'react';
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
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Building2, 
  Target, 
  ChevronRight, 
  X, 
  Layers, 
  Check,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  INTERNSHIPS_DATA, 
  INITIAL_APPLICATIONS, 
  calculateSkillMatch, 
  submitInternshipApplication,
  STUDENT_SKILL_PROFILE 
} from '../services/internshipService';

export const Internships = ({
  user,
  onNavigate,
  onLogout,
  onBackToLanding,
  initialInternshipId = null,
}) => {
  const activeNav = 'Internships & Jobs';

  // State
  const [internships] = useState(INTERNSHIPS_DATA);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedWorkType, setSelectedWorkType] = useState('All'); // 'All' | 'Remote' | 'On-site' | 'Hybrid'
  const [selectedLocation, setSelectedLocation] = useState('All');

  // Detail Modal / Subview State
  const [selectedOpportunity, setSelectedOpportunity] = useState(() => {
    if (initialInternshipId) {
      return INTERNSHIPS_DATA.find(i => i.id === initialInternshipId) || null;
    }
    return null;
  });

  // Application feedback toast & state
  const [toastMessage, setToastMessage] = useState(null);
  const [justAppliedId, setJustAppliedId] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Roles list for filter
  const roleFilters = ['All', 'Frontend', 'Backend', 'Full Stack', 'Software Engineering', 'Web Development'];
  const workTypeFilters = ['All', 'Remote', 'On-site', 'Hybrid'];
  const locationFilters = ['All', 'Remote', 'Austin, TX', 'San Francisco, CA', 'New York, NY'];

  // Filter logic
  const filteredOpportunities = useMemo(() => {
    return internships.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = 
        selectedRole === 'All' || 
        item.title.toLowerCase().includes(selectedRole.toLowerCase());

      const matchesWorkType = 
        selectedWorkType === 'All' || 
        item.type.toLowerCase() === selectedWorkType.toLowerCase();

      const matchesLocation = 
        selectedLocation === 'All' || 
        item.location.toLowerCase() === selectedLocation.toLowerCase();

      return matchesSearch && matchesRole && matchesWorkType && matchesLocation;
    });
  }, [internships, searchQuery, selectedRole, selectedWorkType, selectedLocation]);

  // Check if student has applied to an internship
  const isApplied = (opportunityId) => {
    return applications.some(app => app.opportunityId === opportunityId || app.id === opportunityId);
  };

  // Apply Handler
  const handleApply = async (opportunity) => {
    if (isApplied(opportunity.id)) return;

    try {
      const newApp = await submitInternshipApplication(
        user?.id || 'usr_student_01', 
        opportunity.id, 
        opportunity
      );
      setApplications(prev => [newApp, ...prev]);
      setJustAppliedId(opportunity.id);
      showToast(`Application submitted for ${opportunity.title}!`);
      setTimeout(() => setJustAppliedId(null), 4000);
    } catch (err) {
      showToast('Error submitting application.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex antialiased w-full max-w-[1440px] mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-black text-white px-5 py-3 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-brand-800 animate-fadeIn">
          <Check className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR (Matching Student Dashboard design system) */}
      <aside className="w-64 bg-white border-r border-brand-200 flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
        <div>
          {/* Logo & Subtitle */}
          <div 
            className="flex flex-col text-left mb-8 cursor-pointer" 
            onClick={() => onBackToLanding ? onBackToLanding() : onNavigate?.('/landing')}
          >
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
              <Briefcase className="w-4 h-4 text-black" />
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
              Internships & Jobs
            </h1>
            <p className="text-xs text-brand-500 mt-0.5">
              Discover opportunities matched to your skills and career goals.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Target Career badge on right */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-200 rounded-lg text-xs font-semibold text-brand-700">
              <Target className="w-3.5 h-3.5 text-black" />
              <span>Target Career: <strong className="text-black">Frontend Developer</strong></span>
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
        <div className="p-8 max-w-6xl mx-auto space-y-7 text-left">

          {/* 1. RECOMMENDATION SUMMARY (Large Horizontal Card) */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs flex items-center justify-between">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-black">
                  Opportunities Recommended For You
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-black rounded border border-brand-300">
                  AI Matched
                </span>
              </div>
              <p className="text-xs text-brand-500">
                Based on your current skills and career goal.
              </p>

              {/* Metrics & Matched Skills */}
              <div className="pt-2 flex items-center space-x-6 text-xs text-brand-700">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-black">14</span>
                  <span className="text-xs text-brand-500 font-medium">Matches</span>
                </div>

                <div className="border-l border-brand-200 pl-6 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-black">87%</span>
                  <span className="text-xs text-brand-500 font-medium">Average Match</span>
                </div>

                <div className="border-l border-brand-200 pl-6">
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider block mb-1">
                    Skills Matched:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {['React', 'JavaScript', 'HTML/CSS'].map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[11px] font-semibold bg-brand-100 text-black rounded border border-brand-200"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right CTA */}
            <button
              onClick={() => onNavigate ? onNavigate('/student/roadmap') : null}
              className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-brand-800 transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <span>Improve My Skills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. SEARCH AND FILTER BAR */}
          <div className="bg-white rounded-xl border border-brand-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Search internships or jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-brand-50 border border-brand-300 rounded-lg text-xs font-medium text-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              <Search className="w-4 h-4 text-brand-400 absolute left-3 top-2.5" />
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-3">
              
              {/* Role filter */}
              <div className="flex items-center space-x-1">
                <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider">Role:</span>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-brand-50 border border-brand-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-black focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                >
                  {roleFilters.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Work Type Filter */}
              <div className="flex items-center space-x-1 border-l border-brand-200 pl-3">
                <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider">Work Type:</span>
                <div className="flex space-x-1">
                  {workTypeFilters.map(wt => (
                    <button
                      key={wt}
                      onClick={() => setSelectedWorkType(wt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        selectedWorkType === wt
                          ? 'bg-black text-white'
                          : 'bg-brand-50 border border-brand-200 text-brand-700 hover:bg-brand-100'
                      }`}
                    >
                      {wt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location filter */}
              <div className="flex items-center space-x-1 border-l border-brand-200 pl-3">
                <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider">Location:</span>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-brand-50 border border-brand-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-black focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                >
                  {locationFilters.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

            </div>

          </div>

          {/* 3. INTERNSHIP CARDS (3-Column Desktop Grid) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-black">
                Available Opportunities ({filteredOpportunities.length})
              </h3>
              <span className="text-xs text-brand-500 font-medium">Verified Industry Employers</span>
            </div>

            <div className="grid grid-cols-3 gap-5">
              {filteredOpportunities.map((item) => {
                const matchResult = calculateSkillMatch(STUDENT_SKILL_PROFILE, item.requiredSkills);
                const applied = isApplied(item.id);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs flex flex-col justify-between hover:border-black transition-all hover:shadow-md group"
                  >
                    <div>
                      {/* Top Row: Work Type Pill + Stipend */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-700 px-2 py-0.5 rounded border border-brand-200">
                          {item.type}
                        </span>
                        <span className="text-xs font-bold text-black">
                          {item.stipend}
                        </span>
                      </div>

                      {/* Job Title & Company */}
                      <h4 className="text-base font-bold text-black leading-snug group-hover:text-black">
                        {item.title}
                      </h4>
                      <p className="text-xs font-semibold text-brand-600 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-brand-400" />
                        <span>{item.companyName}</span>
                      </p>

                      {/* Location & Duration */}
                      <div className="mt-2.5 flex items-center gap-3 text-xs text-brand-500 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-400" />
                          {item.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-brand-400" />
                          {item.duration}
                        </span>
                      </div>

                      {/* Required Skills */}
                      <div className="mt-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block mb-1.5">
                          Required Skills:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {item.requiredSkills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 text-[11px] font-medium bg-brand-50 border border-brand-200 rounded text-black"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Match Score */}
                      <div className="mt-4 pt-3 border-t border-brand-100">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-black">
                            {matchResult.matchScore}% Match
                          </span>
                          <span className="text-brand-500 text-[11px]">
                            {matchResult.matchedCount} / {matchResult.totalCount} skills matched
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-brand-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-black rounded-full transition-all duration-300"
                            style={{ width: `${matchResult.matchScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-3 border-t border-brand-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedOpportunity(item)}
                        className="flex-1 py-2 text-xs font-bold border border-brand-300 hover:border-black rounded-lg text-black hover:bg-brand-50 transition-colors"
                      >
                        View Details
                      </button>

                      <button
                        disabled={applied}
                        onClick={() => handleApply(item)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1 shadow-xs ${
                          applied
                            ? 'bg-brand-100 border-brand-300 text-brand-700 cursor-default'
                            : 'bg-black text-white border-black hover:bg-brand-800'
                        }`}
                      >
                        {applied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Applied</span>
                          </>
                        ) : (
                          <span>Apply</span>
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. MY APPLICATIONS SECTION (Desktop Table at Bottom) */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-brand-200 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-black">
                  My Applications
                </h3>
                <p className="text-xs text-brand-500 mt-0.5">
                  Track the status of your submitted internship and job applications.
                </p>
              </div>

              <span className="text-xs font-bold bg-brand-100 text-black px-2.5 py-1 rounded border border-brand-300">
                {applications.length} Active Applications
              </span>
            </div>

            {/* Desktop Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brand-200 text-brand-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Opportunity</th>
                    <th className="py-2.5 px-3">Company</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Applied Date</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100 font-medium">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-brand-50/50 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-black">
                        {app.opportunityTitle}
                      </td>
                      <td className="py-3.5 px-3 text-brand-700">
                        {app.companyName}
                      </td>
                      <td className="py-3.5 px-3 text-brand-500">
                        {app.location || 'Remote'}
                      </td>
                      <td className="py-3.5 px-3 text-brand-500">
                        {app.appliedDate}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            app.status === 'Applied'
                              ? 'bg-black text-white'
                              : app.status === 'Under Review'
                              ? 'bg-brand-200 text-brand-800'
                              : 'bg-brand-100 text-black border border-brand-300'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </main>

      {/* OPPORTUNITY DETAILS & SKILL MATCH MODAL */}
      {selectedOpportunity && (() => {
        const matchResult = calculateSkillMatch(STUDENT_SKILL_PROFILE, selectedOpportunity.requiredSkills);
        const applied = isApplied(selectedOpportunity.id);

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-brand-300 max-w-xl w-full p-7 text-left shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-brand-200 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-700 px-2 py-0.5 rounded border border-brand-200 inline-block mb-1.5">
                    {selectedOpportunity.type} • {selectedOpportunity.duration}
                  </span>
                  <h3 className="text-xl font-extrabold text-black">
                    {selectedOpportunity.title}
                  </h3>
                  <p className="text-xs font-semibold text-brand-600 mt-0.5">
                    {selectedOpportunity.companyName} • {selectedOpportunity.location} • {selectedOpportunity.stipend}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedOpportunity(null)}
                  className="p-1 text-brand-400 hover:text-black rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-black uppercase tracking-wider text-[11px] mb-1">
                    About the Opportunity
                  </h4>
                  <p className="text-brand-600 leading-relaxed">
                    {selectedOpportunity.description}
                  </p>
                </div>

                {/* Responsibilities */}
                <div>
                  <h4 className="font-bold text-black uppercase tracking-wider text-[11px] mb-1.5">
                    Key Responsibilities
                  </h4>
                  <ul className="space-y-1.5 text-brand-600 list-disc list-inside">
                    {selectedOpportunity.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx}>{resp}</li>
                    ))}
                  </ul>
                </div>

                {/* Required Skills */}
                <div>
                  <h4 className="font-bold text-black uppercase tracking-wider text-[11px] mb-1.5">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOpportunity.requiredSkills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 text-xs font-semibold bg-brand-100 text-black rounded border border-brand-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* YOUR SKILL MATCH SECTION */}
                <div className="p-4 bg-brand-50 rounded-xl border border-brand-200 space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black text-sm">
                      Your Skill Match
                    </span>
                    <span className="text-sm font-extrabold text-black">
                      {matchResult.matchScore}% Match
                    </span>
                  </div>

                  <div className="w-full h-2 bg-brand-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full"
                      style={{ width: `${matchResult.matchScore}%` }}
                    ></div>
                  </div>

                  {/* Matched Skills */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block mb-1">
                      Matched Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.matchedSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs font-semibold bg-white text-black rounded border border-brand-300"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skills to Improve */}
                  {matchResult.missingSkills.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block mb-1">
                        Skills to Improve:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {matchResult.missingSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs font-semibold bg-brand-200 text-brand-800 rounded"
                          >
                            + {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Roadmap Note & CTA */}
                  <div className="pt-2 border-t border-brand-200 flex items-center justify-between">
                    <p className="text-[11px] text-brand-500">
                      Improve this skill using your personalized AI Career Roadmap.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedOpportunity(null);
                        onNavigate?.('/student/roadmap');
                      }}
                      className="text-xs font-bold text-black underline hover:text-brand-700 shrink-0 ml-2"
                    >
                      Open AI Roadmap &rarr;
                    </button>
                  </div>
                </div>

                {/* Application Confirmation State */}
                {applied && (
                  <div className="p-3 bg-brand-100 rounded-lg text-xs font-semibold text-black flex items-center gap-2 border border-brand-300">
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>Application Submitted — You have successfully applied for this opportunity.</span>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="mt-6 pt-4 border-t border-brand-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOpportunity(null)}
                  className="px-4 py-2 border border-brand-300 rounded-lg text-xs font-bold text-brand-700 hover:bg-brand-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={applied}
                  onClick={() => handleApply(selectedOpportunity)}
                  className="px-6 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-brand-800 disabled:opacity-50 transition-colors shadow-xs"
                >
                  {applied ? 'Application Submitted' : 'Apply Now'}
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default Internships;
