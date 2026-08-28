import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface StudentProfileData {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'institute' | 'industry';
  careerGoal: string;
  university?: string;
  organization?: string;
  degree?: string;
  graduationYear?: string;
  avatar?: string;
  skills: Record<string, number>;
  softSkills?: Record<string, number>;
  completionRate?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_STUDENT_PROFILE: StudentProfileData = {
  uid: 'usr_student_01',
  name: 'Alex Chen',
  email: 'alex@example.com',
  role: 'student',
  careerGoal: 'Frontend Developer',
  university: 'Apex Institute of Technology',
  organization: 'Apex Institute of Technology',
  degree: 'B.Tech Computer Science',
  graduationYear: '2027',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  completionRate: 85,
  skills: {
    JavaScript: 75,
    React: 60,
    HTML: 90,
    CSS: 80,
    Git: 45
  },
  softSkills: {
    Communication: 80,
    Teamwork: 75,
    'Problem Solving': 70,
    Leadership: 60
  }
};

/**
 * Fetches the student profile from Firestore `users/{uid}`
 */
export async function getStudentProfile(uid: string): Promise<StudentProfileData> {
  if (!uid) return DEFAULT_STUDENT_PROFILE;

  try {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        uid,
        name: data.name || DEFAULT_STUDENT_PROFILE.name,
        email: data.email || DEFAULT_STUDENT_PROFILE.email,
        role: data.role || 'student',
        careerGoal: data.careerGoal || DEFAULT_STUDENT_PROFILE.careerGoal,
        university: data.university || data.organization || DEFAULT_STUDENT_PROFILE.university,
        organization: data.organization || data.university || DEFAULT_STUDENT_PROFILE.organization,
        degree: data.degree || DEFAULT_STUDENT_PROFILE.degree,
        graduationYear: data.graduationYear || DEFAULT_STUDENT_PROFILE.graduationYear,
        avatar: data.avatar || DEFAULT_STUDENT_PROFILE.avatar,
        completionRate: data.completionRate ?? DEFAULT_STUDENT_PROFILE.completionRate,
        skills: data.skills || DEFAULT_STUDENT_PROFILE.skills,
        softSkills: data.softSkills || DEFAULT_STUDENT_PROFILE.softSkills,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    } else {
      // Create initial Firestore document if user doc doesn't exist
      const initialDoc = {
        ...DEFAULT_STUDENT_PROFILE,
        uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(userDocRef, initialDoc);
      return initialDoc;
    }
  } catch (err) {
    console.error('Error fetching student profile from Firestore:', err);
    return { ...DEFAULT_STUDENT_PROFILE, uid };
  }
}

/**
 * Updates student profile in Firestore `users/{uid}`
 */
export async function updateStudentProfile(
  uid: string, 
  data: Partial<StudentProfileData>
): Promise<void> {
  if (!uid) return;

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error updating student profile in Firestore:', err);
    throw err;
  }
}

/**
 * Updates student skills in Firestore `users/{uid}`
 */
export async function updateStudentSkills(
  uid: string, 
  skills: Record<string, number>,
  softSkills?: Record<string, number>
): Promise<void> {
  if (!uid) return;

  try {
    const userDocRef = doc(db, 'users', uid);
    const payload: any = {
      skills,
      updatedAt: new Date().toISOString()
    };
    if (softSkills) {
      payload.softSkills = softSkills;
    }
    await setDoc(userDocRef, payload, { merge: true });
  } catch (err) {
    console.error('Error updating student skills in Firestore:', err);
    throw err;
  }
}

/**
 * Updates student career goal in Firestore `users/{uid}`
 */
export async function updateStudentCareerGoal(uid: string, careerGoal: string): Promise<void> {
  if (!uid) return;

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      careerGoal,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error updating career goal in Firestore:', err);
    throw err;
  }
}
