import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  FileText, 
  Briefcase, 
  Sparkles, 
  Settings as SettingsIcon, 
  LogOut, 
  Bell, 
  Lock, 
  Eye, 
  Download, 
  Trash2, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Laptop, 
  Check, 
  X, 
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sliders
} from 'lucide-react';

export const Settings = ({
  user,
  onNavigate,
  onLogout,
  onBackToLanding,
}) => {
  const activeNav = 'Settings';

  // Notification Toggles State
  const [notifications, setNotifications] = useState({
    internships: true,
    skillTests: true,
    aiRoadmap: true,
    applications: true,
  });

  // Appearance State
  const [selectedTheme, setSelectedTheme] = useState('Light');

  // Privacy State
  const [profileVisibility, setProfileVisibility] = useState('Private');

  // Modal States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleNotification = (key) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast(`Notification preferences updated.`);
      return updated;
    });
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match!');
      return;
    }
    setIsPasswordModalOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Password updated successfully.');
  };

  const handleDownloadData = () => {
    const studentData = {
      profile: {
        name: user?.name || 'Alex Chen',
        email: user?.email || 'alex@example.com',
        university: user?.organization || 'Apex Institute of Technology',
        degree: 'B.Tech Computer Science',
        graduationYear: '2027',
        targetCareer: 'Frontend Developer',
      },
      skillsAssessed: [
        { skill: 'JavaScript', score: 75 },
        { skill: 'React', score: 60 },
        { skill: 'HTML/CSS', score: 90 },
        { skill: 'Git', score: 45 },
      ],
      preferences: {
        theme: selectedTheme,
        notifications,
        profileVisibility,
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(studentData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edunet_student_data_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Student data archive exported.');
  };

  const handleConfirmDeleteAccount = () => {
    setIsDeleteModalOpen(false);
    showToast('Account scheduled for deactivation.');
    setTimeout(() => {
      if (onLogout) onLogout();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white text-black flex antialiased w-full max-w-[1440px] mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-black text-white px-5 py-3 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-brand-800 animate-fadeIn">
          <Check className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR (Identical to Dashboard, Profile, Assessments & Internships) */}
      <aside className="w-64 bg-white border-r border-brand-200 flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
        <div>
          {/* Logo & Subtitle */}
          <div 
            className="flex flex-col text-left mb-8 cursor-pointer" 
            onClick={() => onBackToLanding ? onBackToLanding() : onNavigate?.('/landing')}
          >
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
              <UserIcon className="w-4 h-4 text-brand-700" />
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
              <SettingsIcon className="w-4 h-4 text-black" />
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

      {/* MAIN CONTENT AREA (Desktop layout ~1280px wide) */}
      <main className="flex-1 bg-[#FAFAFA] min-h-screen overflow-y-auto">
        
        {/* TOP BAR */}
        <div className="bg-white border-b border-brand-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-black leading-tight">
              Settings
            </h1>
            <p className="text-xs text-brand-500 mt-0.5">
              Manage your account, preferences and privacy.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate ? onNavigate('/student') : null}
              className="text-xs font-semibold px-3 py-1.5 border border-brand-300 rounded-lg hover:bg-brand-50 text-black transition-colors"
            >
              &larr; Dashboard
            </button>

            <button 
              className="p-1.5 text-brand-500 hover:text-black rounded-lg hover:bg-brand-100 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="w-1.5 h-1.5 bg-black rounded-full absolute top-1.5 right-1.5"></span>
            </button>

            <div 
              className="flex items-center space-x-2.5 pl-2 border-l border-brand-200 cursor-pointer"
              onClick={() => onNavigate ? onNavigate('/student/profile') : null}
            >
              <span className="text-sm font-bold text-black">
                {user?.name || 'Alex Chen'}
              </span>
              <div className="w-8 h-8 rounded-full bg-brand-200 border border-brand-300 overflow-hidden flex items-center justify-center font-bold text-xs">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>AC</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SETTINGS BODY */}
        <div className="p-8 max-w-5xl mx-auto space-y-6 text-left">

          {/* 1. ACCOUNT SETTINGS CARD */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-brand-200 pb-4 mb-5">
              <div>
                <h2 className="text-base font-bold text-black">
                  Account
                </h2>
                <p className="text-xs text-brand-500 mt-0.5">
                  Personal profile details and primary career orientation.
                </p>
              </div>

              <button
                onClick={() => onNavigate ? onNavigate('/student/profile') : null}
                className="px-4 py-2 text-xs font-bold border border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Edit Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 text-xs">
              <div>
                <span className="text-brand-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                  Name
                </span>
                <span className="font-bold text-black text-sm block">
                  {user?.name || 'Alex Chen'}
                </span>
              </div>

              <div>
                <span className="text-brand-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                  Email
                </span>
                <span className="font-semibold text-brand-700 text-sm block">
                  {user?.email || 'alex@example.com'}
                </span>
              </div>

              <div>
                <span className="text-brand-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                  Career Goal
                </span>
                <span className="font-bold text-black text-sm block">
                  Frontend Developer
                </span>
              </div>
            </div>
          </div>

          {/* 2. NOTIFICATIONS SETTINGS CARD */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs">
            <div className="border-b border-brand-200 pb-4 mb-5">
              <h2 className="text-base font-bold text-black">
                Notifications
              </h2>
              <p className="text-xs text-brand-500 mt-0.5">
                Control which email and portal notifications you receive.
              </p>
            </div>

            <div className="divide-y divide-brand-100 space-y-3 text-xs">
              
              {/* Toggle 1: Internship Recommendations */}
              <div className="flex items-center justify-between pt-2">
                <div className="pr-4">
                  <h4 className="font-bold text-black text-sm">Internship Recommendations</h4>
                  <p className="text-xs text-brand-500 mt-0.5">
                    Receive notifications about new internships matching your skills.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('internships')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                    notifications.internships ? 'bg-black' : 'bg-brand-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      notifications.internships ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Skill Test Reminders */}
              <div className="flex items-center justify-between pt-3">
                <div className="pr-4">
                  <h4 className="font-bold text-black text-sm">Skill Test Reminders</h4>
                  <p className="text-xs text-brand-500 mt-0.5">
                    Get reminders when you have unfinished assessments.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('skillTests')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                    notifications.skillTests ? 'bg-black' : 'bg-brand-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      notifications.skillTests ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: AI Roadmap Updates */}
              <div className="flex items-center justify-between pt-3">
                <div className="pr-4">
                  <h4 className="font-bold text-black text-sm">AI Roadmap Updates</h4>
                  <p className="text-xs text-brand-500 mt-0.5">
                    Receive updates when your personalized roadmap changes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('aiRoadmap')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                    notifications.aiRoadmap ? 'bg-black' : 'bg-brand-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      notifications.aiRoadmap ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 4: Application Updates */}
              <div className="flex items-center justify-between pt-3">
                <div className="pr-4">
                  <h4 className="font-bold text-black text-sm">Application Updates</h4>
                  <p className="text-xs text-brand-500 mt-0.5">
                    Get notified when your internship application status changes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('applications')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                    notifications.applications ? 'bg-black' : 'bg-brand-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      notifications.applications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>

          {/* 3. APPEARANCE CARD */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs">
            <div className="border-b border-brand-200 pb-4 mb-5">
              <h2 className="text-base font-bold text-black">
                Appearance
              </h2>
              <p className="text-xs text-brand-500 mt-0.5">
                Customize your interface viewing experience.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider block">
                Theme
              </span>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'Light', label: 'Light', icon: Sun, desc: 'Clean high-contrast theme' },
                  { id: 'Dark', label: 'Dark', icon: Moon, desc: 'Dim lighting interface' },
                  { id: 'System', label: 'System', icon: Laptop, desc: 'Follow OS preference' },
                ].map((theme) => {
                  const Icon = theme.icon;
                  const isSelected = selectedTheme === theme.id;

                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        setSelectedTheme(theme.id);
                        showToast(`Theme set to ${theme.label}`);
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-black bg-brand-50/50 shadow-xs'
                          : 'border-brand-200 hover:border-brand-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-black" />
                          <span className="text-xs font-bold text-black">{theme.label}</span>
                        </div>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-black bg-black' : 'border-brand-300'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-brand-500">{theme.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. PRIVACY & SECURITY CARD */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs">
            <div className="border-b border-brand-200 pb-4 mb-5">
              <h2 className="text-base font-bold text-black">
                Privacy & Security
              </h2>
              <p className="text-xs text-brand-500 mt-0.5">
                Manage data visibility and credentials.
              </p>
            </div>

            <div className="space-y-6 text-xs">
              
              {/* Profile Visibility */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-black text-sm">Profile Visibility</h4>
                  <p className="text-xs text-brand-500 mt-0.5">
                    Control who can discover your skills and academic records.
                  </p>
                </div>
                <select
                  value={profileVisibility}
                  onChange={(e) => {
                    setProfileVisibility(e.target.value);
                    showToast(`Profile visibility set to ${e.target.value}`);
                  }}
                  className="bg-brand-50 border border-brand-300 rounded-lg px-3 py-2 text-xs font-bold text-black focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                >
                  <option value="Private">Private</option>
                  <option value="Only Me">Only Me</option>
                  <option value="Recruiters Only">Recruiters Only</option>
                  <option value="Public to Institutes">Public to Institutes</option>
                </select>
              </div>

              {/* Document Privacy */}
              <div className="flex items-center justify-between pt-4 border-t border-brand-100">
                <div>
                  <h4 className="font-bold text-black text-sm">Document Privacy</h4>
                  <p className="text-xs text-brand-500 mt-0.5">
                    Your uploaded documents are private and accessible only to you.
                  </p>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold bg-brand-100 text-black rounded border border-brand-300">
                  Private
                </span>
              </div>

              {/* Change Password */}
              <div className="flex items-center justify-between pt-4 border-t border-brand-100">
                <div>
                  <h4 className="font-bold text-black text-sm">Change Password</h4>
                  <p className="text-xs text-brand-500 mt-0.5">
                    Update your account password regularly for security.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 border border-brand-300 hover:border-black rounded-lg text-xs font-bold text-black hover:bg-brand-50 transition-colors"
                >
                  Change Password
                </button>
              </div>

            </div>
          </div>

          {/* 5. DATA & ACCOUNT CARD */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs">
            <div className="border-b border-brand-200 pb-4 mb-5">
              <h2 className="text-base font-bold text-black">
                Data & Account
              </h2>
              <p className="text-xs text-brand-500 mt-0.5">
                Export personal records or manage account termination.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="space-y-1">
                <h4 className="font-bold text-black text-sm">Account Data Management</h4>
                <p className="text-brand-500">
                  Download a complete copy of your profile, assessments, and applications.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleDownloadData}
                  className="px-4 py-2 border border-brand-300 hover:border-black rounded-lg text-xs font-bold text-black hover:bg-brand-50 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download My Data</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 border border-brand-300 hover:border-black text-xs font-bold text-black hover:bg-brand-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>

          {/* 6. SIGN OUT SECTION */}
          <div className="bg-white rounded-xl border border-brand-200 p-6 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-black">
                Sign Out
              </h2>
              <p className="text-xs text-brand-500 mt-0.5">
                Sign out of your Edunet student account on this device.
              </p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-brand-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>

      </main>

      {/* MODAL 1: CHANGE PASSWORD */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-300 max-w-md w-full p-6 text-left shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-brand-200 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-black flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Change Password</span>
              </h3>
              <button 
                onClick={() => setIsPasswordModalOpen(false)} 
                className="text-xs text-brand-400 hover:text-black font-bold p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-brand-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full p-2.5 bg-brand-50 border border-brand-300 rounded-lg text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full p-2.5 bg-brand-50 border border-brand-300 rounded-lg text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full p-2.5 bg-brand-50 border border-brand-300 rounded-lg text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="pt-3 border-t border-brand-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 border border-brand-300 rounded-lg font-bold text-brand-700 hover:bg-brand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-lg font-bold hover:bg-brand-800"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE ACCOUNT CONFIRMATION */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-300 max-w-md w-full p-6 text-left shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-brand-200 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-black flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-black" />
                <span>Delete your account?</span>
              </h3>
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="text-xs text-brand-400 hover:text-black font-bold p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2 text-xs text-brand-600 space-y-2">
              <p>This action cannot be undone.</p>
              <p className="text-brand-500">
                All your assessment scores, saved roadmaps, and internship applications will be permanently removed.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-brand-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-brand-300 rounded-lg text-xs font-bold text-brand-700 hover:bg-brand-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAccount}
                className="px-5 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-brand-800"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
