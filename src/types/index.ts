export type UserRole = 'student' | 'institute' | 'industry';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organization?: string;
  title?: string;
}

export interface SkillTest {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionsCount: number;
  category: string;
}

export interface SkillProgress {
  skill: string;
  level: number; // 0-100
  target: number;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  stipend: string;
  duration: string;
  skills: string[];
  matchScore?: number;
  featured?: boolean;
}

export interface FDPProgram {
  id: string;
  title: string;
  organization: string;
  duration: string;
  type: 'Faculty Internship' | 'FDP' | 'Industry Research' | 'Consultancy';
  skillsCovered: string[];
  spots: number;
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  category: 'Technical' | 'Soft Skills' | 'Domain Problem Solving';
  options: string[];
  correctIndex?: number;
}
