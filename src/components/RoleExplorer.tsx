import React, { useState } from 'react';
import type { UserRole } from '../types';
import { 
  GraduationCap, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

interface RoleExplorerProps {
  onOpenLogin: (role?: UserRole) => void;
}

export const RoleExplorer: React.FC<RoleExplorerProps> = ({ onOpenLogin }) => {
  const [activeTab, setActiveTab] = useState<UserRole>('student');

  const roleDetails = {
    student: {
      role: 'student' as UserRole,
      title: 'Student Portal & Skill Profiling',
      subtitle: 'Identify competency gaps, build digital portfolios, and secure matched internships.',
      icon: GraduationCap,
      highlights: [
        {
          title: 'Skill Assessment Questionnaires',
          desc: 'Take standardized technical and soft-skill tests created in collaboration with industry tech leads.'
        },
        {
          title: 'Skill Gap & Profiling Radar',
          desc: 'Gain crystal-clear visibility into your strengths, missing competencies, and high-demand industry skills.'
        },
        {
          title: 'AI Career Roadmap',
          desc: 'Follow a customized learning journey with targeted certification courses and practical mini-projects.'
        },
        {
          title: 'Verified Digital Portfolio',
          desc: 'Showcase authentic test scores, project repos, and verifiable credentials directly to hiring managers.'
        },
        {
          title: '1-Click Internship Applications',
          desc: 'Apply directly to matched internships and entry-level positions with real-time status tracking.'
        }
      ],
      ctaText: 'Access Student Portal',
      metric: '85% Average Skill Score Increase'
    },
    institute: {
      role: 'institute' as UserRole,
      title: 'Institute & Academician Portal',
      subtitle: 'Empower faculty with industrial immersion and track student placement readiness.',
      icon: Building2,
      highlights: [
        {
          title: 'Faculty Internships & Industrial Training',
          desc: 'Enable professors and educators to spend time in active tech environments to modernize classroom pedagogy.'
        },
        {
          title: 'Faculty Development Programs (FDPs)',
          desc: 'Participate in sponsored workshops on Cloud, AI/ML, DevOps, and modern manufacturing paradigms.'
        },
        {
          title: 'Student Placement Analytics',
          desc: 'Monitor real-time cohort skill readiness, test performance, and placement pipeline metrics in one dashboard.'
        },
        {
          title: 'Curriculum-Industry Alignment Engine',
          desc: 'Compare department syllabus topics with current job market keyword demand to adjust course curricula.'
        },
        {
          title: 'Collaborative Research & Consultancy',
          desc: 'Bridge faculty expertise with corporate R&D challenges through funded consultancy grants.'
        }
      ],
      ctaText: 'Access Institute Portal',
      metric: '350+ Connected Academic Departments'
    },
    industry: {
      role: 'industry' as UserRole,
      title: 'Industry & Corporate Partner Portal',
      subtitle: 'Source pre-assessed candidates, post opportunities, and launch corporate training.',
      icon: Briefcase,
      highlights: [
        {
          title: 'Competency-Based Job & Internship Postings',
          desc: 'Specify the exact technical skills, frameworks, and assessment benchmarks required for your roles.'
        },
        {
          title: 'Intelligent Candidate Match Engine',
          desc: 'Filter candidates by verified assessment scores and project portfolios rather than unverified resume keywords.'
        },
        {
          title: 'Corporate Training & Mentorship',
          desc: 'Publish pre-internship training modules, conduct live webinars, and mentor high-potential student cohorts.'
        },
        {
          title: 'Campus Hackathons & Innovation Challenges',
          desc: 'Host problem-statement challenges across top universities to discover standout problem solvers.'
        },
        {
          title: 'Streamlined Hiring Pipeline',
          desc: 'Manage applicants, conduct integrated assessments, and issue offer letters seamlessly.'
        }
      ],
      ctaText: 'Access Industry Portal',
      metric: '480+ Actively Recruiting Tech Companies'
    }
  };

  const current = roleDetails[activeTab];
  const CurrentIcon = current.icon;

  return (
    <section id="roles" className="py-20 bg-white border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
            A Unified Ecosystem for Three Pillars
          </h2>
          <p className="mt-3 text-base text-brand-600">
            Tailored tools designed specifically for students, academic institutions, and industry recruiters.
          </p>
          
          {/* Tab Selector */}
          <div className="mt-8 inline-flex p-1.5 bg-brand-100 rounded-xl border border-brand-200">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'student'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-brand-600 hover:text-black'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Students</span>
            </button>
            <button
              onClick={() => setActiveTab('institute')}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'institute'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-brand-600 hover:text-black'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Institutes & Academics</span>
            </button>
            <button
              onClick={() => setActiveTab('industry')}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'industry'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-brand-600 hover:text-black'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Industries & Recruiters</span>
            </button>
          </div>
        </div>

        {/* Active Tab Showcase Box */}
        <div className="bg-brand-50 border border-brand-300 rounded-2xl p-8 lg:p-12 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Context & Overview */}
            <div className="lg:col-span-5 text-left space-y-6">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shadow-md">
                <CurrentIcon className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-brand-500 block mb-1">
                  Dedicated Portal
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-black leading-tight">
                  {current.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-brand-600">
                  {current.subtitle}
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-brand-200">
                <div className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Key Impact</div>
                <div className="text-lg font-bold text-black mt-0.5">{current.metric}</div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenLogin(current.role)}
                  className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-brand-800 transition-all flex items-center gap-2 shadow-sm text-sm"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Feature Breakdown */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {current.highlights.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-5 bg-white rounded-xl border border-brand-200 hover:border-black transition-all ${
                    idx === 0 ? 'sm:col-span-2 bg-white/90' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-black shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-black">{item.title}</h4>
                      <p className="text-xs text-brand-600 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
