declare module '*.jsx' {
  import React from 'react';
  const Component: React.ComponentType<any>;
  export default Component;
  export const StudentProfile: React.ComponentType<any>;
  export const SkillTests: React.ComponentType<any>;
  export const Internships: React.ComponentType<any>;
  export const Settings: React.ComponentType<any>;
  export const AIRoadmap: React.ComponentType<any>;
}
