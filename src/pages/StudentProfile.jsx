import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  FileText, 
  Briefcase, 
  Sparkles, 
  Settings, 
  LogOut, 
  Bell, 
  Edit3, 
  Check, 
  X, 
  Upload, 
  Trash2, 
  Eye, 
  Lock, 
  File, 
  FileCheck, 
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { INITIAL_DOCUMENTS, uploadDocumentToStorage, deleteDocumentFromStorage } from '../services/storageService';
import { 
  getStudentProfile, 
  updateStudentProfile, 
  updateStudentSkills, 
  updateStudentCareerGoal 
} from '../services/profileService';

export const StudentProfile = ({
  user,
  onNavigate,
  onLogout,
  onBackToLanding,
}) => {
  // Navigation active state
  const activeNav = 'Profile';

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Profile data states
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Alex Chen',
    email: user?.email || 'alex@example.com',
    university: user?.organization || 'Apex Institute of Technology',
    degree: 'B.Tech Computer Science',
    graduationYear: '2027',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    completionRate: 85,
  });

  // Career Goal state
  const [careerGoal, setCareerGoal] = useState('Frontend Developer');
  const [goalSavedMessage, setGoalSavedMessage] = useState(false);

  // Technical & Soft Skills states
  const [technicalSkills, setTechnicalSkills] = useState([
    { name: 'JavaScript', level: 75 },
    { name: 'React', level: 60 },
    { name: 'HTML/CSS', level: 90 },
    { name: 'Git', level: 45 },
  ]);

  const [softSkills, setSoftSkills] = useState([
    { name: 'Communication', level: 80 },
    { name: 'Teamwork', level: 75 },
    { name: 'Problem Solving', level: 70 },
    { name: 'Leadership', level: 60 },
  ]);

  // Documents state
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isEditSkillsModalOpen, setIsEditSkillsModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);

  // Upload modal interaction states
  const [uploadFile, setUploadFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Fetch Profile from Firestore on Load
  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      const uid = user?.id || 'usr_student_01';
      try {
        const firestoreProfile = await getStudentProfile(uid);
        if (isMounted && firestoreProfile) {
          setProfileData({
            name: firestoreProfile.name || user?.name || 'Alex Chen',
            email: firestoreProfile.email || user?.email || 'alex@example.com',
            university: firestoreProfile.university || firestoreProfile.organization || 'Apex Institute of Technology',
            degree: firestoreProfile.degree || 'B.Tech Computer Science',
            graduationYear: firestoreProfile.graduationYear || '2027',
            avatar: firestoreProfile.avatar || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            completionRate: firestoreProfile.completionRate ?? 85,
          });

          if (firestoreProfile.careerGoal) {
            setCareerGoal(firestoreProfile.careerGoal);
          }

          if (firestoreProfile.skills) {
            const tech = Object.entries(firestoreProfile.skills).map(([k, v]) => ({
              name: k,
              level: typeof v === 'number' ? v : 50
            }));
            if (tech.length > 0) setTechnicalSkills(tech);
          }

          if (firestoreProfile.softSkills) {
            const soft = Object.entries(firestoreProfile.softSkills).map(([k, v]) => ({
              name: k,
              level: typeof v === 'number' ? v : 50
            }));
            if (soft.length > 0) setSoftSkills(soft);
          }
        }
      } catch (e) {
        console.error('Error loading Firestore profile:', e);
      } finally {
        if (isMounted) setIsLoadingProfile(false);
      }
    }

    loadProfile();
    return () => { isMounted = false; };
  }, [user?.id]);

  // Career goal options as requested
  const careerOptions = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
    'Data Scientist',
    'AI/ML Engineer',
    'UI/UX Designer',
    'Cybersecurity Analyst',
    'Cloud Engineer',
  ];

  const handleSaveCareerGoal = async () => {
    setGoalSavedMessage(true);
    showToast(`Career goal updated to ${careerGoal}`);
    setTimeout(() => setGoalSavedMessage(false), 3000);

    const uid = user?.id || 'usr_student_01';
    try {
      await updateStudentCareerGoal(uid, careerGoal);
    } catch (e) {
      console.error('Failed to sync career goal to Firestore:', e);
    }
  };

  // File Upload Handlers (Structured for Firebase Storage)
  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleConfirmUpload = async () => {
    if (!uploadFile) return;
    setIsUploading(true);
    try {
      const newDoc = await uploadDocumentToStorage(uploadFile, (progress) => {
        setUploadProgress(progress);
      });
      setDocuments((prev) => [newDoc, ...prev]);
      setIsUploading(false);
      setUploadFile(null);
      setUploadProgress(0);
      setIsUploadModalOpen(false);
      showToast('Document uploaded successfully');
    } catch (err) {
      setIsUploading(false);
      showToast('Failed to upload document');
    }
  };

  const handleDeleteDocument = async (docId, docName) => {
    await deleteDocumentFromStorage(docId);
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    showToast(`Deleted ${docName}`);
  };

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({ ...profileData });

  // Update edit form whenever profileData changes
  useEffect(() => {
    setEditForm({ ...profileData });
  }, [profileData]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updated = { ...editForm };
    setProfileData(updated);
    setIsEditProfileModalOpen(false);
    showToast('Profile information saved to Firestore');

    const uid = user?.id || 'usr_student_01';
    try {
      await updateStudentProfile(uid, {
        name: updated.name,
        email: updated.email,
        university: updated.university,
        organization: updated.university,
        degree: updated.degree,
        graduationYear: updated.graduationYear
      });
    } catch (err) {
      console.error('Failed to sync profile updates to Firestore:', err);
    }
  };

  const handleSaveSkillsToFirestore = async () => {
    setIsEditSkillsModalOpen(false);
    showToast('Skills synchronized to Firestore');

    const uid = user?.id || 'usr_student_01';
    const techObj = {};
    technicalSkills.forEach(s => { techObj[s.name] = s.level; });
    const softObj = {};
    softSkills.forEach(s => { softObj[s.name] = s.level; });

    try {
      await updateStudentSkills(uid, techObj, softObj);
    } catch (err) {
      console.error('Failed to sync skills to Firestore:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex antialiased w-full max-w-[1440px] mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-black text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR (Identical to Student Dashboard) */}
      <aside className="w-64 bg-white border-r border-brand-200 flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
        <div>
          {/* Logo & Subtitle */}
          <div className="flex flex-col text-left mb-8 cursor-pointer" onClick={onBackToLanding}>
            <span className="font-extrabold text-2xl tracking-tight text-black leading-none">
              Edunet
            </span>
            <span className="text-[11px] font-medium tracking-wider text-brand-500 uppercase mt-1">
              Professional Suite
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-left text-sm font-medium">
            <button
              onClick={() => onNavigate ? onNavigate('/student') : null}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Dashboard'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-brand-700" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('/student/profile') : null}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Profile'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <UserIcon className="w-4 h-4 text-black" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('/student/assessments') : null}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Skill Tests'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <FileText className="w-4 h-4 text-brand-700" />
              <span>Skill Tests</span>
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('/student/internships') : null}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Internships & Jobs'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <Briefcase className="w-4 h-4 text-brand-700" />
              <span>Internships & Jobs</span>
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('/student/roadmap') : null}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'AI Career Roadmap'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <Sparkles className="w-4 h-4 text-brand-700" />
              <span>AI Career Roadmap</span>
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('/student/settings') : null}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeNav === 'Settings'
                  ? 'bg-brand-100 text-black font-bold'
                  : 'text-brand-600 hover:bg-brand-50 hover:text-black'
              }`}
            >
              <Settings className="w-4 h-4 text-brand-700" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="pt-6 border-t border-brand-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-brand-600 hover:text-black hover:bg-brand-50 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4 text-brand-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-brand-50/40">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-brand-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="text-left">
            <h1 className="text-xl font-extrabold text-black">Student Profile</h1>
            <p className="text-xs text-brand-500">Manage your credentials, career focus and verified skill competencies.</p>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate ? onNavigate('/student') : null}
              className="text-xs font-semibold text-brand-600 hover:text-black px-3 py-1.5 rounded-md hover:bg-brand-50 border border-brand-200"
            >
              &larr; Back to Dashboard
            </button>
            <button className="p-2 text-brand-500 hover:text-black rounded-lg hover:bg-brand-50 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-black rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 pl-3 border-l border-brand-200">
              <img
                src={profileData.avatar}
                alt="Profile Avatar"
                className="w-8 h-8 rounded-full object-cover border border-brand-300"
              />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-black block leading-none">{profileData.name}</span>
                <span className="text-[10px] text-brand-500 font-medium">B.Tech Computer Science</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Layout */}
        <div className="p-8 max-w-6xl space-y-6">

          {isLoadingProfile ? (
            <div className="p-12 bg-white rounded-xl border border-brand-200 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-black" />
              <p className="text-xs font-semibold text-brand-500">Loading student profile from Cloud Firestore...</p>
            </div>
          ) : (
            <>
              {/* SECTION 1: PROFILE INFO & CAREER GOAL */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1.1 Profile Information Card (2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-brand-200 p-6 shadow-xs text-left relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="relative group">
                        <img
                          src={profileData.avatar}
                          alt="Student Avatar"
                          className="w-20 h-20 rounded-full object-cover border-2 border-brand-300 shadow-xs"
                        />
                        <button 
                          onClick={() => setIsEditProfileModalOpen(true)}
                          className="absolute bottom-0 right-0 p-1.5 bg-black text-white rounded-full hover:bg-brand-800 shadow-sm"
                          title="Change Photo / Edit"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-extrabold text-black">{profileData.name}</h2>
                          <span className="px-2 py-0.5 bg-brand-100 text-black text-[10px] font-bold rounded">
                            Verified Student
                          </span>
                        </div>
                        <p className="text-xs text-brand-600 font-medium">{profileData.email}</p>
                        <div className="pt-2 text-xs text-brand-700 space-y-0.5">
                          <p><span className="font-semibold text-brand-500">University:</span> {profileData.university}</p>
                          <p><span className="font-semibold text-brand-500">Program:</span> {profileData.degree} • Graduating {profileData.graduationYear}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditProfileModalOpen(true)}
                      className="px-3 py-1.5 border border-brand-300 rounded-lg text-xs font-bold text-black hover:bg-brand-50 flex items-center space-x-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>

                {/* 1.2 Career Goal Selector Card (1 col) */}
                <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs text-left flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-extrabold text-sm text-black flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>Career Goal Focus</span>
                      </h3>
                      {goalSavedMessage && (
                        <span className="text-[10px] font-bold text-black bg-brand-100 px-2 py-0.5 rounded">
                          Saved!
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brand-500 mb-4">
                      Select your target role. Skill tests and AI roadmaps will adapt to this benchmark.
                    </p>

                    <div className="relative">
                      <select
                        value={careerGoal}
                        onChange={(e) => setCareerGoal(e.target.value)}
                        className="w-full appearance-none bg-brand-50 border border-brand-300 text-black text-xs font-bold rounded-lg p-3 pr-8 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                      >
                        {careerOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-brand-500 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-brand-200 flex items-center justify-between">
                    <span className="text-[11px] text-brand-500">Benchmark Active</span>
                    <button
                      onClick={handleSaveCareerGoal}
                      className="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-brand-800 transition-colors shadow-xs"
                    >
                      Save Goal
                    </button>
                  </div>
                </div>

              </div>

              {/* SECTION 2: SKILLS (TECHNICAL & SOFT) */}
              <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs text-left">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-200">
                  <div>
                    <h3 className="text-base font-extrabold text-black">Verified Skill Competencies</h3>
                    <p className="text-xs text-brand-500">Measured via standardized assessments, projects, and coursework.</p>
                  </div>
                  <button
                    onClick={() => setIsEditSkillsModalOpen(true)}
                    className="px-3.5 py-1.5 border border-brand-300 rounded-lg text-xs font-bold text-black hover:bg-brand-50 flex items-center space-x-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Skills</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Technical Skills */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-500">
                      Technical Skills
                    </h4>
                    <div className="space-y-3">
                      {technicalSkills.map((skill, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-black">{skill.name}</span>
                            <span className="text-brand-600 font-bold">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-brand-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-black h-2 rounded-full transition-all duration-300"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Soft Skills */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-500">
                      Soft & Professional Skills
                    </h4>
                    <div className="space-y-3">
                      {softSkills.map((skill, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-black">{skill.name}</span>
                            <span className="text-brand-600 font-bold">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-brand-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-brand-700 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: DOCUMENTS (PDF UPLOADS & MANAGEMENT) */}
              <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs text-left">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-200">
                  <div>
                    <h3 className="text-base font-extrabold text-black">Documents & Credentials</h3>
                    <p className="text-xs text-brand-500">Upload your verified resume, academic transcripts, and certifications.</p>
                  </div>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-brand-800 transition-colors flex items-center space-x-2 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Document</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 bg-brand-50/60 border border-brand-200 rounded-xl flex items-center justify-between hover:border-brand-300 transition-colors"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="p-2.5 bg-white border border-brand-200 rounded-lg text-black">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-black">{doc.name}</h4>
                          <p className="text-[11px] text-brand-500">{doc.size} • Uploaded {doc.uploadedAt}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setPreviewDocument(doc)}
                          className="px-3 py-1.5 bg-white border border-brand-300 rounded-md text-xs font-semibold text-black hover:bg-brand-100 flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id, doc.name)}
                          className="p-1.5 text-brand-400 hover:text-black hover:bg-brand-100 rounded-md transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: PROFILE COMPLETION STRENGTH */}
              <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs text-left">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-black">Profile Strength</h3>
                    <p className="text-xs text-brand-500">Complete all milestones to unlock top tier internship matching.</p>
                  </div>
                  <span className="text-lg font-black text-black">{profileData.completionRate}%</span>
                </div>

                <div className="w-full bg-brand-100 rounded-full h-2.5 overflow-hidden mb-4">
                  <div
                    className="bg-black h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${profileData.completionRate}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="flex items-center space-x-2 text-black font-semibold">
                    <Check className="w-4 h-4 text-black" />
                    <span>Personal Credentials Verified</span>
                  </div>
                  <div className="flex items-center space-x-2 text-black font-semibold">
                    <Check className="w-4 h-4 text-black" />
                    <span>Resume Uploaded</span>
                  </div>
                  <div className="flex items-center space-x-2 text-brand-500 font-medium">
                    <div className="w-4 h-4 rounded-full border border-brand-300 flex items-center justify-center text-[10px]">
                      3
                    </div>
                    <span>Take 2 More Skill Tests (+15%)</span>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      {/* MODAL 1: UPLOAD DOCUMENT */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-300 max-w-lg w-full p-6 text-left shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-brand-200 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-black">Upload New Document</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-xs text-brand-400 hover:text-black font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-black bg-brand-100' : 'border-brand-300 hover:border-black bg-brand-50/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
              <Upload className="w-8 h-8 text-brand-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-black">
                {uploadFile ? uploadFile.name : 'Click to select or drag PDF/DOC here'}
              </p>
              <p className="text-[11px] text-brand-500 mt-1">Maximum file size: 10MB</p>
            </div>

            {isUploading && (
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span>Uploading to Cloud Storage...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-brand-100 rounded-full h-2">
                  <div className="bg-black h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-brand-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 border border-brand-300 rounded-lg text-xs font-bold text-brand-700 hover:bg-brand-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!uploadFile || isUploading}
                onClick={handleConfirmUpload}
                className="px-5 py-2 bg-black text-white rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-brand-800"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PROFILE */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-300 max-w-lg w-full p-6 text-left shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-brand-200 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-black">Edit Profile Information</h3>
              <button onClick={() => setIsEditProfileModalOpen(false)} className="text-xs text-brand-400 hover:text-black font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 bg-brand-50 border border-brand-300 rounded-lg text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full p-2.5 bg-brand-50 border border-brand-300 rounded-lg text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-700 mb-1">College / University</label>
                <input
                  type="text"
                  required
                  value={editForm.university}
                  onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                  className="w-full p-2.5 bg-brand-50 border border-brand-300 rounded-lg text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-700 mb-1">Degree & Major</label>
                  <input
                    type="text"
                    required
                    value={editForm.degree}
                    onChange={(e) => setEditForm({ ...editForm, degree: e.target.value })}
                    className="w-full p-2.5 bg-brand-50 border border-brand-300 rounded-lg text-xs focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-700 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    required
                    value={editForm.graduationYear}
                    onChange={(e) => setEditForm({ ...editForm, graduationYear: e.target.value })}
                    className="w-full p-2.5 bg-brand-50 border border-brand-300 rounded-lg text-xs focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-brand-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="px-4 py-2 border border-brand-300 rounded-lg font-bold text-brand-700 hover:bg-brand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-lg font-bold hover:bg-brand-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT SKILLS */}
      {isEditSkillsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-300 max-w-lg w-full p-6 text-left shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-brand-200 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-black">Update Skills & Confidence</h3>
              <button onClick={() => setIsEditSkillsModalOpen(false)} className="text-xs text-brand-400 hover:text-black font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-500 mb-2">Technical Skills</h4>
                <div className="space-y-2.5">
                  {technicalSkills.map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                      <span className="w-28 font-semibold text-black">{skill.name}</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTechnicalSkills(prev => prev.map((s, i) => i === idx ? { ...s, level: val } : s));
                        }}
                        className="flex-1 accent-black cursor-pointer"
                      />
                      <span className="w-10 text-right font-bold">{skill.level}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-brand-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-500 mb-2">Soft Skills</h4>
                <div className="space-y-2.5">
                  {softSkills.map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                      <span className="w-28 font-semibold text-black">{skill.name}</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSoftSkills(prev => prev.map((s, i) => i === idx ? { ...s, level: val } : s));
                        }}
                        className="flex-1 accent-black cursor-pointer"
                      />
                      <span className="w-10 text-right font-bold">{skill.level}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleSaveSkillsToFirestore}
                className="px-5 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-brand-800"
              >
                Save to Firestore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DOCUMENT PREVIEW */}
      {previewDocument && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-300 max-w-xl w-full p-6 text-left shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-brand-200 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-black" />
                <h3 className="font-extrabold text-base text-black">{previewDocument.name}</h3>
              </div>
              <button onClick={() => setPreviewDocument(null)} className="text-xs text-brand-400 hover:text-black font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 bg-brand-50 border border-brand-200 rounded-xl text-center space-y-3 my-4">
              <FileText className="w-12 h-12 text-brand-400 mx-auto" />
              <p className="text-sm font-bold text-black">{previewDocument.name}</p>
              <p className="text-xs text-brand-500">{previewDocument.size} • {previewDocument.uploadedAt}</p>
              <span className="inline-block px-3 py-1 bg-black text-white text-[11px] font-semibold rounded">
                Verified Document
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-brand-200 flex justify-end">
              <button
                onClick={() => setPreviewDocument(null)}
                className="px-5 py-2 bg-black text-white rounded-lg text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentProfile;
