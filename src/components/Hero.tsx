import React from 'react';
import type { UserRole } from '../types';
import { 
  ArrowRight, 
  GraduationCap,
  Building2,
  Briefcase
} from 'lucide-react';

interface HeroProps {
  onOpenLogin: (role?: UserRole) => void;
  onExploreSection: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenLogin, onExploreSection }) => {
  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-20 border-b border-brand-200">
      
      {/* Subtle geometric dot grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Highlight Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black bg-white text-xs font-semibold text-black mb-8 shadow-xs hover:bg-brand-50 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-black"></span>
          <span>Unified Academia — Industry Collaboration Platform</span>
          <span className="text-brand-400">|</span>
          <span className="text-brand-600 font-medium">Skill Mapping • Internships • Placement</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-black tracking-tight max-w-5xl mx-auto leading-[1.1]">
          Bridging the gap between <br className="hidden sm:inline" />
          <span className="relative inline-block">
            academic learning
            <span className="absolute bottom-1 left-0 right-0 h-1 bg-brand-300 -z-10 rounded"></span>
          </span>{' '}
          &{' '}
          <span className="bg-black text-white px-3 py-0.5 rounded-lg inline-block my-1">
            industry skills
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-brand-600 max-w-3xl mx-auto leading-relaxed font-normal">
          Empowering <strong>Students</strong> with skill gap profiling and career roadmaps, 
          enabling <strong>Academicians</strong> with faculty internships & FDPs, 
          and providing <strong>Industries</strong> with verified, job-ready talent.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => onOpenLogin('student')}
            className="w-full sm:w-auto px-8 py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-brand-800 transition-all flex items-center justify-center gap-2 shadow-md group"
          >
            <span>Start Skill Assessment</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => onExploreSection('skill-mapping')}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold rounded-xl border border-black hover:bg-brand-50 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Platform</span>
          </button>
        </div>

        {/* 3 Quick Role Action Chips */}
        <div className="mt-12 pt-8 border-t border-brand-200/80 max-w-4xl mx-auto">
          <p className="text-xs uppercase font-bold tracking-wider text-brand-400 mb-4">
            Select an ecosystem entry point
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div 
              onClick={() => onOpenLogin('student')}
              className="p-4 bg-white rounded-xl border border-brand-300 hover:border-black transition-all cursor-pointer text-left hover:shadow-md flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black">For Students</h4>
                  <p className="text-xs text-brand-500">Skill Profiling & Internships</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
            </div>

            <div 
              onClick={() => onOpenLogin('institute')}
              className="p-4 bg-white rounded-xl border border-brand-300 hover:border-black transition-all cursor-pointer text-left hover:shadow-md flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black">For Institutes</h4>
                  <p className="text-xs text-brand-500">FDPs & Placement Analytics</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
            </div>

            <div 
              onClick={() => onOpenLogin('industry')}
              className="p-4 bg-white rounded-xl border border-brand-300 hover:border-black transition-all cursor-pointer text-left hover:shadow-md flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black">For Industries</h4>
                  <p className="text-xs text-brand-500">Post Openings & Skill Hire</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
            </div>

          </div>
        </div>

        {/* Impact Stats Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="p-5 rounded-xl bg-brand-50 border border-brand-200 text-left">
            <div className="text-3xl font-extrabold text-black tracking-tight">12,500+</div>
            <div className="text-xs font-semibold text-brand-600 mt-1 uppercase tracking-wider">Skill Assessments</div>
            <div className="text-xs text-brand-400 mt-0.5">Verified technical & soft competency</div>
          </div>

          <div className="p-5 rounded-xl bg-brand-50 border border-brand-200 text-left">
            <div className="text-3xl font-extrabold text-black tracking-tight">94%</div>
            <div className="text-xs font-semibold text-brand-600 mt-1 uppercase tracking-wider">Skill Match Rate</div>
            <div className="text-xs text-brand-400 mt-0.5">Direct industry role alignment</div>
          </div>

          <div className="p-5 rounded-xl bg-brand-50 border border-brand-200 text-left">
            <div className="text-3xl font-extrabold text-black tracking-tight">480+</div>
            <div className="text-xs font-semibold text-brand-600 mt-1 uppercase tracking-wider">Industry Partners</div>
            <div className="text-xs text-brand-400 mt-0.5">Active hiring and FDP programs</div>
          </div>

          <div className="p-5 rounded-xl bg-brand-50 border border-brand-200 text-left">
            <div className="text-3xl font-extrabold text-black tracking-tight">350+</div>
            <div className="text-xs font-semibold text-brand-600 mt-1 uppercase tracking-wider">Universities & Colleges</div>
            <div className="text-xs text-brand-400 mt-0.5">Connected institutional portals</div>
          </div>
        </div>

      </div>
    </section>
  );
};
