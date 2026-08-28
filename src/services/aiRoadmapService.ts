import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { calculateSkillGaps } from '../utils/skillGap';
import { calculateCareerReadiness } from '../utils/careerReadiness';
import { getStudentProfile } from './profileService';
import { getUserAssessments } from './assessmentService';
import type { SkillGapItem } from '../utils/skillGap';
import type { ReadinessLevel } from '../utils/careerReadiness';

export interface LearningMilestone {
  week: string;
  title: string;
  focusSkill: string;
  priority: 'High' | 'Medium' | 'Low';
  topics: string[];
  practiceTask: string;
  milestoneGoal: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
}

export interface RecommendedProject {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  reason: string;
}

export interface CareerRoadmapData {
  uid: string;
  targetCareer: string;
  careerSummary: string;
  readinessScore: number;
  level: ReadinessLevel;
  strengths: string[];
  skillGaps: SkillGapItem[];
  highPriorityGaps: SkillGapItem[];
  mediumPriorityGaps: SkillGapItem[];
  milestones: LearningMilestone[];
  learningOrder: string[];
  projects: RecommendedProject[];
  aiInsight: string;
  generatedAt: string;
  lastUpdated: string;
}

// In-memory cache for ultra-fast local state transitions
const ROADMAP_CACHE = new Map<string, CareerRoadmapData>();

/**
 * Topic & Task Knowledge Map for generating deterministic, realistic milestones
 */
const SKILL_MILESTONE_KNOWLEDGE: Record<string, { topics: string[]; task: string; goal: string }> = {
  React: {
    topics: ['Components & Props', 'Hooks (useState, useEffect, useMemo)', 'Custom Hooks', 'State Management'],
    task: 'Build a modular React dashboard with custom hooks and persistent state.',
    goal: 'Demonstrate competency in React architecture and hook lifecycle.'
  },
  JavaScript: {
    topics: ['ES6+ Syntax', 'Closures & Scopes', 'Asynchronous JS (Promises, Async/Await)', 'Event Loop & Microtasks'],
    task: 'Implement an asynchronous data fetcher with caching, retries, and debouncing.',
    goal: 'Master core JavaScript runtime execution and async paradigms.'
  },
  HTML: {
    topics: ['Semantic HTML5', 'Accessibility (ARIA)', 'SEO Optimization', 'Web Forms & Validation'],
    task: 'Audit and rebuild an accessible web form with standard ARIA live regions.',
    goal: 'Achieve 100% Lighthouse accessibility and semantic standard.'
  },
  CSS: {
    topics: ['CSS Grid & Flexbox', 'Container Queries & Responsive Design', 'Animations & Transitions', 'Modern CSS Architecture'],
    task: 'Create a responsive, multi-breakpoint dashboard layout with container queries.',
    goal: 'Build fluid, high-performance web layouts across all viewport sizes.'
  },
  Git: {
    topics: ['Branching & Merging', 'Resolving Merge Conflicts', 'Interactive Rebase & Cherry-pick', 'PR Reviews & CI Workflows'],
    task: 'Create a multi-branch repository flow with pull request template and merge checks.',
    goal: 'Establish clean commit hygiene and collaborative git workflows.'
  },
  APIs: {
    topics: ['RESTful API Design', 'HTTP Methods & Status Codes', 'Authentication (JWT/OAuth)', 'Rate Limiting & Caching'],
    task: 'Connect frontend to REST endpoints with optimistic updates and error boundaries.',
    goal: 'Build robust client-server data synchronization pipelines.'
  },
  Testing: {
    topics: ['Unit Testing with Vitest/Jest', 'Component Testing with React Testing Library', 'End-to-End Testing (Playwright)', 'Mocking & Spies'],
    task: 'Write comprehensive unit and integration tests covering >80% code branches.',
    goal: 'Ensure software regression resilience and test coverage.'
  },
  Python: {
    topics: ['OOP & Data Structures', 'List Comprehensions & Generators', 'Decorators & Context Managers', 'Standard Libraries'],
    task: 'Build an automated CLI tool with modular Python classes and type annotations.',
    goal: 'Master idiomatic, object-oriented Python scripting.'
  },
  SQL: {
    topics: ['Complex Joins & Aggregations', 'Subqueries & CTEs', 'Indexing & Query Optimization', 'Transactions & ACID'],
    task: 'Design a normalized relational schema and optimize slow queries with explain analyze.',
    goal: 'Execute high-performance database schema design and querying.'
  },
  NodeJS: {
    topics: ['Event Loop & Streams', 'Express / Fastify Frameworks', 'Middleware Architecture', 'Error Handling & Logging'],
    task: 'Build a secure REST API backend with rate limiting and structured error handling.',
    goal: 'Deploy performant server-side JavaScript applications.'
  },
  MachineLearning: {
    topics: ['Supervised & Unsupervised Learning', 'Model Evaluation & Cross-Validation', 'Scikit-Learn Pipelines', 'Feature Engineering'],
    task: 'Train and evaluate a classification model with cross-validation and feature scaling.',
    goal: 'Deliver production-ready predictive ML pipelines.'
  },
  DeepLearning: {
    topics: ['Neural Network Architectures', 'Backpropagation & Optimizers', 'PyTorch Tensors', 'Transfer Learning'],
    task: 'Fine-tune a deep neural network on a benchmark dataset using PyTorch.',
    goal: 'Construct and optimize deep neural models.'
  },
  DataVisualization: {
    topics: ['Chart Design Principles', 'Tableau / PowerBI Dashboards', 'D3.js / Recharts', 'Data Storytelling'],
    task: 'Build an interactive multi-metric analytics dashboard with filtering.',
    goal: 'Communicate complex data insights effectively to stakeholders.'
  },
  Statistics: {
    topics: ['Descriptive & Inferential Statistics', 'Hypothesis Testing (A/B Testing)', 'Probability Distributions', 'Regression Models'],
    task: 'Perform an A/B test analysis with statistical significance calculations.',
    goal: 'Drive data-backed product and business decisions.'
  }
};

/**
 * Generates tailored project recommendations based on student's missing skills
 */
function generateTargetedProjects(targetCareer: string, gaps: SkillGapItem[]): RecommendedProject[] {
  const topGapSkills = gaps.slice(0, 3).map(g => g.skill);

  if (targetCareer.toLowerCase().includes('frontend')) {
    return [
      {
        title: 'Job Application & Skill Tracker',
        difficulty: 'Intermediate',
        skills: ['React', 'Git', 'APIs', 'CSS'],
        reason: 'Directly bridges your gaps in React hooks, Git collaboration, and REST API integration while delivering a portfolio asset.'
      },
      {
        title: 'Component Design System Library',
        difficulty: 'Advanced',
        skills: ['React', 'CSS', 'Testing'],
        reason: 'Solidifies modern CSS container queries, component composition, and comprehensive unit testing.'
      },
      {
        title: 'Developer Portfolio with Live Playground',
        difficulty: 'Intermediate',
        skills: ['JavaScript', 'HTML', 'CSS', 'Git'],
        reason: 'Highlights your strongest skills in HTML/CSS while showcasing clean Git version control.'
      }
    ];
  } else if (targetCareer.toLowerCase().includes('data') || targetCareer.toLowerCase().includes('ai')) {
    return [
      {
        title: 'Predictive Analytics Customer Churn Engine',
        difficulty: 'Intermediate',
        skills: ['Python', 'SQL', 'MachineLearning'],
        reason: 'Combines SQL data extraction with Scikit-learn predictive modeling to solve realistic business problems.'
      },
      {
        title: 'Automated ETL & Reporting Dashboard',
        difficulty: 'Advanced',
        skills: ['Python', 'SQL', 'DataVisualization'],
        reason: 'Targets key industry competencies in data pipelines, database indexing, and visual storytelling.'
      },
      {
        title: 'Real-Time Market Analytics Visualizer',
        difficulty: 'Intermediate',
        skills: ['SQL', 'DataVisualization', 'Statistics'],
        reason: 'Empowers exploratory data analysis and executive presentation standards.'
      }
    ];
  } else {
    return [
      {
        title: 'Fullstack Task & Workflow Platform',
        difficulty: 'Intermediate',
        skills: topGapSkills.length > 0 ? topGapSkills : ['NodeJS', 'SQL', 'APIs'],
        reason: `Specifically targets your priority gaps in ${topGapSkills.join(', ') || 'backend & databases'}.`
      },
      {
        title: 'Cloud-Ready Microservice API Gateway',
        difficulty: 'Advanced',
        skills: ['NodeJS', 'DatabaseDesign', 'Testing'],
        reason: 'Addresses high-level architecture, relational database design, and end-to-end integration testing.'
      }
    ];
  }
}

/**
 * Builds deterministic, structured learning milestones (8 Weeks)
 */
function buildMilestones(
  targetCareer: string,
  highGaps: SkillGapItem[],
  mediumGaps: SkillGapItem[],
  readinessScore: number
): LearningMilestone[] {
  const milestones: LearningMilestone[] = [];
  const allGaps = [...highGaps, ...mediumGaps];

  // Primary gap skill
  const primaryGap = allGaps[0]?.skill || 'React';
  const primaryKnowledge = SKILL_MILESTONE_KNOWLEDGE[primaryGap] || {
    topics: ['Core Fundamentals', 'Architecture Patterns', 'Best Practices', 'Hands-on Building'],
    task: `Build a functional prototype focusing on ${primaryGap} fundamentals.`,
    goal: `Close the ${primaryGap} competency gap.`
  };

  // Secondary gap skill
  const secondaryGap = allGaps[1]?.skill || 'Git';
  const secondaryKnowledge = SKILL_MILESTONE_KNOWLEDGE[secondaryGap] || {
    topics: ['Advanced Workflows', 'Integration Techniques', 'Optimization', 'Production Deployment'],
    task: `Implement a robust workflow applying ${secondaryGap}.`,
    goal: `Master practical ${secondaryGap} workflows.`
  };

  // Tertiary gap skill
  const tertiaryGap = allGaps[2]?.skill || 'APIs';
  const tertiaryKnowledge = SKILL_MILESTONE_KNOWLEDGE[tertiaryGap] || {
    topics: ['System Design', 'Performance', 'Testing & Verification', 'End-to-End Delivery'],
    task: `Integrate ${tertiaryGap} into an end-to-end project.`,
    goal: `Demonstrate industry-standard ${tertiaryGap} execution.`
  };

  milestones.push({
    week: 'Week 1–2',
    title: `${primaryGap} Core Mastery & Fundamentals`,
    focusSkill: primaryGap,
    priority: highGaps.some(g => g.skill === primaryGap) ? 'High' : 'Medium',
    topics: primaryKnowledge.topics,
    practiceTask: primaryKnowledge.task,
    milestoneGoal: primaryKnowledge.goal,
    status: readinessScore >= 75 ? 'Completed' : 'In Progress'
  });

  milestones.push({
    week: 'Week 3–4',
    title: `${secondaryGap} Workflows & Architecture`,
    focusSkill: secondaryGap,
    priority: highGaps.some(g => g.skill === secondaryGap) ? 'High' : 'Medium',
    topics: secondaryKnowledge.topics,
    practiceTask: secondaryKnowledge.task,
    milestoneGoal: secondaryKnowledge.goal,
    status: readinessScore >= 85 ? 'Completed' : 'Upcoming'
  });

  milestones.push({
    week: 'Week 5–6',
    title: `${tertiaryGap} Integration & Real-World Project`,
    focusSkill: tertiaryGap,
    priority: 'Medium',
    topics: tertiaryKnowledge.topics,
    practiceTask: tertiaryKnowledge.task,
    milestoneGoal: tertiaryKnowledge.goal,
    status: 'Upcoming'
  });

  milestones.push({
    week: 'Week 7',
    title: 'Production Verification & Testing Suite',
    focusSkill: 'Testing',
    priority: 'Low',
    topics: ['Unit Testing', 'Component Testing', 'End-to-End Scenarios', 'Code Quality Linters'],
    practiceTask: 'Write integration test cases covering core user paths and edge cases.',
    milestoneGoal: 'Achieve >80% test coverage and zero critical bugs.',
    status: 'Upcoming'
  });

  milestones.push({
    week: 'Week 8',
    title: 'Industry Portfolio & Interview Preparation',
    focusSkill: targetCareer,
    priority: 'Low',
    topics: ['Resume Tailoring', 'System Design Walkthroughs', 'Behavioral & Technical Mock Rounds', 'Portfolio Deployment'],
    practiceTask: 'Publish your capstone project with live demo and deploy to cloud hosting.',
    milestoneGoal: 'Ready for top-tier internship and job interviews.',
    status: 'Upcoming'
  });

  return milestones;
}

/**
 * Generates an AI Career Roadmap deterministically from student profile,
 * assessment results, skill gaps, and career readiness benchmarks, then saves to Firestore:
 * users/{uid}/roadmap/current
 */
export async function generateAndSaveRoadmap(
  uid: string,
  targetCareerOverride?: string
): Promise<CareerRoadmapData> {
  const effectiveUid = uid || 'usr_student_01';

  // 1. Fetch current profile and assessment data
  let profile = await getStudentProfile(effectiveUid).catch(() => null);
  const assessments = await getUserAssessments(effectiveUid).catch(() => []);

  const targetCareer = targetCareerOverride || profile?.careerGoal || 'Frontend Developer';
  const studentSkills = profile?.skills || {
    JavaScript: 75,
    React: 60,
    HTML: 90,
    CSS: 80,
    Git: 45
  };

  // 2. Perform standard Skill Gap Analysis
  const gapResult = calculateSkillGaps(studentSkills, targetCareer);
  const { skillGaps, strengths } = gapResult;

  // 3. Perform Career Readiness Calculation
  const readinessResult = calculateCareerReadiness(studentSkills, targetCareer);
  const { readinessScore, level } = readinessResult;

  // 4. Partition priority gaps
  const highPriorityGaps = skillGaps.filter(g => g.priority === 'High' && g.gap > 0);
  const mediumPriorityGaps = skillGaps.filter(g => g.priority === 'Medium' && g.gap > 0);

  // 5. Suggested learning order
  const learningOrder = skillGaps
    .filter(g => g.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .map(g => g.skill);

  // 6. Build tailored milestones
  const milestones = buildMilestones(targetCareer, highPriorityGaps, mediumPriorityGaps, readinessScore);

  // 7. Build recommended projects
  const projects = generateTargetedProjects(targetCareer, skillGaps);

  // 8. Generate personalized AI narrative insight
  let aiInsight = '';
  if (strengths.length > 0 && highPriorityGaps.length > 0) {
    const topGaps = highPriorityGaps.slice(0, 2).map(g => g.skill).join(' and ');
    aiInsight = `Your foundation in ${strengths.join(', ')} is solid. However, your ${topGaps} skills are below the industry baseline expected for a ${targetCareer}. Prioritize closing the ${highPriorityGaps[0].skill} gap in the next 2–3 weeks to elevate your career readiness score toward ${Math.min(readinessScore + 20, 100)}%.`;
  } else if (highPriorityGaps.length > 0) {
    aiInsight = `To meet the industry standards for a ${targetCareer}, your primary focus should be on ${highPriorityGaps[0].skill} (gap: ${highPriorityGaps[0].gap}%) and ${highPriorityGaps[1]?.skill || 'system design'}. Following the 8-week structured roadmap will help you qualify for competitive internships.`;
  } else {
    aiInsight = `Excellent progress! You have demonstrated strong competency across most core areas for a ${targetCareer}. Focus on advanced real-world project delivery and mock technical interviews.`;
  }

  const nowIso = new Date().toISOString();

  const roadmapData: CareerRoadmapData = {
    uid: effectiveUid,
    targetCareer,
    careerSummary: `Customized learning and competency plan for ${targetCareer}, updated with ${assessments.length} completed assessments.`,
    readinessScore,
    level,
    strengths,
    skillGaps,
    highPriorityGaps,
    mediumPriorityGaps,
    milestones,
    learningOrder,
    projects,
    aiInsight,
    generatedAt: nowIso,
    lastUpdated: nowIso
  };

  // Cache locally
  ROADMAP_CACHE.set(effectiveUid, roadmapData);

  // 9. Save / Update in Firestore: users/{uid}/roadmap/current (non-blocking)
  try {
    const roadmapDocRef = doc(db, 'users', effectiveUid, 'roadmap', 'current');
    setDoc(roadmapDocRef, roadmapData, { merge: true }).catch((err) => {
      console.warn('Firestore setDoc non-blocking warning:', err?.message || err);
    });
  } catch (err) {
    console.warn('Error queuing roadmap save to Firestore:', err);
  }

  return roadmapData;
}

/**
 * Retrieves the stored career roadmap for a student from Firestore:
 * users/{uid}/roadmap/current
 */
export async function getUserRoadmap(uid: string): Promise<CareerRoadmapData | null> {
  const effectiveUid = uid || 'usr_student_01';

  // Check in-memory cache first
  if (ROADMAP_CACHE.has(effectiveUid)) {
    return ROADMAP_CACHE.get(effectiveUid)!;
  }

  try {
    const roadmapDocRef = doc(db, 'users', effectiveUid, 'roadmap', 'current');
    const snap = await getDoc(roadmapDocRef);
    if (snap.exists()) {
      const data = snap.data() as CareerRoadmapData;
      ROADMAP_CACHE.set(effectiveUid, data);
      return data;
    }
  } catch (err) {
    console.warn('Firestore getDoc warning:', err);
  }

  return null;
}
