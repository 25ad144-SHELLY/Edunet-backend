import React, { useState } from 'react';
import type { User } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  Settings, 
  LogOut, 
  Bell, 
  BookOpen
} from 'lucide-react';

interface InstituteDashboardProps {
  user: User;
  onLogout: () => void;
  onBackToLanding?: () => void;
}

export const InstituteDashboard: React.FC<InstituteDashboardProps> = ({
  user,
  onLogout,
  onBackToLanding
}) => {
  const [activeTab, setActiveTab] = useState('Overview');

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
              Institute Suite
            </span>
          </div>

          <nav className="space-y-1.5 text-left text-sm font-medium">
            <button
              onClick={() => setActiveTab('Overview')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'Overview' ? 'bg-brand-100 text-black font-bold' : 'text-brand-600 hover:bg-brand-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-black" />
              <span>Institutional Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('Cohorts')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'Cohorts' ? 'bg-brand-100 text-black font-bold' : 'text-brand-600 hover:bg-brand-50'
              }`}
            >
              <Users className="w-4 h-4 text-brand-700" />
              <span>Student Cohorts (1,450)</span>
            </button>
            <button
              onClick={() => setActiveTab('FDPs')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'FDPs' ? 'bg-brand-100 text-black font-bold' : 'text-brand-600 hover:bg-brand-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-brand-700" />
              <span>Faculty FDPs & Internships</span>
            </button>
            <button
              onClick={() => setActiveTab('Curriculum')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'Curriculum' ? 'bg-brand-100 text-black font-bold' : 'text-brand-600 hover:bg-brand-50'
              }`}
            >
              <Award className="w-4 h-4 text-brand-700" />
              <span>Curriculum Gap Index</span>
            </button>
            <button
              onClick={() => setActiveTab('Settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'Settings' ? 'bg-brand-100 text-black font-bold' : 'text-brand-600 hover:bg-brand-50'
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
              Institutional Placement & Faculty Development Dashboard
            </h1>
            <p className="text-xs text-brand-500 font-medium">{user.organization || 'Apex Institute of Technology'}</p>
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
                KV
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6 text-left">
          
          {/* Welcome Banner */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h2 className="text-2xl font-extrabold text-black">
                Institutional Overview: 2026 Graduating Cohort
              </h2>
              <p className="text-xs sm:text-sm text-brand-500 mt-1">
                Real-time tracking of student skill assessments, verified profiles, and industry alignment.
              </p>
            </div>
            <button className="px-4 py-2.5 bg-black text-white text-xs font-bold rounded-md hover:bg-brand-800 transition-colors shadow-xs">
              Export NAAC / NBA Report
            </button>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs">
              <div className="text-xs font-semibold text-brand-700">Assessed Students</div>
              <div className="text-3xl font-extrabold text-black mt-2">1,450</div>
              <div className="text-[11px] text-brand-500 mt-1">92% of final year cohort</div>
            </div>

            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs">
              <div className="text-xs font-semibold text-brand-700">Placement Readiness</div>
              <div className="text-3xl font-extrabold text-black mt-2">88.4%</div>
              <div className="text-[11px] text-brand-500 mt-1">+14% vs previous semester</div>
            </div>

            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs">
              <div className="text-xs font-semibold text-brand-700">Active FDP Nominations</div>
              <div className="text-3xl font-extrabold text-black mt-2">24</div>
              <div className="text-[11px] text-brand-500 mt-1">Across 6 tech departments</div>
            </div>

            <div className="bg-white rounded-xl border border-brand-200 p-5 shadow-xs">
              <div className="text-xs font-semibold text-brand-700">Industry Partner MoUs</div>
              <div className="text-3xl font-extrabold text-black mt-2">42</div>
              <div className="text-[11px] text-brand-500 mt-1">Direct corporate recruiters</div>
            </div>
          </div>

          {/* Department Readiness & Skill Gap Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-xl border border-brand-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-black mb-4">
                Departmental Skill Readiness Index
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-black mb-1">
                    <span>Computer Science & Engineering</span>
                    <span>94% Ready</span>
                  </div>
                  <div className="w-full h-2 bg-brand-200 rounded-full overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-black mb-1">
                    <span>Information Technology</span>
                    <span>89% Ready</span>
                  </div>
                  <div className="w-full h-2 bg-brand-200 rounded-full overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{ width: '89%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-black mb-1">
                    <span>Electronics & Communication</span>
                    <span>76% Ready</span>
                  </div>
                  <div className="w-full h-2 bg-brand-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-600 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-black mb-1">
                    <span>Mechanical & Automation</span>
                    <span>68% Ready</span>
                  </div>
                  <div className="w-full h-2 bg-brand-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* FDP Quick Track */}
            <div className="lg:col-span-5 bg-black text-white rounded-xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-brand-400">Faculty Immersion</span>
                <h3 className="text-lg font-bold text-white mt-1">Upcoming Corporate FDP Cohort</h3>
                <p className="text-xs text-brand-300 mt-2 leading-relaxed">
                  TechCorp 4-week Faculty Sabbatical on Cloud Microservices & Distributed AI now accepting nominations.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-800 flex items-center justify-between">
                <span className="text-xs text-brand-300">12 Spots Allocated</span>
                <button className="px-4 py-2 bg-white text-black text-xs font-bold rounded-md hover:bg-brand-100 transition-colors">
                  Nominate Professors
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
