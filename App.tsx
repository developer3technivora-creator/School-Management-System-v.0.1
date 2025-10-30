import React, { useState } from 'react';
import { AppProvider, useAuth, useTheme } from './contexts/AppContext';
import { AuthPage } from './components/AuthPage';
import { RoleSelectionPage } from './components/RoleSelectionPage';
import { DashboardPage } from './components/DashboardPage';
import type { Role } from './types';
import { Role as RoleEnum } from './types';
import { SunIcon, MoonIcon } from './components/Icons';
import { SchoolDashboardPage } from './components/school/SchoolDashboardPage';
import { StudentDashboardPage } from './components/student/StudentDashboardPage';
import { TeacherDashboardPage } from './components/teacher/TeacherDashboardPage';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-50 p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-800 dark:text-slate-200 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-6 w-6" />
      ) : (
        <SunIcon className="h-6 w-6" />
      )}
    </button>
  );
};

// FIX: Added Parent-specific views to AppView to resolve type errors in DashboardPage.
export type AppView = 'studentManagement' | 'attendanceManagement' | 'financialManagement' | 'announcements' | 'eventCalendar' | 'administration' | 'parentalCommunication' | 'myChildren' | 'shareCode' | 'attendance' | 'grades' | 'fees' | 'courses' | 'meetings';

const AppContent: React.FC = () => {
    const { user, logout, initialLoading } = useAuth();
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [currentView, setCurrentView] = useState<string>('dashboard');

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    const handleBackToRoles = () => {
        setSelectedRole(null);
    };

    const handleLogout = () => {
        logout();
        setSelectedRole(null);
    };

    if (!user) {
        return <AuthPage />;
    }

    // Intercept specific roles and show their dedicated dashboards
    if (selectedRole === RoleEnum.School || selectedRole === RoleEnum.Parent) {
      return <SchoolDashboardPage user={user} role={selectedRole} onLogout={handleLogout} onBackToRoles={handleBackToRoles} />;
    }
    if (selectedRole === RoleEnum.Student) {
        return <StudentDashboardPage user={user} role={selectedRole} onLogout={handleLogout} onBackToRoles={handleBackToRoles} />;
    }
     if (selectedRole === RoleEnum.Teacher) {
        return <TeacherDashboardPage user={user} role={selectedRole} onLogout={handleLogout} onBackToRoles={handleBackToRoles} />;
    }
    
    if (!selectedRole) {
        return <RoleSelectionPage onSelectRole={(role) => {
            setSelectedRole(role);
            setCurrentView('dashboard');
        }} />;
    }
    
    // Default dashboard for other roles
    return (
        <DashboardPage
            user={user}
            role={selectedRole}
            onLogout={handleLogout}
            onBackToRoles={handleBackToRoles}
            onNavigate={(view) => setCurrentView(view)}
        />
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
                <ThemeToggle />
                <AppContent />
            </div>
        </AppProvider>
    );
};

export default App;