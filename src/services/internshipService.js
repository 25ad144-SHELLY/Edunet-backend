/**
 * Internship & Application Management Service
 * Structured for future connection to Firebase Firestore:
 * - collection: internships
 * - collection: applications/{applicationId}
 * 
 * Includes dynamic skill overlap and match percentage calculation engine.
 */

// Student default skills profile for comparison
export const STUDENT_SKILL_PROFILE = [
  'JavaScript',
  'HTML/CSS',
  'HTML',
  'CSS',
  'React',
  'Git',
  'Git & GitHub',
  'Problem Solving',
  'Communication'
];

export const INTERNSHIPS_DATA = [
  {
    id: 'int-frontend-dev',
    title: 'Frontend Developer Intern',
    companyName: 'Nexora Technologies',
    location: 'Remote',
    type: 'Remote',
    duration: '3 Months',
    stipend: '₹2,500/mo',
    description: 'Join our design-systems team to engineer high-performance React user interfaces and accessible component libraries.',
    responsibilities: [
      'Build reusable React components using Tailwind CSS and TypeScript',
      'Implement state management and integrate REST APIs',
      'Participate in sprint code reviews and git workflows',
      'Optimize web performance and Core Web Vitals'
    ],
    requiredSkills: ['React', 'JavaScript', 'HTML', 'Git'],
    postedBy: 'Nexora HR Team',
    applicantsCount: 42
  },
  {
    id: 'int-backend-dev',
    title: 'Backend Developer Intern',
    companyName: 'Vertex Cloud Systems',
    location: 'Austin, TX',
    type: 'Hybrid',
    duration: '6 Months',
    stipend: '₹3,000/mo',
    description: 'Work on distributed microservices, database schemas, and high-throughput background processing queues.',
    responsibilities: [
      'Design RESTful API endpoints and WebSocket listeners',
      'Write SQL queries, migrations, and database indexes in PostgreSQL',
      'Build unit and integration tests for microservice layers',
      'Assist in Dockerizing services and CI/CD pipelines'
    ],
    requiredSkills: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs'],
    postedBy: 'Vertex Engineering',
    applicantsCount: 38
  },
  {
    id: 'int-fullstack-dev',
    title: 'Full Stack Developer Intern',
    companyName: 'HyperScale Labs',
    location: 'Remote',
    type: 'Remote',
    duration: '4 Months',
    stipend: '₹2,800/mo',
    description: 'Build end-to-end full-stack features connecting modern frontend clients with scalable backend architectures.',
    responsibilities: [
      'Develop client-facing dashboards in React and TypeScript',
      'Implement serverless functions and database queries',
      'Automate integration testing and cross-browser QA',
      'Collaborate with product designers on UX specifications'
    ],
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'Git'],
    postedBy: 'HyperScale Talent',
    applicantsCount: 65
  },
  {
    id: 'int-react-dev',
    title: 'React Developer Intern',
    companyName: 'PixelCraft Studio',
    location: 'Remote',
    type: 'Remote',
    duration: '3 Months',
    stipend: '₹2,400/mo',
    description: 'Craft interactive, animations-rich dashboards and real-time collaborative workspaces in React.',
    responsibilities: [
      'Implement modern React hooks, context, and custom state patterns',
      'Collaborate with UI designers in Figma to translate mockups into code',
      'Ensure web accessibility (WCAG AA compliance) and responsive layouts',
      'Write clear technical documentation for client repositories'
    ],
    requiredSkills: ['React', 'JavaScript', 'HTML', 'Git'],
    postedBy: 'PixelCraft Studio',
    applicantsCount: 29
  },
  {
    id: 'int-swe-intern',
    title: 'Software Engineering Intern',
    companyName: 'Apex Robotics',
    location: 'San Francisco, CA',
    type: 'On-site',
    duration: '6 Months',
    stipend: '₹3,200/mo',
    description: 'Collaborate with robotics engineers on telemetry parsing, real-time control UI, and algorithmic optimization.',
    responsibilities: [
      'Write algorithms for spatial telemetry visualization',
      'Profile and optimize bottlenecks in execution pipelines',
      'Maintain reliable Git branching and automated builds',
      'Conduct hardware-in-the-loop testing protocols'
    ],
    requiredSkills: ['Data Structures', 'Python', 'Git', 'Problem Solving'],
    postedBy: 'Apex Robotics Labs',
    applicantsCount: 51
  },
  {
    id: 'int-web-dev',
    title: 'Web Development Intern',
    companyName: 'Stratum Media',
    location: 'New York, NY',
    type: 'Hybrid',
    duration: '3 Months',
    stipend: '₹2,200/mo',
    description: 'Develop publishing platforms, content portals, and performance-critical landing pages.',
    responsibilities: [
      'Structure semantic HTML, modular CSS, and vanilla JS interactions',
      'Implement SEO best practices and fast-loading web assets',
      'Integrate third-party analytics and form collection endpoints',
      'Perform cross-browser compatibility testing'
    ],
    requiredSkills: ['HTML', 'JavaScript', 'Git', 'Communication'],
    postedBy: 'Stratum Media Team',
    applicantsCount: 34
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-001',
    opportunityId: 'int-frontend-dev',
    opportunityTitle: 'Frontend Developer Intern',
    companyName: 'Nexora Technologies',
    location: 'Remote',
    appliedDate: 'Aug 27',
    status: 'Applied',
  },
  {
    id: 'app-002',
    opportunityId: 'int-backend-dev',
    opportunityTitle: 'Backend Developer Intern',
    companyName: 'Vertex Cloud Systems',
    location: 'Austin, TX',
    appliedDate: 'Aug 25',
    status: 'Under Review',
  }
];

/**
 * Calculates skill overlap and match percentage
 * @param {string[]} studentSkills 
 * @param {string[]} requiredSkills 
 */
export function calculateSkillMatch(studentSkills = STUDENT_SKILL_PROFILE, requiredSkills = []) {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { matchScore: 100, matchedCount: 0, totalCount: 0, matchedSkills: [], missingSkills: [] };
  }

  const normalizedStudent = studentSkills.map(s => s.toLowerCase());
  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(skill => {
    const isMatched = normalizedStudent.some(s => 
      s === skill.toLowerCase() || 
      s.includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(s)
    );
    if (isMatched) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const percentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return {
    matchScore: percentage,
    matchedCount: matchedSkills.length,
    totalCount: requiredSkills.length,
    matchedSkills,
    missingSkills
  };
}

/**
 * Submits an application for an internship opportunity
 * Future: connects to `db.collection('applications').add(...)`
 */
export async function submitInternshipApplication(studentId, internshipId, opportunity) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newApp = {
        id: `app-${Date.now()}`,
        studentId: studentId || 'usr_student_01',
        internshipId,
        opportunityId: internshipId,
        opportunityTitle: opportunity.title,
        companyName: opportunity.companyName,
        location: opportunity.location,
        appliedDate: 'Just now',
        status: 'Applied',
        appliedAt: new Date().toISOString()
      };
      resolve(newApp);
    }, 400);
  });
}
