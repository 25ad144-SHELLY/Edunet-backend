import React from 'react';
import type { User } from '../types';

export interface InternshipsProps {
  user: User;
  initialInternshipId?: string | null;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
  onBackToLanding?: () => void;
}

export declare const Internships: React.FC<InternshipsProps>;
export default Internships;
