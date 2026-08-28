import React, { useState } from 'react';
import type { User } from '../../types';
import { MOCK_INTERNSHIPS } from '../../data/mockData';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Bell, 
  CheckCircle2, 
  BookOpen
} from 'lucide-react';

interface IndustryDashboardProps {
  user: User;
  onLogout: () => void;
  onBackToLanding?: () => void;
}

export const IndustryDashboard: React.FC<IndustryDashboardProps> = ({
  user,
  onLogout,
  onBackToLanding
}) => {
  const [activeNav, setActiveNav] = useState('Overview');
  const [showPostModal, setShowPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setShowPostModal(false);
      setNewTitle('');
      setNewSkills('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col md:flex-row antialiased">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-brand-200 flex flex-col justify-between p-6 shrink-0">
        <div>
          <div className="flex flex-col text-left mb-8 cursor-pointer" onClick={onBackToLanding}>
            <span className="font-extrabold text-2xl tracking-tight text-black leading-none">
              Edunet
            </span>
            <span className="text-[11px] font-medium tracking-wider text-brand-500 uppercase mt-1">
              Industry Suite
            </span>
          </div>

          <nav className="space-y-1.5 text-left text-sm font-medium">
            <button
              onClick={() => setActiveNav('Overview')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Overview' ? 'bg-brand-100 text-black font-bold' : 'text-brand-600 hover:bg-brand-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-black" />
              <span>Talent Dashboard</span>
            </button>
            <button
              onClick={() => setActiveNav('Postings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Postings' ? 'bg-brand-100 text-black font-bold' : 'text-brand-600 hover:bg-brand-50'
              }`}
            >
              <Briefcase className="w-4 h-4 text-brand-700" />
              <span>Active Postings (8)</span>
            </button>
            <button
              onClick={() => setActiveNav('Candidates')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Candidates' ? 'bg-brand-100 text-black font-bold' : 'text-brand-600 hover:bg-brand-50'
              }`}
            >
              <Users className="w-4 h-4 text-brand-700" />
              <span>Assessed Candidates</span>
            </button>
            <button
              onClick={() => setActiveNav('Training')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Training' ? 'bg-brand-100 text-black font-bold' : 'text-brand-600 hover:bg-brand-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-brand-700" />
              <span>Corporate Training & FDPs</span>
            </button>
            <button
              onClick={() => setActiveNav('Settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Settings' ? 'bg-brand-100 text-black font-bold' : 'text-brand-600 hover:bg-brand-50'
              }`}
            >
              <Settings className="w-4 h-4 text-brand-700" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

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

      {/* Main Content */}
      <main className="flex-1 bg-[#FAFAFA] min-h-screen overflow-y-auto">
        <div className="bg-white border-b border-brand-200 px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-base sm:text-lg font-bold text-black">
              Recruiter & Industry Collaboration Portal
            </h1>
            <p className="text-xs text-brand-500 font-medium">{user.organization || 'TechCorp Solutions'}</p>
          </div>

          <div className="flex items-center space-x-4">
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="text-xs font-semibold px-3 py-1.5 border border-brand-300 rounded-lg hover:bg-brand-50"
              >
                &larr; Landing Page
              </button>
            )}
            <button className="p-1.5 text-brand-500 hover:text-black rounded-lg hover:bg-brand-100">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2.5 pl-2 border-l border-brand-200">
              <span className="text-xs sm:text-sm font-bold text-black">{user.name}</span>
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                MS
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6 text-left">
          
          {/* Welcome Banner with Post Button */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h2 className="text-2xl font-extrabold text-black">
                Verified Skill-Matched Talent Pipeline
              </h2>
              <p className="text-xs sm:text-sm text-brand-500 mt-1">
                Filter and hire candidates with verified technical scores from 350+ partner universities.
              </p>
            </div>
            <button
              onClick={() => setShowPostModal(true)}
              className="px-4 py-2.5 bg-black text-white text-xs font-bold rounded-md hover:bg-brand-800 transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Internship / Job</span>
            </button>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs">
              <div className="text-xs font-semibold text-brand-700">Active Postings</div>
              <div className="text-3xl font-extrabold text-black mt-2">8</div>
              <div className="text-[11px] text-brand-500 mt-1">Across 3 tech hubs</div>
            </div>

            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs">
              <div className="text-xs font-semibold text-brand-700">Skill-Matched Applicants</div>
              <div className="text-3xl font-extrabold text-black mt-2">142</div>
              <div className="text-[11px] text-brand-500 mt-1">≥ 80% test score match</div>
            </div>

            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs">
              <div className="text-xs font-semibold text-brand-700">Shortlisted Candidates</div>
              <div className="text-3xl font-extrabold text-black mt-2">28</div>
              <div className="text-[11px] text-brand-500 mt-1">Interviews in progress</div>
            </div>

            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs">
              <div className="text-xs font-semibold text-brand-700">Corporate Trainees</div>
              <div className="text-3xl font-extrabold text-black mt-2">320</div>
              <div className="text-[11px] text-brand-500 mt-1">Enrolled in pre-hire tracks</div>
            </div>
          </div>

          {/* Active Job Postings List */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-black">
                Active Internship & Placement Postings
              </h3>
              <span className="text-xs text-brand-500">Auto-matched with student skill profiles</span>
            </div>

            <div className="space-y-3">
              {MOCK_INTERNSHIPS.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-xl border border-brand-200 bg-brand-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-black">{job.title}</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-200 rounded text-brand-800">
                        {job.type}
                      </span>
                    </div>
                    <p className="text-xs text-brand-500 mt-0.5">
                      {job.stipend} • {job.duration} • 18 verified applicants
                    </p>
                    <div className="flex gap-1.5 mt-2">
                      {job.skills.map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-white border border-brand-200 rounded font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-xs font-bold border border-black rounded-lg hover:bg-brand-100">
                      View 18 Applicants
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Post Opening Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-300 max-w-lg w-full p-6 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-200 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-black">Post Internship / Entry Role</h3>
              <button onClick={() => setShowPostModal(false)} className="text-xs text-brand-500 font-bold">
                ✕ Close
              </button>
            </div>

            {postSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-black mx-auto" />
                <h4 className="font-bold text-black text-sm">Opening Published Successfully!</h4>
                <p className="text-xs text-brand-500">Matching with student skill profiles now.</p>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-brand-700 mb-1">Position Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud Security Intern"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 bg-brand-50 border border-brand-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-brand-700 mb-1">Required Competencies (Comma separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Docker, Python, AWS, Network Security"
                    value={newSkills}
                    onChange={(e) => setNewSkills(e.target.value)}
                    className="w-full p-2.5 bg-brand-50 border border-brand-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-brand-700 mb-1">Format</label>
                    <select className="w-full p-2.5 bg-brand-50 border border-brand-300 rounded-lg text-xs">
                      <option>Remote</option>
                      <option>Hybrid</option>
                      <option>On-site</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-brand-700 mb-1">Stipend / Comp</label>
                    <input
                      type="text"
                      defaultValue="₹2,500 / mo"
                      className="w-full p-2.5 bg-brand-50 border border-brand-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-4 py-2 border border-brand-300 rounded-lg font-bold text-brand-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-black text-white rounded-lg font-bold hover:bg-brand-800"
                  >
                    Publish Opportunity
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
