import { calculateSkillGaps } from './skillGap';
import type { SkillGapItem } from './skillGap';

export type ReadinessLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CareerReadinessResult {
  career: string;
  readinessScore: number;
  strengths: string[];
  skillGaps: SkillGapItem[];
  level: ReadinessLevel;
}

/**
 * Helper to classify the student's career readiness score into industry tiers:
 * - 0–39  → Beginner
 * - 40–69 → Intermediate
 * - 70–100 → Advanced
 */
function classifyReadinessLevel(score: number): ReadinessLevel {
  if (score >= 70) {
    return 'Advanced';
  }
  if (score >= 40) {
    return 'Intermediate';
  }
  return 'Beginner';
}

/**
 * Calculates a student's overall career readiness score by comparing their
 * current skill proficiency against the target requirements for a selected career.
 *
 * @param studentSkills - Record of student skills (0–100).
 * @param careerName - The target career (e.g. "Frontend Developer").
 * @returns CareerReadinessResult containing the readiness score, level, gaps, and strengths.
 */
export function calculateCareerReadiness(
  studentSkills: Record<string, number> = {},
  careerName: string
): CareerReadinessResult {
  // Use calculateSkillGaps to get standardized gaps and strengths
  const gapAnalysis = calculateSkillGaps(studentSkills, careerName);
  const { career, skillGaps, strengths } = gapAnalysis;

  if (!skillGaps || skillGaps.length === 0) {
    return {
      career: career || careerName || 'Unknown Career',
      readinessScore: 0,
      strengths: [],
      skillGaps: [],
      level: 'Beginner'
    };
  }

  // Calculate individual skill contributions capped at 100%
  let totalContribution = 0;

  for (const gapItem of skillGaps) {
    const rawStudentLevel = gapItem.currentLevel;
    // Clamp student level between 0 and 100
    const clampedStudentLevel = Math.max(0, Math.min(rawStudentLevel, 100));
    const requiredLevel = gapItem.requiredLevel;

    if (requiredLevel > 0) {
      const contributionRatio = (clampedStudentLevel / requiredLevel) * 100;
      const cappedContribution = Math.min(contributionRatio, 100);
      totalContribution += cappedContribution;
    }
  }

  // Average contribution across all required skills
  const averageScore = totalContribution / skillGaps.length;
  const readinessScore = Math.round(Math.max(0, Math.min(averageScore, 100)));
  const level = classifyReadinessLevel(readinessScore);

  return {
    career,
    readinessScore,
    strengths,
    skillGaps,
    level
  };
}
