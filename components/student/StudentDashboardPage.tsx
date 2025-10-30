import React, { useState, useEffect, useCallback } from 'react';
import type { User, Role, Student, ChildProfile, GuardianProfile } from '../../types';
import { Role as RoleEnum } from '../../types';
import { supabase } from '../../services/supabase';
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
    MegaphoneIcon,
    UserGroupIcon,
} from '../Icons';
import { rishabhSharma } from '../../data/mockData';


import { StudentDashboardOverviewTab } from './StudentDashboardOverviewTab';
import { StudentTimetablePage } from './StudentTimetablePage';
import { StudentAssignmentsPage } from './StudentAssignmentsPage';
import { StudentGradesPage } from './StudentGradesPage';
import { StudentProfilePage } from './StudentProfilePage';
import { StudentCoursesPage } from './StudentCoursesPage';
import { StudentCommunicationPage } from './StudentCommunicationPage';
import { StudentAnnouncementsPage } from './StudentAnnouncementsPage';

export type StudentDashboardView = 'dashboard' | 'timetable' | 'assignments' | 'grades' | 'profile' | 'classes' | 'messages' | 'announcements' | 'settings';

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
    
    const [allChildren, setAllChildren] = useState<Student[]>([]);
    const [currentStudent, setCurrentStudent] = useState<Student | null>(studentProfile || rishabhSharma);
    const [isParentView, setIsParentView] = useState(!!studentProfile);
    const [isLoadingChildren, setIsLoadingChildren] = useState(!!studentProfile);

    useEffect(() => {
        if (isParentView && studentProfile) {
            const fetchChildrenForParent = async () => {
                setIsLoadingChildren(true);
                try {
                    const { data: primaryGuardianData, error: parentError } = await supabase
                        .from('guardian_profile')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('is_primary', true)
                        .single();

                    if (parentError) throw parentError;
                    
                    const { data: childrenData, error: childrenError } = await supabase
                        .from('child_profile')
                        .select('*')
                        .eq('user_id', user.id);

                    if (childrenError) throw childrenError;
                    
                    const admissionPromises = (childrenData || []).map(async (child) => {
                        const { data: admissionData, error: admissionError } = await supabase
                            .from('school_students')
                            .select('school_id, student_unique_id, added_date')
                            .eq('student_id', child.id)
                            .maybeSingle();

                        if (admissionError) return { ...child, admissionStatus: null };
                        
                        if (admissionData) {
                            const { data: schoolData, error: schoolError } = await supabase
                                .from('schools')
                                .select('name')
                                .eq('id', admissionData.school_id)
                                .single();

                            if (schoolError) return { ...child, admissionStatus: null };

                            return {
                                ...child,
                                admissionStatus: {
                                    schoolName: schoolData.name,
                                    studentId: admissionData.student_unique_id,
                                    admissionDate: admissionData.added_date,
                                }
                            };
                        }
                        return { ...child, admissionStatus: null };
                    });

                    const childrenWithStatus = await Promise.all(admissionPromises);

                    const studentList: Student[] = childrenWithStatus.map(child => ({
                        id: child.id,
                        student_id: child.admissionStatus?.studentId || 'N/A',
                        personal_info: {
                            full_name: child.full_name,
                            date_of_birth: child.age ? new Date(new Date().setFullYear(new Date().getFullYear() - Number(child.age))).toISOString().split('T')[0] : 'N/A',
                            gender: child.gender,
                            address: primaryGuardianData.address,
                        },
                        academic_info: {
                            grade: child.grade,
                            enrollment_status: child.admissionStatus ? 'Enrolled' : 'Pending',
                            admission_status: child.admissionStatus,
                        },
                        contact_info: {
                            parent_guardian: { name: primaryGuardianData.full_name, phone: primaryGuardianData.phone, email: primaryGuardianData.email || '' },
                            emergency_contact: { name: primaryGuardianData.full_name, phone: primaryGuardianData.phone }
                        },
                    }));

                    setAllChildren(studentList);
                    const initiallySelected = studentList.find(s => s.id === studentProfile.id);
                    setCurrentStudent(initiallySelected || studentList[0] || null);
                } catch (error) {
                    console.error("Failed to fetch children for parent view:", error);
                } finally {
                    setIsLoadingChildren(false);
                }
            };
            fetchChildrenForParent();
        }
    }, [isParentView, user, studentProfile]);
    
    const handleChildSwitch = (studentId: string) => {
        const newStudent = allChildren.find(s => s.id === studentId);
        if (newStudent) {
            setCurrentStudent(newStudent);
        }
    };

    const navItems = (
        <>
            <NavItem viewName="dashboard" activeView={currentView} setView={setCurrentView} icon={<ChartPieIcon className="w-6 h-6"/>}>Dashboard</NavItem>
            <NavItem viewName="profile" activeView={currentView} setView={setCurrentView} icon={<UserCircleIcon className="w-6 h-6"/>}>My Profile</NavItem>
            <NavItem viewName="classes" activeView={currentView} setView={setCurrentView} icon={<BookOpenIcon className="w-6 h-6"/>}>My Classes</NavItem>
            <NavItem viewName="timetable" activeView={currentView} setView={setCurrentView} icon={<ClockIcon className="w-6 h-6"/>}>My Timetable</NavItem>
            <NavItem viewName="assignments" activeView={currentView} setView={setCurrentView} icon={<PencilSquareIcon className="w-6 h-6"/>}>Assignments &amp; Grades</NavItem>
            <NavItem viewName="messages" activeView={currentView} setView={setCurrentView} icon={<ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6"/>}>Messages</NavItem>
            <NavItem viewName="announcements" activeView={currentView} setView={setCurrentView} icon={<MegaphoneIcon className="w-6 h-6"/>}>School News</NavItem>
        </>
    );

    const settingsNavItems = (
        <NavItem viewName="settings" activeView={currentView} setView={setCurrentView} icon={<Cog8ToothIcon className="w-6 h-6"/>}>Settings</NavItem>
    );

    const renderContent = () => {
        if (isLoadingChildren) {
            return (
                 <div className="flex items-center justify-center p-8">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            );
        }

        if (!currentStudent) {
            return <div className="p-8 text-center text-slate-500">No student profile loaded.</div>
        }

        switch (currentView) {
            case 'dashboard':
                return <StudentDashboardOverviewTab student={currentStudent} onNavigate={setCurrentView} />;
            case 'profile':
                return <StudentProfilePage student={currentStudent} />;
            case 'classes':
                return <StudentCoursesPage student={currentStudent} />;
            case 'timetable':
                return <StudentTimetablePage student={currentStudent} />;
            case 'assignments':
                return <StudentAssignmentsPage student={currentStudent} />;
            case 'grades':
                return <StudentGradesPage student={currentStudent} />;
            case 'messages':
                return <StudentCommunicationPage student={currentStudent} />;
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
                        {isParentView ? (
                            <>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {currentStudent ? `${currentStudent.personal_info.full_name.split(' ')[0]}'s Portal` : 'Student Portal'}
                                </h1>
                                <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
                                    Signed in as {user.user_metadata?.fullName || 'Parent'}
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Student Dashboard</h1>
                                <p className="mt-1 text-base text-slate-500 dark:text-slate-400">Welcome back, {currentStudent?.personal_info.full_name.split(' ')[0]}!</p>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        {isParentView && allChildren.length > 1 && (
                             <div className="flex items-center gap-2">
                                <UserGroupIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                <label htmlFor="child-switcher" className="text-sm font-medium text-slate-500 dark:text-slate-400">Viewing as:</label>
                                <select
                                    id="child-switcher"
                                    value={currentStudent?.id || ''}
                                    onChange={(e) => handleChildSwitch(e.target.value)}
                                    className="bg-slate-200 dark:bg-slate-700/80 border-transparent rounded-md text-sm font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    disabled={isLoadingChildren}
                                >
                                    {allChildren.map(child => (
                                        <option key={child.id} value={child.id}>
                                            {child.personal_info.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
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
                                    <a href="#" onClick={(e) => { e.preventDefault(); onBackToRoles(); }} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">{isParentView ? 'Exit Student View' : 'Change Role'}</a>
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