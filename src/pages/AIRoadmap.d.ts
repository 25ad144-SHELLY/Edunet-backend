import React from 'react';
import type { User } from '../types';

export interface AIRoadmapProps {
  user: User;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
  onBackToLanding?: () => void;
}

export declare const AIRoadmap: React.FC<AIRoadmapProps>;
export default AIRoadmap;
