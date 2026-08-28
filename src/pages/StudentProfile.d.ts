import React from 'react';
import type { User } from '../types';

export interface StudentProfileProps {
  user: User;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
  onBackToLanding?: () => void;
}

export declare const StudentProfile: React.FC<StudentProfileProps>;
export default StudentProfile;
