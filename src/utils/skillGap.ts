import { careerRequirements } from '../data/careerRequirements';

export type GapPriority = 'High' | 'Medium' | 'Low';

export interface SkillGapItem {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: GapPriority;
}

export interface SkillGapAnalysisResult {
  career: string;
  skillGaps: SkillGapItem[];
  strengths: string[];
}

/**
 * Helper to safely extract a student's proficiency level for a skill,
 * supporting exact matches and case-insensitive/compound keys.
 */
function getStudentSkillLevel(studentSkills: Record<string, number> = {}, targetSkill: string): number {
  if (!studentSkills || typeof studentSkills !== 'object') {
    return 0;
  }

  // 1. Direct exact match
  if (typeof studentSkills[targetSkill] === 'number') {
    return studentSkills[targetSkill];
  }

  // 2. Case-insensitive match
  const normalizedTarget = targetSkill.toLowerCase().trim();
  for (const [key, value] of Object.entries(studentSkills)) {
    if (key.toLowerCase().trim() === normalizedTarget) {
      return typeof value === 'number' ? value : 0;
    }
  }

  // 3. Common composite matches (e.g. "HTML/CSS" covering "HTML" or "CSS")
  for (const [key, value] of Object.entries(studentSkills)) {
    const normKey = key.toLowerCase();
    if (normKey.includes(normalizedTarget) || normalizedTarget.includes(normKey)) {
      return typeof value === 'number' ? value : 0;
    }
  }

  return 0;
}

/**
 * Calculates skill gaps and strengths by comparing student skills
 * against benchmark industry requirements for a target career.
 *
 * @param studentSkills - Record of student skills with proficiency from 0–100.
 * @param careerName - The target career role (e.g., "Frontend Developer").
 * @returns SkillGapAnalysisResult with sorted skill gaps and strengths.
 */
export function calculateSkillGaps(
  studentSkills: Record<string, number> = {},
  careerName: string
): SkillGapAnalysisResult {
  if (!careerName || typeof careerName !== 'string') {
    return {
      career: careerName || 'Unknown Career',
      skillGaps: [],
      strengths: []
    };
  }

  const trimmedCareer = careerName.trim();
  const lowerCareer = trimmedCareer.toLowerCase();

  // 1. Find exact or case-insensitive match
  let matchedCareerKey: string | undefined = Object.keys(careerRequirements).find(
    (key) => key.toLowerCase() === lowerCareer
  );

  // 2. Find partial / substring match (e.g., "frontend" -> "Frontend Developer")
  if (!matchedCareerKey) {
    matchedCareerKey = Object.keys(careerRequirements).find(
      (key) => lowerCareer.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerCareer)
    );
  }

  let requiredSkills: Record<string, number>;

  if (matchedCareerKey && careerRequirements[matchedCareerKey]?.skills) {
    requiredSkills = careerRequirements[matchedCareerKey].skills;
  } else {
    // 3. Dynamic synthesis for arbitrary custom career inputs
    matchedCareerKey = trimmedCareer;
    requiredSkills = {
      ProblemSolving: 80,
      Git: 75,
      APIs: 75,
      SystemDesign: 70,
      JavaScript: 75,
      Python: 70
    };
  }

  const skillGaps: SkillGapItem[] = [];
  const strengths: string[] = [];

  for (const [skill, requiredLevel] of Object.entries(requiredSkills)) {
    const currentLevel = getStudentSkillLevel(studentSkills, skill);
    const gap = Math.max(requiredLevel - currentLevel, 0);

    // Classify priority based on gap size
    let priority: GapPriority;
    if (gap >= 30) {
      priority = 'High';
    } else if (gap >= 15) {
      priority = 'Medium';
    } else {
      priority = 'Low';
    }

    // Check if the student meets or exceeds target level
    if (currentLevel >= requiredLevel) {
      strengths.push(skill);
    }

    skillGaps.push({
      skill,
      currentLevel,
      requiredLevel,
      gap,
      priority
    });
  }

  // Sort results by largest gap first
  skillGaps.sort((a, b) => b.gap - a.gap);

  return {
    career: matchedCareerKey,
    skillGaps,
    strengths
  };
}
