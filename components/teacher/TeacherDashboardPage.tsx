import React, { useState } from 'react';
import type { User, Role } from '../../types';
import { 
    ArrowLeftOnRectangleIcon, 
    ChevronDownIcon,
    MoonIcon,
    BellIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    StarIcon,
    Cog8ToothIcon,
    AcademicCapIcon,
    ChartPieIcon,
    PresentationChartLineIcon,
    PencilSquareIcon,
    BookOpenIcon,
    DocumentCheckIcon,
    BriefcaseIcon,
} from '../Icons';
import { TeacherDashboardOverviewTab } from './TeacherDashboardOverviewTab';


export type TeacherDashboardView = 'dashboard' | 'classes' | 'gradebook' | 'assignments' | 'lessonPlans' | 'attendance' | 'communication' | 'settings';

const NavItem: React.FC<{
    viewName: TeacherDashboardView;
    activeView: TeacherDashboardView;
    setView: (view: TeacherDashboardView) => void;
    icon: React.ReactNode;
    children: React.ReactNode;
}> = ({ viewName, activeView, setView, icon, children }) => {
    const isActive = activeView === viewName;
    return (
        <li>
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); setView(viewName); }}
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

interface TeacherDashboardPageProps {
    user: User;
    role: Role;
    onLogout: () => void;
    onBackToRoles: () => void;
}

export const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({ user, role, onLogout, onBackToRoles }) => {
    const [currentView, setCurrentView] = useState<TeacherDashboardView>('dashboard');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return <TeacherDashboardOverviewTab user={user} onNavigate={setCurrentView} />;
            // Add cases for other views here when they are built
            case 'classes':
            case 'gradebook':
            case 'assignments':
            case 'lessonPlans':
            case 'attendance':
            case 'communication':
            case 'settings':
            default:
                return <div className="p-8 text-center"><h2 className="text-2xl font-bold">{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h2><p className="mt-2 text-slate-500">This feature is coming soon!</p></div>;
        }
    };
    
    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
            <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 px-3 py-2 mb-6">
                        <BriefcaseIcon className="h-8 w-8 text-blue-500"/>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">Teacher Portal</span>
                    </div>
                    <ul className="space-y-2">
                        <NavItem viewName="dashboard" activeView={currentView} setView={setCurrentView} icon={<ChartPieIcon className="w-6 h-6"/>}>Dashboard</NavItem>
                        <NavItem viewName="classes" activeView={currentView} setView={setCurrentView} icon={<PresentationChartLineIcon className="w-6 h-6"/>}>My Classes</NavItem>
                        <NavItem viewName="gradebook" activeView={currentView} setView={setCurrentView} icon={<PencilSquareIcon className="w-6 h-6"/>}>Gradebook</NavItem>
                        <NavItem viewName="assignments" activeView={currentView} setView={setCurrentView} icon={<PencilSquareIcon className="w-6 h-6"/>}>Assignments</NavItem>
                        <NavItem viewName="lessonPlans" activeView={currentView} setView={setCurrentView} icon={<BookOpenIcon className="w-6 h-6"/>}>Lesson Plans</NavItem>
                        <NavItem viewName="attendance" activeView={currentView} setView={setCurrentView} icon={<DocumentCheckIcon className="w-6 h-6"/>}>Attendance</NavItem>
                        <NavItem viewName="communication" activeView={currentView} setView={setCurrentView} icon={<ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6"/>}>Communication</NavItem>
                    </ul>
                </div>
                <ul className="space-y-2 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                    <NavItem viewName="settings" activeView={currentView} setView={setCurrentView} icon={<Cog8ToothIcon className="w-6 h-6"/>}>Settings</NavItem>
                </ul>
            </aside>

            <main className="flex-1 p-6">
                 <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Teacher Dashboard</h1>
                        <p className="mt-1 text-base text-slate-500 dark:text-slate-400">Welcome back, {user.user_metadata?.fullName || 'Teacher'}!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"><StarIcon className="w-5 h-5"/></button>
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
