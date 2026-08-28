import React, { useState } from 'react';
import { MOCK_INTERNSHIPS } from '../data/mockData';
import type { UserRole } from '../types';
import { 
  Briefcase, 
  Search, 
  CheckCircle,
  Building
} from 'lucide-react';

interface InternshipsSectionProps {
  onOpenLogin: (role?: UserRole) => void;
}

export const InternshipsSection: React.FC<InternshipsSectionProps> = ({ onOpenLogin }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const filteredInternships = MOCK_INTERNSHIPS.filter(item => {
    const matchesFilter = filterType === 'all' || item.type.toLowerCase() === filterType.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleApply = (id: string) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds([...appliedIds, id]);
    }
  };

  return (
    <section id="internships" className="py-20 bg-white border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-xs font-semibold text-brand-800 mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Skill-Matched Industry Opportunities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
              Internships & Placement Openings
            </h2>
            <p className="mt-2 text-base text-brand-600">
              Direct postings from verified tech companies, matched directly against your assessed competencies.
            </p>
          </div>

          {/* Quick Post CTA for Industry */}
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => onOpenLogin('industry')}
              className="px-5 py-2.5 text-sm font-semibold border border-black rounded-xl hover:bg-black hover:text-white transition-all flex items-center gap-2"
            >
              <Building className="w-4 h-4" />
              <span>Post an Opportunity as Industry</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-brand-50 p-4 rounded-xl border border-brand-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by role, skill (e.g. React), or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-brand-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <Search className="w-4 h-4 text-brand-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['all', 'remote', 'hybrid', 'on-site'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors shrink-0 ${
                  filterType === type
                    ? 'bg-black text-white'
                    : 'bg-white border border-brand-300 text-brand-700 hover:bg-brand-100'
                }`}
              >
                {type === 'all' ? 'All Formats' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Internship Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {filteredInternships.map((internship) => {
            const isApplied = appliedIds.includes(internship.id);

            return (
              <div
                key={internship.id}
                className="bg-white rounded-xl border border-brand-300 p-6 flex flex-col justify-between hover:border-black transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-extrabold text-lg text-black leading-snug">
                        {internship.title}
                      </h3>
                      <p className="text-xs font-medium text-brand-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-black">{internship.company}</span>
                        <span>•</span>
                        <span>{internship.location}</span>
                      </p>
                    </div>
                    {internship.matchScore && (
                      <span className="px-2 py-0.5 text-[11px] font-bold bg-brand-100 border border-brand-300 rounded text-black">
                        {internship.matchScore}% Match
                      </span>
                    )}
                  </div>

                  {/* Details Pill Row */}
                  <div className="flex flex-wrap gap-2 text-xs text-brand-600 my-3">
                    <span className="px-2 py-0.5 bg-brand-50 border border-brand-200 rounded">
                      {internship.type}
                    </span>
                    <span className="px-2 py-0.5 bg-brand-50 border border-brand-200 rounded">
                      {internship.stipend}
                    </span>
                    <span className="px-2 py-0.5 bg-brand-50 border border-brand-200 rounded">
                      {internship.duration}
                    </span>
                  </div>

                  {/* Skills Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {internship.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-medium bg-brand-100 text-black rounded border border-brand-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <div className="mt-6 pt-4 border-t border-brand-100">
                  <button
                    onClick={() => {
                      if (!isApplied) handleApply(internship.id);
                    }}
                    className={`w-full py-2.5 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                      isApplied
                        ? 'bg-brand-100 border-brand-300 text-brand-700 cursor-default'
                        : 'border-black text-black hover:bg-black hover:text-white'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-black" />
                        <span>Application Submitted</span>
                      </>
                    ) : (
                      <span>Apply Now</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Openings Footer Link */}
        <div className="mt-10 text-center">
          <button
            onClick={() => onOpenLogin('student')}
            className="inline-flex items-center gap-1 text-sm font-bold text-black hover:underline"
          >
            <span>View all 120+ active verified internships in full portal &rarr;</span>
          </button>
        </div>

      </div>
    </section>
  );
};
