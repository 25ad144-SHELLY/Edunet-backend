import React from 'react';
import type { UserRole } from '../types';
import { ShieldCheck, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenLogin: (role?: UserRole) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLogin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-brand-200 text-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-brand-200 text-left">
          
          {/* Col 1 & 2: Branding */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={scrollToTop}>
              <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center text-white shadow-xs">
                <div className="grid grid-cols-2 gap-1 p-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-xs"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-xs opacity-80"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-xs opacity-80"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-xs"></div>
                </div>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-black block leading-none">
                  Edunet
                </span>
                <span className="text-[10px] font-medium tracking-wider text-brand-500 uppercase">
                  Professional Suite
                </span>
              </div>
            </div>

            <p className="text-xs text-brand-600 leading-relaxed max-w-sm">
              The centralized Academia–Industry Collaboration Portal for standardized skill mapping, verified digital student portfolios, faculty internships, and intelligent placement matching.
            </p>

            <div className="pt-2 flex items-center space-x-2 text-xs font-semibold text-brand-700">
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Compliant with Outcome-Based Education (OBE)</span>
            </div>
          </div>

          {/* Col 3: Role Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">Role Portals</h4>
            <ul className="space-y-2 text-xs text-brand-600 font-medium">
              <li>
                <button onClick={() => onOpenLogin('student')} className="hover:text-black transition-colors">
                  Student Assessment Portal
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLogin('institute')} className="hover:text-black transition-colors">
                  Institute & Dean Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLogin('industry')} className="hover:text-black transition-colors">
                  Corporate Recruiter Portal
                </button>
              </li>
              <li>
                <a href="#skill-mapping" className="hover:text-black transition-colors">
                  Aptitude & Technical Tests
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">Core Modules</h4>
            <ul className="space-y-2 text-xs text-brand-600 font-medium">
              <li><a href="#skill-mapping" className="hover:text-black transition-colors">Skill Gap Profiler</a></li>
              <li><a href="#internships" className="hover:text-black transition-colors">Internship Board</a></li>
              <li><a href="#academics" className="hover:text-black transition-colors">Faculty FDP Programs</a></li>
              <li><a href="#academics" className="hover:text-black transition-colors">Industry Consultancy</a></li>
              <li><a href="#preview" className="hover:text-black transition-colors">Digital Portfolio Vault</a></li>
            </ul>
          </div>

          {/* Col 5: Security & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">Governance & Trust</h4>
            <ul className="space-y-2 text-xs text-brand-600 font-medium">
              <li><span className="hover:text-black cursor-pointer">Verification Protocols</span></li>
              <li><span className="hover:text-black cursor-pointer">NAAC / NBA Analytics</span></li>
              <li><span className="hover:text-black cursor-pointer">Data Privacy & Security</span></li>
              <li><span className="hover:text-black cursor-pointer">Institutional Integration</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-500">
          <div>
            &copy; 2026 Edunet Collaboration Suite. All rights reserved.
          </div>

          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-black">Privacy Policy</a>
            <a href="#terms" className="hover:text-black">Terms of Service</a>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 text-black font-bold hover:underline"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
