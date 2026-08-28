import React from 'react';
import type { User } from '../types';

export interface SkillTestsProps {
  user: User;
  initialTestId?: string | null;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
  onBackToLanding?: () => void;
}

export declare const SkillTests: React.FC<SkillTestsProps>;
export default SkillTests;
