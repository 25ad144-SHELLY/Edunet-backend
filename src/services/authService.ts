import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User, UserRole } from '../types';

export interface UserProfileData {
  name?: string;
  role?: UserRole;
  careerGoal?: string;
  skills?: Record<string, number>;
  organization?: string;
  degree?: string;
  graduationYear?: string;
  avatar?: string;
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

/**
 * Transforms a Firestore user document / Firebase user into application User type
 */
function mapFirestoreUserToAppUser(uid: string, data: any, firebaseUser?: FirebaseUser | null): User {
  return {
    id: uid,
    name: data?.name || firebaseUser?.displayName || 'Alex Chen',
    email: data?.email || firebaseUser?.email || '',
    role: (data?.role as UserRole) || 'student',
    avatar: data?.avatar || firebaseUser?.photoURL || DEFAULT_AVATAR,
    organization: data?.organization || 'Apex Institute of Technology',
    title: data?.title || (data?.role === 'student' ? 'Computer Science Undergrad (Final Year)' : data?.role === 'institute' ? 'Dean of Academics' : 'Talent Acquisition Head')
  };
}

/**
 * Signs up a user with email and password, creating their Firestore document
 */
export async function signUpWithEmail(
  email: string, 
  password: string, 
  profileData?: UserProfileData
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const fbUser = userCredential.user;
  const uid = fbUser.uid;

  const role: UserRole = profileData?.role || 'student';
  const name = profileData?.name || fbUser.displayName || 'Alex Chen';
  const organization = profileData?.organization || (role === 'student' ? 'Apex Institute of Technology' : role === 'institute' ? 'Apex Institute of Technology' : 'TechCorp Solutions');
  const careerGoal = profileData?.careerGoal || 'Frontend Developer';

  const defaultSkills: Record<string, number> = profileData?.skills || {
    JavaScript: 75,
    React: 60,
    HTML: 90,
    CSS: 80,
    Git: 45
  };

  const initialDoc = {
    uid,
    name,
    email: fbUser.email || email,
    role,
    careerGoal,
    skills: defaultSkills,
    organization,
    degree: profileData?.degree || (role === 'student' ? 'B.Tech Computer Science' : undefined),
    graduationYear: profileData?.graduationYear || (role === 'student' ? '2027' : undefined),
    avatar: fbUser.photoURL || profileData?.avatar || DEFAULT_AVATAR,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Save to Firestore: users/{uid}
  const userDocRef = doc(db, 'users', uid);
  await setDoc(userDocRef, initialDoc, { merge: true });

  return mapFirestoreUserToAppUser(uid, initialDoc, fbUser);
}

/**
 * Signs in a user with email and password and loads their Firestore profile
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const fbUser = userCredential.user;
  const uid = fbUser.uid;

  const userDocRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return mapFirestoreUserToAppUser(uid, docSnap.data(), fbUser);
  } else {
    // Create baseline record if none exists
    const baselineDoc = {
      uid,
      name: fbUser.displayName || 'Alex Chen',
      email: fbUser.email || email,
      role: 'student',
      careerGoal: 'Frontend Developer',
      skills: { JavaScript: 75, React: 60, HTML: 90, CSS: 80, Git: 45 },
      organization: 'Apex Institute of Technology',
      degree: 'B.Tech Computer Science',
      graduationYear: '2027',
      avatar: fbUser.photoURL || DEFAULT_AVATAR,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(userDocRef, baselineDoc);
    return mapFirestoreUserToAppUser(uid, baselineDoc, fbUser);
  }
}

/**
 * Signs in with Google Popup and ensures a Firestore user record exists
 */
export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const fbUser = userCredential.user;
  const uid = fbUser.uid;

  const userDocRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return mapFirestoreUserToAppUser(uid, docSnap.data(), fbUser);
  } else {
    const newStudentDoc = {
      uid,
      name: fbUser.displayName || 'Student',
      email: fbUser.email || '',
      role: 'student',
      careerGoal: 'Frontend Developer',
      skills: { JavaScript: 75, React: 60, HTML: 90, CSS: 80, Git: 45 },
      organization: 'Apex Institute of Technology',
      degree: 'B.Tech Computer Science',
      graduationYear: '2027',
      avatar: fbUser.photoURL || DEFAULT_AVATAR,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(userDocRef, newStudentDoc);
    return mapFirestoreUserToAppUser(uid, newStudentDoc, fbUser);
  }
}

/**
 * Signs out the current Firebase user
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Listens for Firebase Auth state changes and retrieves the Firestore profile
 */
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      try {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          callback(mapFirestoreUserToAppUser(fbUser.uid, docSnap.data(), fbUser));
        } else {
          const fallbackDoc = {
            uid: fbUser.uid,
            name: fbUser.displayName || 'Alex Chen',
            email: fbUser.email || '',
            role: 'student',
            avatar: fbUser.photoURL || DEFAULT_AVATAR
          };
          callback(mapFirestoreUserToAppUser(fbUser.uid, fallbackDoc, fbUser));
        }
      } catch (err) {
        console.error('Error fetching user document:', err);
        callback(mapFirestoreUserToAppUser(fbUser.uid, null, fbUser));
      }
    } else {
      callback(null);
    }
  });
}
