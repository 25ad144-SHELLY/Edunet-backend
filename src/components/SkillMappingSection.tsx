import React, { useState } from 'react';
import { MOCK_ASSESSMENT_QUESTIONS, MOCK_SKILL_TESTS } from '../data/mockData';
import { 
  ArrowRight, 
  Clock, 
  BrainCircuit, 
  RotateCcw
} from 'lucide-react';

interface SkillMappingSectionProps {
  onStartFullAssessment: () => void;
}

export const SkillMappingSection: React.FC<SkillMappingSectionProps> = ({ onStartFullAssessment }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const question = MOCK_ASSESSMENT_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    setShowExplanation(true);
    setUserAnswers(prev => ({ ...prev, [question.id]: index }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < MOCK_ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(userAnswers[MOCK_ASSESSMENT_QUESTIONS[currentQuestionIndex + 1]?.id] ?? null);
      setShowExplanation(userAnswers[MOCK_ASSESSMENT_QUESTIONS[currentQuestionIndex + 1]?.id] !== undefined);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(userAnswers[MOCK_ASSESSMENT_QUESTIONS[currentQuestionIndex - 1]?.id] ?? null);
      setShowExplanation(true);
    }
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setUserAnswers({});
  };

  return (
    <section id="skill-mapping" className="py-20 bg-brand-50/60 border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-200 text-xs font-semibold text-brand-800 mb-3">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Interactive Skill Assessment Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
            Skill Profiling & Gap Analysis
          </h2>
          <p className="mt-3 text-base text-brand-600">
            Evaluate technical aptitude and soft competencies using industry-curated benchmarks to generate instant career roadmaps.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Mini Assessment Test */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-brand-300 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-brand-200 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                  Live Sample Questionnaire
                </span>
                <h3 className="text-base font-bold text-black flex items-center gap-2 mt-0.5">
                  <span>Question {currentQuestionIndex + 1} of {MOCK_ASSESSMENT_QUESTIONS.length}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-100 rounded text-brand-700">
                    {question.category}
                  </span>
                </h3>
              </div>
              <button 
                onClick={resetTest}
                className="text-xs text-brand-500 hover:text-black flex items-center gap-1"
                title="Reset sample"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="text-left mb-6">
              <p className="text-base sm:text-lg font-semibold text-black leading-relaxed">
                {question.question}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3 text-left">
              {question.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = question.correctIndex === idx;

                let optionStyle = "border-brand-200 hover:border-brand-400 hover:bg-brand-50 text-black";
                if (showExplanation) {
                  if (isCorrect) {
                    optionStyle = "border-black bg-brand-900 text-white font-medium";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "border-brand-400 bg-brand-100 text-brand-700 line-through";
                  }
                } else if (isSelected) {
                  optionStyle = "border-black bg-black text-white";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-start space-x-3 ${optionStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation & Hint */}
            <div className="mt-6 pt-4 border-t border-brand-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-xs font-semibold text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 disabled:opacity-30 disabled:pointer-events-none"
              >
                &larr; Previous
              </button>

              <div className="flex gap-1.5">
                {MOCK_ASSESSMENT_QUESTIONS.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === currentQuestionIndex ? 'bg-black w-6' : userAnswers[MOCK_ASSESSMENT_QUESTIONS[i].id] !== undefined ? 'bg-brand-500' : 'bg-brand-200'
                    }`}
                  />
                ))}
              </div>

              {currentQuestionIndex < MOCK_ASSESSMENT_QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 text-xs font-semibold bg-black text-white rounded-lg hover:bg-brand-800 transition-colors"
                >
                  Next &rarr;
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onStartFullAssessment}
                  className="px-4 py-2 text-xs font-semibold bg-black text-white rounded-lg hover:bg-brand-800 transition-colors flex items-center gap-1"
                >
                  <span>Complete Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Skill Radar & Available Questionnaires */}
          <div className="lg:col-span-5 space-y-4 text-left">
            
            {/* Live Profiling Card */}
            <div className="bg-black text-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold tracking-wider text-brand-400">
                  Targeted Skill Gaps
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-brand-800 rounded text-brand-200">
                  Frontend Engineering Track
                </span>
              </div>

              <h4 className="text-lg font-bold">Real-time Industry Alignment</h4>
              <p className="text-xs text-brand-300 mt-1 mb-4">
                Students receive an automated breakdown of missing competencies for high-demand job profiles.
              </p>

              {/* Progress bars */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Modern React Architecture</span>
                    <span className="text-brand-300">88% (Match)</span>
                  </div>
                  <div className="w-full h-2 bg-brand-800 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>State Management & Redux</span>
                    <span className="text-brand-300">62% (Gap Identified)</span>
                  </div>
                  <div className="w-full h-2 bg-brand-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-400 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Performance Optimization & Web Vitals</span>
                    <span className="text-brand-300">45% (High Gap)</span>
                  </div>
                  <div className="w-full h-2 bg-brand-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-brand-800 flex items-center justify-between">
                <div className="text-xs text-brand-300">
                  Target Role: <strong className="text-white">Frontend Dev</strong>
                </div>
                <button
                  onClick={onStartFullAssessment}
                  className="px-3.5 py-1.5 bg-white text-black font-bold text-xs rounded-lg hover:bg-brand-100 transition-colors flex items-center gap-1"
                >
                  <span>View All 18 Tracks</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Popular Available Tests */}
            <div className="bg-white rounded-2xl border border-brand-300 p-5">
              <h4 className="text-sm font-bold text-black mb-3 flex items-center justify-between">
                <span>Featured Skill Assessments</span>
                <span className="text-xs text-brand-500 font-normal">Industry Certified</span>
              </h4>
              <div className="space-y-2.5">
                {MOCK_SKILL_TESTS.slice(0, 3).map((test) => (
                  <div
                    key={test.id}
                    className="p-3 rounded-xl border border-brand-200 hover:border-black transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-black">{test.title}</div>
                      <div className="text-[11px] text-brand-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {test.duration}</span>
                        <span>•</span>
                        <span>{test.questionsCount} Qs</span>
                        <span>•</span>
                        <span className="font-semibold text-black">{test.difficulty}</span>
                      </div>
                    </div>
                    <button
                      onClick={onStartFullAssessment}
                      className="px-3 py-1.5 text-xs font-bold border border-black rounded-lg hover:bg-black hover:text-white transition-colors"
                    >
                      Start
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
