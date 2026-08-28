import React from 'react';
import { MOCK_FDP_PROGRAMS } from '../data/mockData';
import type { UserRole } from '../types';
import { 
  Building2, 
  Presentation, 
  Lightbulb, 
  FileText
} from 'lucide-react';

interface AcademicCollaborationProps {
  onOpenLogin: (role?: UserRole) => void;
}

export const AcademicCollaboration: React.FC<AcademicCollaborationProps> = ({ onOpenLogin }) => {
  return (
    <section id="academics" className="py-20 bg-brand-50/60 border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-200 text-xs font-semibold text-brand-800 mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Academician & Higher Education Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
            Faculty Internships & Industrial Training
          </h2>
          <p className="mt-3 text-base text-brand-600">
            Dedicated portals enabling professors and university leaders to engage in faculty internships, sponsored FDPs, and collaborative R&D consultancy.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          
          <div className="p-6 bg-white rounded-2xl border border-brand-300 hover:border-black transition-all">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center mb-4">
              <Presentation className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-black">Faculty Development Programs (FDPs)</h3>
            <p className="text-xs text-brand-600 mt-2 leading-relaxed">
              Curated immersion workshops hosted by senior corporate architects to upgrade teaching modules in Cloud, AI, and Cybersecurity.
            </p>
            <div className="mt-4 pt-3 border-t border-brand-100 flex items-center justify-between text-xs font-semibold text-brand-700">
              <span>Over 80+ Annual FDP Cohorts</span>
              <span className="text-black font-bold">Free Access</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-brand-300 hover:border-black transition-all">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center mb-4">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-black">Corporate Faculty Internships</h3>
            <p className="text-xs text-brand-600 mt-2 leading-relaxed">
              Sabbatical and 4-8 week immersive stints for faculty inside active industry R&D teams to gain real-world implementation insights.
            </p>
            <div className="mt-4 pt-3 border-t border-brand-100 flex items-center justify-between text-xs font-semibold text-brand-700">
              <span>Stipend & Travel Covered</span>
              <span className="text-black font-bold">Summer & Winter</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-brand-300 hover:border-black transition-all">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-black">Consultancy & Sponsored R&D</h3>
            <p className="text-xs text-brand-600 mt-2 leading-relaxed">
              Connect institutional research labs with corporate problem statements for funded technology transfer and joint patents.
            </p>
            <div className="mt-4 pt-3 border-t border-brand-100 flex items-center justify-between text-xs font-semibold text-brand-700">
              <span>₹4.2 Cr Grants Facilitated</span>
              <span className="text-black font-bold">Active Tracks</span>
            </div>
          </div>

        </div>

        {/* Featured FDP Opportunities Table / Cards */}
        <div className="bg-white rounded-2xl border border-brand-300 p-6 sm:p-8 text-left shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-200 pb-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-black">Open Faculty Training & Immersion Openings</h3>
              <p className="text-xs text-brand-500 mt-0.5">Direct applications for verified academicians and departmental heads</p>
            </div>
            <button
              onClick={() => onOpenLogin('institute')}
              className="mt-3 sm:mt-0 px-4 py-2 text-xs font-bold bg-black text-white rounded-lg hover:bg-brand-800 transition-colors"
            >
              Sign In as Institute to Apply
            </button>
          </div>

          <div className="space-y-4">
            {MOCK_FDP_PROGRAMS.map((prog) => (
              <div
                key={prog.id}
                className="p-4 rounded-xl border border-brand-200 bg-brand-50/50 hover:bg-brand-100/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white rounded">
                      {prog.type}
                    </span>
                    <span className="text-xs text-brand-500 font-medium">by {prog.organization}</span>
                  </div>
                  <h4 className="text-sm font-bold text-black">{prog.title}</h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {prog.skillsCovered.map((skill, sIdx) => (
                      <span key={sIdx} className="text-[11px] px-2 py-0.5 bg-white border border-brand-200 rounded font-medium text-brand-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-black">{prog.duration}</div>
                    <div className="text-[11px] text-brand-500">{prog.spots} faculty spots</div>
                  </div>
                  <button
                    onClick={() => onOpenLogin('institute')}
                    className="px-4 py-2 text-xs font-bold border border-black rounded-lg hover:bg-black hover:text-white transition-colors"
                  >
                    Nominate Faculty
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
