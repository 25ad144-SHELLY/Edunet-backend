import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Data Store
const DEMO_USERS = {
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

const SKILL_TESTS = [
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
  }
];

const INTERNSHIPS = [
  {
    id: 'int-1',
    title: 'Frontend Intern',
    company: 'TechCorp Inc.',
    location: 'Remote',
    type: 'Remote',
    stipend: '₹2,500/mo',
    duration: '6 Months',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    matchScore: 94
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
    matchScore: 88
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
    matchScore: 82
  }
];

const FDP_PROGRAMS = [
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
  }
];

// Routes

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', platform: 'Edunet Academia-Industry Collaboration Portal', version: '1.0.0' });
});

// 2. Authentication Route
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { role, email } = req.body;
  if (!role || !['student', 'institute', 'industry'].includes(role)) {
    return res.status(400).json({ error: 'Valid role (student, institute, industry) is required.' });
  }

  const baseUser = DEMO_USERS[role as keyof typeof DEMO_USERS];
  const user = {
    ...baseUser,
    email: email || baseUser.email
  };

  res.json({
    success: true,
    token: `edunet_jwt_token_${role}_${Date.now()}`,
    user
  });
});

// 3. Skill Assessments
app.get('/api/assessments/tests', (req: Request, res: Response) => {
  res.json({ tests: SKILL_TESTS });
});

// 4. Internships
app.get('/api/internships', (req: Request, res: Response) => {
  res.json({ internships: INTERNSHIPS });
});

app.post('/api/internships/apply', (req: Request, res: Response) => {
  const { internshipId, studentId } = req.body;
  res.json({
    success: true,
    message: `Application submitted successfully for internship ${internshipId}`,
    appliedAt: new Date().toISOString()
  });
});

// 5. Faculty & Academic FDPs
app.get('/api/academics/fdp', (req: Request, res: Response) => {
  res.json({ programs: FDP_PROGRAMS });
});

app.listen(PORT, () => {
  console.log(`[Edunet Backend Server] running on http://localhost:${PORT}`);
});
