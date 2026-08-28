import React from 'react';
import type { User } from '../types';

export interface SettingsProps {
  user: User;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
  onBackToLanding?: () => void;
}

export declare const Settings: React.FC<SettingsProps>;
export default Settings;
