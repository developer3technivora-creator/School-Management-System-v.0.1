import React, { useState } from 'react';
import type { User, Role, Student } from '../../types';
import { Role as RoleEnum } from '../../types';
import { 
    ArrowLeftOnRectangleIcon, 
    ChartPieIcon,
    ClockIcon,
    PencilSquareIcon,
    ChartBarIcon,
    ChevronDownIcon,
    MoonIcon,
    BellIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    StarIcon,
    Cog8ToothIcon,
    AcademicCapIcon,
    UserCircleIcon,
    BookOpenIcon,
    MegaphoneIcon
} from '../Icons';

// Mock student data for Alice Johnson. In a real app, this would be fetched based on the logged-in user.
const aliceJohnson: Student = { 
    id: '1', 
    student_id: 'S-2024001', 
    full_name: 'Alice Johnson', 
    date_of_birth: '2008-05-12', 
    grade: '10th Grade', 
    enrollment_status: 'Enrolled', 
    gender: 'Female', 
    address: '123 Oak Ave, Springfield', 
    parent_guardian_name: 'John Johnson', 
    parent_guardian_phone: '555-1234', 
    parent_guardian_email: 'j.johnson@email.com', 
    emergency_contact_name: 'Jane Johnson', 
    emergency_contact_phone: '555-5678',
    admissionStatus: {
        schoolName: 'Springfield High',
        studentId: 'SPH-2024-0123',
        admissionDate: '2024-08-15'
    }
};

import { StudentDashboardOverviewTab } from './StudentDashboardOverviewTab';
import { StudentTimetablePage } from './StudentTimetablePage';
import { StudentAssignmentsPage } from './StudentAssignmentsPage';
import { StudentGradesPage } from './StudentGradesPage';
import { StudentProfilePage } from './StudentProfilePage';
import { StudentCoursesPage } from './StudentCoursesPage';
import { StudentCommunicationPage } from './StudentCommunicationPage';
import { StudentAnnouncementsPage } from './StudentAnnouncementsPage';

export type StudentDashboardView = 'dashboard' | 'timetable' | 'assignments' | 'grades' | 'profile' | 'courses' | 'messages' | 'announcements' | 'settings';

const NavItem: React.FC<{
    viewName: StudentDashboardView;
    activeView: StudentDashboardView;
    setView: (view: StudentDashboardView) => void;
    icon: React.ReactNode;
    children: React.ReactNode;
}> = ({ viewName, activeView, setView, icon, children }) => {
    const isActive = activeView === viewName;
    return (
        <li>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setView(viewName);
                }}
                className={`flex items-center p-3 text-base font-medium rounded-lg transition-colors duration-200 group ${
                    isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
            >
                {icon}
                <span className="ml-3 flex-1 whitespace-nowrap">{children}</span>
            </a>
        </li>
    );
};

interface StudentDashboardPageProps {
    user: User;
    role: Role;
    onLogout: () => void;
    onBackToRoles: () => void;
    studentProfile?: Student;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ user, role, onLogout, onBackToRoles, studentProfile }) => {
    const [currentView, setCurrentView] = useState<StudentDashboardView>('dashboard');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const student = studentProfile || aliceJohnson; // Using hardcoded student data for demonstration

    const navItems = (
        <>
            <NavItem viewName="dashboard" activeView={currentView} setView={setCurrentView} icon={<ChartPieIcon className="w-6 h-6"/>}>Dashboard</NavItem>
            <NavItem viewName="profile" activeView={currentView} setView={setCurrentView} icon={<UserCircleIcon className="w-6 h-6"/>}>My Profile</NavItem>
            <NavItem viewName="courses" activeView={currentView} setView={setCurrentView} icon={<BookOpenIcon className="w-6 h-6"/>}>My Courses</NavItem>
            <NavItem viewName="timetable" activeView={currentView} setView={setCurrentView} icon={<ClockIcon className="w-6 h-6"/>}>My Timetable</NavItem>
            <NavItem viewName="assignments" activeView={currentView} setView={setCurrentView} icon={<PencilSquareIcon className="w-6 h-6"/>}>Assignments</NavItem>
            <NavItem viewName="grades" activeView={currentView} setView={setCurrentView} icon={<ChartBarIcon className="w-6 h-6"/>}>My Grades</NavItem>
            <NavItem viewName="messages" activeView={currentView} setView={setCurrentView} icon={<ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6"/>}>Messages</NavItem>
            <NavItem viewName="announcements" activeView={currentView} setView={setCurrentView} icon={<MegaphoneIcon className="w-6 h-6"/>}>School News</NavItem>
        </>
    );

    const settingsNavItems = (
        <NavItem viewName="settings" activeView={currentView} setView={setCurrentView} icon={<Cog8ToothIcon className="w-6 h-6"/>}>Settings</NavItem>
    );

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return <StudentDashboardOverviewTab student={student} onNavigate={setCurrentView} />;
            case 'profile':
                return <StudentProfilePage student={student} />;
            case 'courses':
                return <StudentCoursesPage student={student} />;
            case 'timetable':
                return <StudentTimetablePage student={student} />;
            case 'assignments':
                return <StudentAssignmentsPage student={student} />;
            case 'grades':
                return <StudentGradesPage student={student} />;
            case 'messages':
                return <StudentCommunicationPage student={student} />;
            case 'announcements':
                return <StudentAnnouncementsPage />;
            case 'settings':
                return <div className="p-8 text-center"><h2 className="text-2xl font-bold">Settings</h2><p className="mt-2 text-slate-500">This feature is coming soon!</p></div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
            <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 px-3 py-2 mb-6">
                        <AcademicCapIcon className="h-8 w-8 text-blue-500"/>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">Student Portal</span>
                    </div>
                    <ul className="space-y-2">
                        {navItems}
                    </ul>
                </div>
                <ul className="space-y-2 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                    {settingsNavItems}
                </ul>
            </aside>

            <main className="flex-1 p-6">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Student Dashboard</h1>
                        <p className="mt-1 text-base text-slate-500 dark:text-slate-400">Welcome back, {student.full_name.split(' ')[0]}!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"><MoonIcon className="w-5 h-5"/></button>
                        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"><BellIcon className="w-5 h-5"/></button>
                        <div className="relative">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2">
                                <img className="h-9 w-9 rounded-full object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop" alt="User" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:inline">{user.user_metadata?.fullName}</span>
                                <ChevronDownIcon className="w-4 h-4 text-slate-500"/>
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-xl z-10 border dark:border-slate-700">
                                    <a href="#" onClick={(e) => { e.preventDefault(); onBackToRoles(); }} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Change Role</a>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="block px-4 py-2 text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700">Logout</a>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="bg-transparent dark:bg-transparent rounded-2xl">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};