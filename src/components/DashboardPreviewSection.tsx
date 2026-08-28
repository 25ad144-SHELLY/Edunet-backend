import React, { useState } from 'react';
import type { UserRole } from '../types';
import { 
  GraduationCap, 
  Building2, 
  Briefcase, 
  Sparkles, 
  Eye
} from 'lucide-react';

interface DashboardPreviewSectionProps {
  onOpenLogin: (role?: UserRole) => void;
}

export const DashboardPreviewSection: React.FC<DashboardPreviewSectionProps> = ({ onOpenLogin }) => {
  const [selectedRolePreview, setSelectedRolePreview] = useState<UserRole>('student');

  return (
    <section id="preview" className="py-20 bg-white border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-xs font-semibold text-brand-800 mb-3">
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Interface Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
            High-Performance Monochrome Interface
          </h2>
          <p className="mt-3 text-base text-brand-600">
            A distraction-free, professional interface designed for students, academic departments, and recruiters.
          </p>

          {/* Toggle Role Previews */}
          <div className="mt-6 inline-flex p-1.5 bg-brand-100 rounded-xl border border-brand-200">
            <button
              onClick={() => setSelectedRolePreview('student')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedRolePreview === 'student'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-brand-600 hover:text-black'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Suite (Reference)</span>
            </button>

            <button
              onClick={() => setSelectedRolePreview('institute')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedRolePreview === 'institute'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-brand-600 hover:text-black'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Institute Suite</span>
            </button>

            <button
              onClick={() => setSelectedRolePreview('industry')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedRolePreview === 'industry'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-brand-600 hover:text-black'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Industry Suite</span>
            </button>
          </div>
        </div>

        {/* Realistic Dashboard Mock Window (Exact replica of design screenshot) */}
        <div className="relative rounded-2xl border-2 border-brand-300 shadow-2xl overflow-hidden bg-[#FAFAFA] text-left">
          
          {/* Mock Browser Header Bar */}
          <div className="bg-brand-100 px-4 py-2.5 border-b border-brand-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-brand-300 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-brand-300 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-brand-300 inline-block"></span>
              <span className="text-[11px] font-mono text-brand-500 pl-2">edunet.suite/portal/{selectedRolePreview}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-black uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-brand-200">
                Live Interactive Mode
              </span>
              <button
                onClick={() => onOpenLogin(selectedRolePreview)}
                className="px-3 py-1 bg-black text-white text-xs font-bold rounded hover:bg-brand-800 transition-colors"
              >
                Log In as {selectedRolePreview.toUpperCase()} &rarr;
              </button>
            </div>
          </div>

          {/* Render Preview Content */}
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Top Greeting Banner */}
            <div className="bg-white rounded-xl border border-brand-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-black">
                  {selectedRolePreview === 'student' && 'Good morning, Alex Chen 👋'}
                  {selectedRolePreview === 'institute' && 'Good morning, Dr. Katherine Vance 🏛️'}
                  {selectedRolePreview === 'industry' && 'Good morning, Marcus Sterling 🏢'}
                </h3>
                <p className="text-xs text-brand-500 mt-0.5">
                  {selectedRolePreview === 'student' && 'Continue building the skills you need for your career.'}
                  {selectedRolePreview === 'institute' && 'Institutional Placement & Faculty Development Dashboard.'}
                  {selectedRolePreview === 'industry' && 'Skill-verified candidate pipeline and job postings.'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-brand-400 block">
                    {selectedRolePreview === 'student' ? 'Target Career' : selectedRolePreview === 'institute' ? 'Institution' : 'Recruiting Org'}
                  </span>
                  <span className="text-xs font-extrabold text-black">
                    {selectedRolePreview === 'student' ? 'Frontend Developer' : selectedRolePreview === 'institute' ? 'Apex Institute of Tech' : 'TechCorp Solutions'}
                  </span>
                </div>
                <button
                  onClick={() => onOpenLogin(selectedRolePreview)}
                  className="px-3.5 py-2 bg-black text-white text-xs font-bold rounded-md hover:bg-brand-800"
                >
                  {selectedRolePreview === 'student' ? 'View Career Roadmap' : 'Manage Portal'}
                </button>
              </div>
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-brand-200">
                <div className="text-xs font-semibold text-brand-700">
                  {selectedRolePreview === 'student' ? 'Tests Taken' : selectedRolePreview === 'institute' ? 'Students Assessed' : 'Active Roles'}
                </div>
                <div className="text-2xl font-extrabold text-black mt-2">
                  {selectedRolePreview === 'student' ? '12' : selectedRolePreview === 'institute' ? '1,450' : '8'}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-brand-200">
                <div className="text-xs font-semibold text-brand-700">
                  {selectedRolePreview === 'student' ? 'Avg Score' : selectedRolePreview === 'institute' ? 'Placement Ready' : 'Matched Applicants'}
                </div>
                <div className="text-2xl font-extrabold text-black mt-2">
                  {selectedRolePreview === 'student' ? '85%' : selectedRolePreview === 'institute' ? '88.4%' : '142'}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-brand-200">
                <div className="text-xs font-semibold text-brand-700">
                  {selectedRolePreview === 'student' ? 'Applications' : selectedRolePreview === 'institute' ? 'Faculty FDPs' : 'Shortlisted'}
                </div>
                <div className="text-2xl font-extrabold text-black mt-2">
                  {selectedRolePreview === 'student' ? '3' : selectedRolePreview === 'institute' ? '24' : '28'}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-brand-200">
                <div className="text-xs font-semibold text-brand-700">
                  {selectedRolePreview === 'student' ? 'Skill Level' : selectedRolePreview === 'institute' ? 'Industry MoUs' : 'Training Cohorts'}
                </div>
                <div className="text-2xl font-extrabold text-black mt-2">
                  {selectedRolePreview === 'student' ? 'Intermediate' : selectedRolePreview === 'institute' ? '42' : '320'}
                </div>
              </div>
            </div>

            {/* Quick action bar to enter full view */}
            <div className="p-4 bg-black text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs">
                <Sparkles className="w-4 h-4 text-white" />
                <span>Ready to experience the full interactive workflow?</span>
              </div>
              <button
                onClick={() => onOpenLogin(selectedRolePreview)}
                className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-brand-100 transition-colors shrink-0"
              >
                Log In to Experience All Features &rarr;
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
