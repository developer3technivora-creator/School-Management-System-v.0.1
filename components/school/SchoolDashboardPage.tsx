import React, { useState, useEffect, useCallback } from 'react';
import type { User, School, Role, Student } from '../../types';
import { Role as RoleEnum } from '../../types';
import { supabase } from '../../services/supabase';
import { 
    BuildingLibraryIcon, 
    ArrowLeftOnRectangleIcon, 
    AcademicCapIcon, 
    UsersIcon, 
    BookOpenIcon, 
    UserGroupIcon, 
    CalendarDaysIcon, 
    PencilSquareIcon, 
    Cog8ToothIcon, 
    ChartPieIcon,
    BellIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    StarIcon,
    ChevronDownIcon,
    ShareIcon,
    MoonIcon,
    FaceSmileIcon,
    DocumentCheckIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    BriefcaseIcon
} from '../Icons';
import { SchoolProfileTab } from './SchoolProfileTab';
import { CodeLookupTab } from '../administration/CodeLookupTab';
import { AdmittedStudentsTab } from './AdmittedStudentsTab';
import { SchoolRegistrationPage } from './SchoolRegistrationPage';
import { SchoolDashboardOverviewTab } from './SchoolDashboardOverviewTab';
import { ParentProfilePage } from '../parent/ParentProfilePage';
import { ParentShareCodePage } from '../parent/ParentShareCodePage';
import { ParentAttendancePage } from '../parent/ParentAttendancePage';
import { ParentGradesPage } from '../parent/ParentGradesPage';
import { ParentFinancialsPage } from '../parent/ParentFinancialsPage';
import { ParentDashboardOverviewTab } from '../parent/ParentDashboardOverviewTab';
import { CourseManagementPage } from './courses/CourseManagementPage';
import { MeetingManagementPage } from './meetings/MeetingManagementPage';
import { EventCalendarPage } from '../calendar/EventCalendarPage';
import { HomeworkManagementPage } from './homework/HomeworkManagementPage';
import { AdministrationPage } from '../administration/AdministrationPage';
import { AttendanceManagementPage } from '../attendance/AttendanceManagementPage';
import { FinancialManagementPage } from '../financial/FinancialManagementPage';
import { StudentDashboardPage } from '../student/StudentDashboardPage';
import { FacultyManagementPage } from './faculty/FacultyManagementPage';


export type DashboardView = 'dashboard' | 'students' | 'courses' | 'meetings' | 'calendar' | 'homework' | 'profile' | 'admissions' | 'settings' | 'myChildren' | 'attendance' | 'grades' | 'fees' | 'shareCode' | 'faculty' | 'finance';

const NavItem: React.FC<{
    viewName: DashboardView;
    activeView: DashboardView;
    setView: (view: DashboardView) => void;
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

interface SchoolDashboardPageProps {
    user: User;
    role: Role;
    onLogout: () => void;
    onBackToRoles: () => void;
}

export const SchoolDashboardPage: React.FC<SchoolDashboardPageProps> = ({ user, role, onLogout, onBackToRoles }) => {
    const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
    const [school, setSchool] = useState<School | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [needsRegistration, setNeedsRegistration] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [viewingStudentPortalFor, setViewingStudentPortalFor] = useState<Student | null>(null);

    const fetchSchoolProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setNeedsRegistration(false);
        try {
            const { data, error: fetchError } = await supabase
                .from('schools')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (fetchError) {
                if (fetchError.code === 'PGRST116') {
                    setNeedsRegistration(true);
                    return;
                }
                throw fetchError;
            }
            setSchool(data);
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [user.id]);

    useEffect(() => {
        if (role === RoleEnum.School) {
            fetchSchoolProfile();
        } else {
            setIsLoading(false); // For parents, no profile to fetch.
        }
    }, [fetchSchoolProfile, role]);

    if (viewingStudentPortalFor) {
        return (
            <StudentDashboardPage
                user={user}
                role={RoleEnum.Student} // This is the role being 'simulated'
                onLogout={onLogout}
                onBackToRoles={() => setViewingStudentPortalFor(null)} // This will now act as "Exit student view"
                studentProfile={viewingStudentPortalFor}
            />
        );
    }
    
    const schoolNavItems = (
        <>
            <NavItem viewName="dashboard" activeView={currentView} setView={setCurrentView} icon={<ChartPieIcon className="w-6 h-6"/>}>Dashboard</NavItem>
            <NavItem viewName="students" activeView={currentView} setView={setCurrentView} icon={<UsersIcon className="w-6 h-6"/>}>Students</NavItem>
            <NavItem viewName="faculty" activeView={currentView} setView={setCurrentView} icon={<BriefcaseIcon className="w-6 h-6"/>}>Faculty</NavItem>
            <NavItem viewName="attendance" activeView={currentView} setView={setCurrentView} icon={<DocumentCheckIcon className="w-6 h-6"/>}>Attendance</NavItem>
            <NavItem viewName="finance" activeView={currentView} setView={setCurrentView} icon={<CurrencyDollarIcon className="w-6 h-6"/>}>Finance</NavItem>
            <NavItem viewName="courses" activeView={currentView} setView={setCurrentView} icon={<BookOpenIcon className="w-6 h-6"/>}>Courses</NavItem>
            <NavItem viewName="meetings" activeView={currentView} setView={setCurrentView} icon={<UserGroupIcon className="w-6 h-6"/>}>Meetings</NavItem>
            <NavItem viewName="calendar" activeView={currentView} setView={setCurrentView} icon={<CalendarDaysIcon className="w-6 h-6"/>}>Update Calendar</NavItem>
            <NavItem viewName="homework" activeView={currentView} setView={setCurrentView} icon={<PencilSquareIcon className="w-6 h-6"/>}>Homeworks</NavItem>
            <NavItem viewName="admissions" activeView={currentView} setView={setCurrentView} icon={<ShareIcon className="w-6 h-6"/>}>Share code(ENQ/ADM)</NavItem>
        </>
    );

    const parentNavItems = (
         <>
            <NavItem viewName="dashboard" activeView={currentView} setView={setCurrentView} icon={<ChartPieIcon className="w-6 h-6"/>}>Dashboard</NavItem>
            <NavItem viewName="myChildren" activeView={currentView} setView={setCurrentView} icon={<FaceSmileIcon className="w-6 h-6"/>}>My Children & Profile</NavItem>
            <NavItem viewName="shareCode" activeView={currentView} setView={setCurrentView} icon={<ShareIcon className="w-6 h-6"/>}>Shareable Codes</NavItem>
            <NavItem viewName="attendance" activeView={currentView} setView={setCurrentView} icon={<DocumentCheckIcon className="w-6 h-6"/>}>Attendance</NavItem>
            <NavItem viewName="grades" activeView={currentView} setView={setCurrentView} icon={<ChartBarIcon className="w-6 h-6"/>}>Grades & Reports</NavItem>
            <NavItem viewName="fees" activeView={currentView} setView={setCurrentView} icon={<CurrencyDollarIcon className="w-6 h-6"/>}>School Fees</NavItem>
        </>
    );

    const settingsNavItems = (
        <>
            {role === RoleEnum.School && <NavItem viewName="profile" activeView={currentView} setView={setCurrentView} icon={<BuildingLibraryIcon className="w-6 h-6"/>}>School Profile</NavItem>}
            <NavItem viewName="settings" activeView={currentView} setView={setCurrentView} icon={<Cog8ToothIcon className="w-6 h-6"/>}>Settings</NavItem>
        </>
    );

    const renderContent = () => {
        if (role === RoleEnum.School) {
            if (isLoading || (!school && !needsRegistration)) return null;
    
            switch (currentView) {
                case 'dashboard':
                    return <SchoolDashboardOverviewTab school={school!} />;
                case 'profile':
                    return <SchoolProfileTab schoolProfile={school!} onProfileUpdate={setSchool} />;
                case 'admissions':
                    return <CodeLookupTab school={school!} />;
                case 'students':
                    return <AdmittedStudentsTab school={school!} />;
                case 'faculty':
                    return <FacultyManagementPage onBackToDashboard={() => setCurrentView('dashboard')} />;
                case 'attendance':
                    return <AttendanceManagementPage onBackToDashboard={() => setCurrentView('dashboard')} />;
                case 'finance':
                    return <FinancialManagementPage onBackToDashboard={() => setCurrentView('dashboard')} />;
                case 'courses':
                    return <CourseManagementPage onBackToDashboard={() => setCurrentView('dashboard')} />;
                case 'meetings':
                    return <MeetingManagementPage onBackToDashboard={() => setCurrentView('dashboard')} />;
                case 'calendar':
                    return <EventCalendarPage />;
                case 'homework':
                    return <HomeworkManagementPage onBackToDashboard={() => setCurrentView('dashboard')} />;
                case 'settings':
                    return <div className="p-8 text-center"><h2 className="text-2xl font-bold">{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h2><p className="mt-2 text-slate-500">This feature is coming soon!</p></div>;
                default:
                    return null;
            }
        }

        if (role === RoleEnum.Parent) {
            switch (currentView) {
                case 'dashboard':
                    return <ParentDashboardOverviewTab user={user} onNavigate={setCurrentView} />;
                case 'myChildren':
                    // FIX: Pass the `onBackToDashboard` prop to the `ParentProfilePage` component to satisfy its required props and fix a type error.
                    return <ParentProfilePage user={user} onLogout={onLogout} onBackToRoles={onBackToRoles} onBackToDashboard={() => setCurrentView('dashboard')} onViewStudentPortal={setViewingStudentPortalFor} />;
                case 'shareCode':
                    return <ParentShareCodePage user={user} onBackToDashboard={() => setCurrentView('dashboard')} />;
                case 'attendance':
                    return <ParentAttendancePage onBackToDashboard={() => setCurrentView('dashboard')} />;
                case 'grades':
                    return <ParentGradesPage onBackToDashboard={() => setCurrentView('dashboard')} />;
                case 'fees':
                    return <ParentFinancialsPage onBackToDashboard={() => setCurrentView('dashboard')} />;
                 case 'settings':
                     return <div className="p-8 text-center"><h2 className="text-2xl font-bold">Settings</h2><p className="mt-2 text-slate-500">This feature is coming soon!</p></div>;
                default:
                    return null;
            }
        }

        return null;
    };

    if (role === RoleEnum.School) {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            );
        }
        
        if (needsRegistration) {
            return <SchoolRegistrationPage user={user} onRegistrationSuccess={fetchSchoolProfile} />;
        }

        if (error && !school) {
            return (
                 <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                    <p className="text-red-500 font-semibold">An error occurred:</p>
                    <p className="text-red-500 mt-2">{error}</p>
                    <button onClick={fetchSchoolProfile} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Try Again</button>
                </div>
            );
        }
    }


    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 px-3 py-2 mb-6">
                        <AcademicCapIcon className="h-8 w-8 text-orange-500"/>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">SM Info.</span>
                    </div>
                    <ul className="space-y-2">
                        {role === RoleEnum.School ? schoolNavItems : parentNavItems}
                    </ul>
                </div>
                <ul className="space-y-2 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                    {settingsNavItems}
                </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Header */}
                 <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{role === RoleEnum.School ? 'School Dashboard' : 'Parent Portal'}</h1>
                        <p className="mt-1 text-base text-slate-500 dark:text-slate-400">{role === RoleEnum.School ? `Welcome back, ${user.user_metadata?.fullName || 'Admin'}.` : `Welcome, ${user.user_metadata?.fullName || 'Parent'}!`}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"><StarIcon className="w-5 h-5"/></button>
                        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"><MoonIcon className="w-5 h-5"/></button>
                        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"><BellIcon className="w-5 h-5"/></button>
                        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"><ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5"/></button>
                        <div className="relative">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2">
                                <img className="h-9 w-9 rounded-full object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop" alt="User" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:inline">{user.user_metadata?.fullName || (role === RoleEnum.School ? 'Admin' : 'Parent')}</span>
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

                {/* Content Area */}
                <div className="bg-transparent dark:bg-transparent rounded-2xl">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};