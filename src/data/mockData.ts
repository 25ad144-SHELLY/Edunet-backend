import type { SkillTest, Internship, FDPProgram, User } from '../types';

export const DEMO_USERS: Record<string, User> = {
  student: {
    id: 'usr_student_01',
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    role: 'student',
    title: 'Computer Science Undergrad (Final Year)',
    organization: 'Apex Institute of Technology',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  institute: {
    id: 'usr_institute_01',
    name: 'Dr. Katherine Vance',
    email: 'k.vance@apex-tech.edu',
    role: 'institute',
    title: 'Dean of Academics & Placement Head',
    organization: 'Apex Institute of Technology',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  industry: {
    id: 'usr_industry_01',
    name: 'Marcus Sterling',
    email: 'marcus.s@techcorp.io',
    role: 'industry',
    title: 'Head of University Relations & Talent Acquisition',
    organization: 'TechCorp Solutions',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
};

export const MOCK_SKILL_TESTS: SkillTest[] = [
  {
    id: 'test-1',
    title: 'React Fundamentals',
    description: 'Test your knowledge of hooks, components, lifecycle and state management.',
    duration: '45 mins',
    difficulty: 'Intermediate',
    questionsCount: 30,
    category: 'Frontend Engineering'
  },
  {
    id: 'test-2',
    title: 'Advanced CSS',
    description: 'Flexbox, Grid layout systems, container queries, and responsive design patterns.',
    duration: '30 mins',
    difficulty: 'Intermediate',
    questionsCount: 25,
    category: 'UI/UX & Web'
  },
  {
    id: 'test-3',
    title: 'JavaScript ES6+',
    description: 'Modern syntax, asynchronous promises, closures, prototypes, and event loops.',
    duration: '60 mins',
    difficulty: 'Advanced',
    questionsCount: 40,
    category: 'Web Core'
  },
  {
    id: 'test-4',
    title: 'System Design & APIs',
    description: 'RESTful architectures, microservices communication, caching, and rate limiting.',
    duration: '50 mins',
    difficulty: 'Advanced',
    questionsCount: 35,
    category: 'Backend Engineering'
  },
  {
    id: 'test-5',
    title: 'Python for Data Science',
    description: 'Pandas, NumPy operations, exploratory data analysis, and statistical testing.',
    duration: '45 mins',
    difficulty: 'Intermediate',
    questionsCount: 30,
    category: 'Data & AI'
  },
  {
    id: 'test-6',
    title: 'Cloud & DevOps Fundamentals',
    description: 'Docker containerization, CI/CD deployment pipelines, and cloud security basics.',
    duration: '40 mins',
    difficulty: 'Intermediate',
    questionsCount: 25,
    category: 'Cloud & Infrastructure'
  }
];

export const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: 'int-1',
    title: 'Frontend Intern',
    company: 'TechCorp Inc.',
    location: 'Remote',
    type: 'Remote',
    stipend: '₹2,500/mo',
    duration: '6 Months',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    matchScore: 94,
    featured: true
  },
  {
    id: 'int-2',
    title: 'UI Developer',
    company: 'Design Studio',
    location: 'New York, NY',
    type: 'Hybrid',
    stipend: '₹2,800/mo',
    duration: '3 Months',
    skills: ['HTML/CSS', 'Figma', 'JavaScript'],
    matchScore: 88,
    featured: true
  },
  {
    id: 'int-3',
    title: 'Web Dev Intern',
    company: 'StartupFlow',
    location: 'Remote',
    type: 'Remote',
    stipend: '₹2,200/mo',
    duration: '4 Months',
    skills: ['JavaScript', 'Vue', 'Node.js'],
    matchScore: 82,
    featured: true
  },
  {
    id: 'int-4',
    title: 'AI & Data Engineering Intern',
    company: 'NeuralStack Labs',
    location: 'San Francisco, CA',
    type: 'On-site',
    stipend: '₹3,500/mo',
    duration: '6 Months',
    skills: ['Python', 'PyTorch', 'SQL'],
    matchScore: 78
  },
  {
    id: 'int-5',
    title: 'Full Stack Cloud Apprentice',
    company: 'Apex Cloud Systems',
    location: 'Austin, TX',
    type: 'Hybrid',
    stipend: '₹2,700/mo',
    duration: '6 Months',
    skills: ['Go', 'React', 'Docker', 'AWS'],
    matchScore: 91
  }
];

export const MOCK_FDP_PROGRAMS: FDPProgram[] = [
  {
    id: 'fdp-1',
    title: 'Industry Immersion & Microservices in Production',
    organization: 'TechCorp Solutions',
    duration: '4 Weeks',
    type: 'Faculty Internship',
    skillsCovered: ['Kubernetes', 'Distributed Systems', 'Observability'],
    spots: 15
  },
  {
    id: 'fdp-2',
    title: 'Applied Generative AI in Enterprise Solutions',
    organization: 'NeuralStack Labs',
    duration: '2 Weeks',
    type: 'FDP',
    skillsCovered: ['LLM Orchestration', 'RAG Architectures', 'Model Evaluation'],
    spots: 30
  },
  {
    id: 'fdp-3',
    title: 'Industry-Sponsored Curriculum Modernization Track',
    organization: 'Global Tech Consortium',
    duration: '8 Weeks',
    type: 'Consultancy',
    skillsCovered: ['Outcome-Based Education', 'Industry 4.0 Labs', 'Capstones'],
    spots: 20
  }
];

export const MOCK_ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: "When should you prefer the `useCallback` hook in a React component?",
    category: "Technical" as const,
    options: [
      "To memoize expensive mathematical computations synchronously",
      "To maintain referential equality of a function passed to memoized child components",
      "To trigger a DOM reflow whenever a dependency changes",
      "To execute asynchronous side effects after initial mount"
    ],
    correctIndex: 1
  },
  {
    id: 2,
    question: "In a collaborative agile sprint, how do you handle an unexpected API breaking change from another service team?",
    category: "Soft Skills" as const,
    options: [
      "Wait until sprint retrospective to report the roadblock",
      "Immediately sync with the producer team, negotiate fallback contract, and update integration stubs",
      "Halt local development and switch to an unrelated backlog task without informing anyone",
      "Override local types to ignore the backend schema mismatch"
    ],
    correctIndex: 1
  },
  {
    id: 3,
    question: "Which CSS feature enables styling a parent element based on its descendants without JavaScript?",
    category: "Technical" as const,
    options: [
      ":is() pseudo-class",
      ":has() relational pseudo-class",
      "@container query rules",
      ":nth-child(even of .active)"
    ],
    correctIndex: 1
  }
];
