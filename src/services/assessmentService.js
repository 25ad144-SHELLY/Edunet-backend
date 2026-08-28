import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Assessment & Skill Profiling Service
 * Connected to Firebase Firestore:
 * - collection: users/{uid}/assessments/{assessmentId}
 * - doc: users/{uid} -> updates skills, activityCalendar, completedTests
 */

export const SKILL_TESTS_DATA = [
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals',
    category: 'Technical',
    difficulty: 'Intermediate',
    description: 'Test your knowledge of hooks, components and state management.',
    duration: '45 mins',
    questionsCount: 30,
    progress: 65,
    skillsEvaluated: ['React', 'Component Lifecycle', 'State & Props', 'Hooks'],
    previousScore: 85,
    sampleQuestions: [
      {
        id: 1,
        question: 'When should you prefer the `useCallback` hook in a React component?',
        options: [
          'To memoize expensive mathematical computations synchronously',
          'To maintain referential equality of a function passed to memoized child components',
          'To trigger a DOM reflow whenever a dependency changes',
          'To execute asynchronous side effects after initial mount'
        ],
        correctIndex: 1,
        skill: 'React'
      },
      {
        id: 2,
        question: 'How does React 18 automatic batching improve state updates?',
        options: [
          'It groups multiple setState calls inside promises, timeouts, and native event handlers into a single re-render',
          'It prevents child components from ever re-rendering',
          'It replaces the virtual DOM with direct DOM manipulation',
          'It forces all state updates to occur synchronously'
        ],
        correctIndex: 0,
        skill: 'State & Props'
      },
      {
        id: 3,
        question: 'What is the primary difference between `useMemo` and `useCallback`?',
        options: [
          'useMemo returns a memoized value; useCallback returns a memoized function',
          'useMemo only runs in server-side rendering',
          'useCallback can only be used with custom hooks',
          'There is no functional difference'
        ],
        correctIndex: 0,
        skill: 'Hooks'
      }
    ]
  },
  {
    id: 'javascript-es6',
    title: 'JavaScript ES6+',
    category: 'Technical',
    difficulty: 'Intermediate',
    description: 'Modern syntax, promises and asynchronous programming.',
    duration: '60 mins',
    questionsCount: 40,
    progress: 80,
    skillsEvaluated: ['JavaScript', 'ES6+ Syntax', 'Async/Await', 'Closures'],
    previousScore: 88,
    sampleQuestions: [
      {
        id: 1,
        question: 'What is the output of `[1, 2, 3].map(parseInt)` in standard JavaScript engines?',
        options: [
          '[1, 2, 3]',
          '[1, NaN, NaN]',
          '[1, 0, 0]',
          '[NaN, NaN, NaN]'
        ],
        correctIndex: 1,
        skill: 'JavaScript'
      },
      {
        id: 2,
        question: 'Which statement accurately describes JavaScript event loop microtasks?',
        options: [
          'Microtasks (e.g. Promise.then, queueMicrotask) execute before the next macrotask (e.g. setTimeout)',
          'Microtasks execute on a separate OS background thread',
          'Microtasks are throttled to 60fps',
          'Microtasks only run when the browser tab is focused'
        ],
        correctIndex: 0,
        skill: 'Async/Await'
      }
    ]
  },
  {
    id: 'advanced-css',
    title: 'Advanced CSS',
    category: 'Technical',
    difficulty: 'Advanced',
    description: 'Flexbox, Grid and responsive design patterns.',
    duration: '30 mins',
    questionsCount: 25,
    progress: 30,
    skillsEvaluated: ['CSS Grid', 'Flexbox', 'Responsive Design', 'Container Queries'],
    previousScore: 78,
    sampleQuestions: [
      {
        id: 1,
        question: 'Which CSS relational pseudo-class allows styling parent elements based on child conditions?',
        options: [
          ':is()',
          ':has()',
          ':where()',
          ':nth-child()'
        ],
        correctIndex: 1,
        skill: 'CSS Grid'
      }
    ]
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving',
    category: 'Soft Skills',
    difficulty: 'Advanced',
    description: 'Algorithmic thinking, edge case analysis, and structured debugging under constraints.',
    duration: '45 mins',
    questionsCount: 30,
    progress: 50,
    skillsEvaluated: ['Problem Solving', 'Analytical Reasoning', 'Debugging'],
    previousScore: 75,
    sampleQuestions: [
      {
        id: 1,
        question: 'When discovering a rare, non-reproducible race condition in production, what is the best initial diagnostic step?',
        options: [
          'Immediately restart all service instances',
          'Add structured telemetry/trace IDs and log timestamps with millisecond precision around shared resource access',
          'Revert the entire quarterly release without root cause investigation',
          'Increase the server hardware tier'
        ],
        correctIndex: 1,
        skill: 'Problem Solving'
      }
    ]
  },
  {
    id: 'communication-skills',
    title: 'Communication Skills',
    category: 'Soft Skills',
    difficulty: 'Intermediate',
    description: 'Stakeholder management, clear documentation, and cross-functional syncs.',
    duration: '30 mins',
    questionsCount: 20,
    progress: 80,
    skillsEvaluated: ['Communication', 'Team Collaboration', 'Technical Writing'],
    previousScore: 90,
    sampleQuestions: [
      {
        id: 1,
        question: 'When communicating an API breaking change to dependent engineering teams, which approach minimizes risk?',
        options: [
          'Push changes directly and update the docs afterwards',
          'Publish a deprecation timeline, provide versioned endpoints, and host an integration sync',
          'Mention it casually in a general Slack channel',
          'Silence compiler errors with fallback fall-throughs'
        ],
        correctIndex: 1,
        skill: 'Communication'
      }
    ]
  },
  {
    id: 'git-github',
    title: 'Git & GitHub',
    category: 'Technical',
    difficulty: 'Beginner',
    description: 'Branching strategies, merge conflicts, pull requests, and clean commit hygiene.',
    duration: '30 mins',
    questionsCount: 25,
    progress: 45,
    skillsEvaluated: ['Git Workflows', 'Merge Conflicts', 'Rebase & Cherry-pick'],
    previousScore: 70,
    sampleQuestions: [
      {
        id: 1,
        question: 'What is the key advantage of `git merge --ff-only`?',
        options: [
          'It guarantees a straight linear commit history without creating extra merge commits',
          'It deletes the origin remote automatically',
          'It bypasses pre-commit linters',
          'It stages all untracked files'
        ],
        correctIndex: 0,
        skill: 'Git Workflows'
      }
    ]
  },
  {
    id: 'database-fundamentals',
    title: 'Database Fundamentals',
    category: 'Technical',
    difficulty: 'Intermediate',
    description: 'Relational schemas, SQL queries, indexing, and normalization.',
    duration: '45 mins',
    questionsCount: 30,
    progress: 0,
    skillsEvaluated: ['SQL', 'Indexing', 'Normalization', 'ACID Properties'],
    previousScore: null,
    sampleQuestions: [
      {
        id: 1,
        question: 'What type of index is most suitable for range queries (e.g. BETWEEN or > comparisons)?',
        options: [
          'Hash Index',
          'B-Tree Index',
          'Full-text Index',
          'Spatial Index'
        ],
        correctIndex: 1,
        skill: 'Indexing'
      }
    ]
  },
  {
    id: 'python-fundamentals',
    title: 'Python Fundamentals',
    category: 'Technical',
    difficulty: 'Beginner',
    description: 'Data structures, OOP, list comprehensions, and standard libraries.',
    duration: '40 mins',
    questionsCount: 25,
    progress: 0,
    skillsEvaluated: ['Python', 'OOP', 'List Comprehensions', 'Data Structures'],
    previousScore: null,
    sampleQuestions: [
      {
        id: 1,
        question: 'What is the time complexity of lookup in a standard Python `dict` on average?',
        options: [
          'O(n)',
          'O(1)',
          'O(log n)',
          'O(n log n)'
        ],
        correctIndex: 1,
        skill: 'Python'
      }
    ]
  },
  {
    id: 'data-structures',
    title: 'Data Structures',
    category: 'Technical',
    difficulty: 'Advanced',
    description: 'Trees, graphs, heaps, dynamic programming, and complexity analysis.',
    duration: '60 mins',
    questionsCount: 40,
    progress: 0,
    skillsEvaluated: ['Algorithms', 'Data Structures', 'Time Complexity', 'Trees & Graphs'],
    previousScore: null,
    sampleQuestions: [
      {
        id: 1,
        question: 'Which data structure is optimal for implementing an efficient Priority Queue with O(log n) insertions?',
        options: [
          'Binary Heap',
          'Linked List',
          'Dynamic Array',
          'Hash Table'
        ],
        correctIndex: 0,
        skill: 'Algorithms'
      }
    ]
  }
];

/**
 * Retrieves all completed assessments for a student from Firestore:
 * users/{uid}/assessments
 */
export async function getUserAssessments(uid) {
  if (!uid) return [];
  try {
    const assessmentsRef = collection(db, 'users', uid, 'assessments');
    const snapshot = await getDocs(assessmentsRef);
    const assessments = [];
    snapshot.forEach((docSnap) => {
      assessments.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });
    return assessments;
  } catch (err) {
    console.error('Error fetching user assessments from Firestore:', err);
    return [];
  }
}

/**
 * Submits an assessment result and saves to Firestore:
 * 1. users/{uid}/assessments/{assessmentId}
 * 2. Updates users/{uid}.skills with updated score proficiency
 */
export async function submitAssessmentResult(uid, testId, userAnswers, score, testTitle, skillsEvaluated) {
  const assessmentId = `asmt_${Date.now()}`;
  const effectiveUid = uid || 'usr_student_01';

  const assessmentResult = {
    assessmentId,
    testId,
    testTitle: testTitle || testId,
    uid: effectiveUid,
    score,
    userAnswers: userAnswers || {},
    skillsEvaluated: skillsEvaluated || ['Technical'],
    completedAt: new Date().toISOString(),
    timestamp: Date.now()
  };

  try {
    // 1. Save to subcollection: users/{uid}/assessments/{assessmentId}
    const docRef = doc(db, 'users', effectiveUid, 'assessments', assessmentId);
    await setDoc(docRef, assessmentResult);

    // 2. Map testId to skill names and update user profile skill record in Firestore
    const skillMapping = {
      'react-fundamentals': 'React',
      'javascript-es6': 'JavaScript',
      'advanced-css': 'CSS',
      'git-github': 'Git',
      'problem-solving': 'Problem Solving',
      'communication-skills': 'Communication',
      'database-fundamentals': 'SQL',
      'python-fundamentals': 'Python'
    };

    const targetSkill = skillMapping[testId];
    if (targetSkill) {
      const userRef = doc(db, 'users', effectiveUid);
      try {
        await updateDoc(userRef, {
          [`skills.${targetSkill}`]: score,
          lastAssessmentDate: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        // If document doesn't exist yet, merge
        await setDoc(userRef, {
          skills: { [targetSkill]: score },
          lastAssessmentDate: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    }
  } catch (err) {
    console.error('Error saving assessment result to Firestore:', err);
  }

  return assessmentResult;
}
