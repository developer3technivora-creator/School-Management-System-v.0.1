import React from 'react';
import type { User, Role } from '../types';
import { Role as RoleEnum } from '../types';
import { 
    ArrowLeftOnRectangleIcon, 
    UserCircleIcon,
    AcademicCapIcon,
    UserGroupIcon,
    BriefcaseIcon,
    BuildingLibraryIcon,
    TruckIcon,
    ShoppingCartIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
    CalendarDaysIcon,
    MegaphoneIcon,
    FaceSmileIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    DocumentCheckIcon,
    ClockIcon,
    BookOpenIcon,
    PencilSquareIcon,
    PresentationChartLineIcon,
    MapIcon,
    ClipboardDocumentCheckIcon,
    WrenchScrewdriverIcon,
    TagIcon,
    CircleStackIcon,
    QueueListIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
    ShareIcon
} from './Icons';
import type { AppView } from '../../App';


interface DashboardPageProps {
    user: User;
    role: Role;
    onLogout: () => void;
    onBackToRoles: () => void;
    onNavigate: (view: AppView) => void;
}

const DashboardCard: React.FC<{ icon: React.ReactNode, title: string, description: string, onClick?: () => void }> = ({ icon, title, description, onClick }) => {
    const isClickable = !!onClick;
    const Component = isClickable ? 'button' : 'div';

    return (
        <Component
            onClick={onClick}
            className={`group relative p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-md ${isClickable ? 'hover:shadow-xl dark:hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer' : ''} transition-all duration-300 border border-slate-200 dark:border-slate-700/80 text-left w-full`}
        >
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-300">
                    {icon}
                </div>
                <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h4>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </div>
            </div>
        </Component>
    );
};

const roleSpecificData = {
    [RoleEnum.School]: {
        icon: <BuildingLibraryIcon className="w-24 h-24 text-slate-400 dark:text-slate-500 mb-4 sm:mb-0 sm:mr-8" />,
        features: (onNavigate: DashboardPageProps['onNavigate']) => [
            { icon: <UsersIcon className="w-6 h-6" />, title: 'Student Management', description: 'Add, view, and manage student profiles.', onClick: () => onNavigate('studentManagement') },
            { icon: <DocumentCheckIcon className="w-6 h-6" />, title: 'Attendance Management', description: 'Track daily student attendance records.', onClick: () => onNavigate('attendanceManagement') },
            { icon: <CurrencyDollarIcon className="w-6 h-6" />, title: 'Financial Management', description: 'Manage invoices and fee collection.', onClick: () => onNavigate('financialManagement') },
            { icon: <MegaphoneIcon className="w-6 h-6" />, title: 'Announcements', description: 'Broadcast news to all users.', onClick: () => onNavigate('announcements') },
            { icon: <CalendarDaysIcon className="w-6 h-6" />, title: 'Event Calendar', description: 'Manage and publish school events.', onClick: () => onNavigate('eventCalendar') },
            { icon: <Cog6ToothIcon className="w-6 h-6" />, title: 'Administration', description: 'Manage staff, roles, and school settings.', onClick: () => onNavigate('administration') },
            { icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, title: 'Parental Communication', description: 'Send messages and alerts to parents.', onClick: () => onNavigate('parentalCommunication') }
        ]
    },
    [RoleEnum.Parent]: {
        icon: <UserGroupIcon className="w-24 h-24 text-slate-400 dark:text-slate-500 mb-4 sm:mb-0 sm:mr-8" />,
        features: (onNavigate: DashboardPageProps['onNavigate']) => [
            { icon: <FaceSmileIcon className="w-6 h-6" />, title: 'My Children & Profile', description: 'Manage family and child profiles.', onClick: () => onNavigate('myChildren') },
            { icon: <ShareIcon className="w-6 h-6" />, title: 'Shareable Codes', description: 'Generate codes to share with the school.', onClick: () => onNavigate('shareCode') },
            { icon: <DocumentCheckIcon className="w-6 h-6" />, title: 'Attendance Records', description: 'Track attendance for each child.', onClick: () => onNavigate('attendance') },
            { icon: <ChartBarIcon className="w-6 h-6" />, title: 'Grades & Reports', description: 'Access report cards and performance.', onClick: () => onNavigate('grades') },
            { icon: <CurrencyDollarIcon className="w-6 h-6" />, title: 'School Fees', description: 'View and pay outstanding school fees.', onClick: () => onNavigate('fees') },
        ]
    },
    [RoleEnum.Student]: {
        icon: <AcademicCapIcon className="w-24 h-24 text-slate-400 dark:text-slate-500 mb-4 sm:mb-0 sm:mr-8" />,
        features: () => [
            { icon: <ClockIcon className="w-6 h-6" />, title: 'My Timetable', description: 'Check your daily class schedule.' },
            { icon: <PencilSquareIcon className="w-6 h-6" />, title: 'Assignments', description: 'View and submit your assignments.' },
            { icon: <ChartBarIcon className="w-6 h-6" />, title: 'My Grades', description: 'See your latest grades and results.' },
            { icon: <BookOpenIcon className="w-6 h-6" />, title: 'Library', description: 'Browse and borrow books from the library.' }
        ]
    },
    [RoleEnum.Teacher]: {
        icon: <BriefcaseIcon className="w-24 h-24 text-slate-400 dark:text-slate-500 mb-4 sm:mb-0 sm:mr-8" />,
        features: () => [
            { icon: <PresentationChartLineIcon className="w-6 h-6" />, title: 'My Classes', description: 'Manage your classes and students.' },
            { icon: <PencilSquareIcon className="w-6 h-6" />, title: 'Gradebook', description: 'Enter and manage student grades.' },
            { icon: <BookOpenIcon className="w-6 h-6" />, title: 'Lesson Plans', description: 'Create and organize lesson materials.' },
            { icon: <DocumentCheckIcon className="w-6 h-6" />, title: 'Student Attendance', description: 'Mark and track student attendance.' }
        ]
    },
    [RoleEnum.Transport]: {
        icon: <TruckIcon className="w-24 h-24 text-slate-400 dark:text-slate-500 mb-4 sm:mb-0 sm:mr-8" />,
        features: () => [
            { icon: <MapIcon className="w-6 h-6" />, title: 'Bus Routes', description: 'View and manage transport routes.' },
            { icon: <ClipboardDocumentCheckIcon className="w-6 h-6" />, title: 'Student Manifest', description: 'Check student ridership lists.' },
            { icon: <MegaphoneIcon className="w-6 h-6" />, title: 'Send Alerts', description: 'Notify parents about delays or changes.' },
            { icon: <WrenchScrewdriverIcon className="w-6 h-6" />, title: 'Vehicle Maintenance', description: 'Log and track vehicle service records.' }
        ]
    },
    [RoleEnum.ECommerce]: {
        icon: <ShoppingCartIcon className="w-24 h-24 text-slate-400 dark:text-slate-500 mb-4 sm:mb-0 sm:mr-8" />,
        features: () => [
            { icon: <TagIcon className="w-6 h-6" />, title: 'Product Catalog', description: 'Manage school supplies and uniforms.' },
            { icon: <QueueListIcon className="w-6 h-6" />, title: 'Orders', description: 'View and process incoming orders.' },
            { icon: <CircleStackIcon className="w-6 h-6" />, title: 'Inventory', description: 'Track stock levels of all products.' },
            { icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, title: 'Customer Support', description: 'Respond to customer inquiries.' }
        ]
    },
};

const RoleSpecificContent: React.FC<{ role: Role, onNavigate: DashboardPageProps['onNavigate'] }> = ({ role, onNavigate }) => {
    const data = roleSpecificData[role];
    if (!data) return null;
    
    // The features property is now a function that needs onNavigate
    const features = typeof data.features === 'function' ? data.features(onNavigate) : data.features;

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map(feature => <DashboardCard key={feature.title} {...feature} />)}
            </div>
        </div>
    );
};


export const DashboardPage: React.FC<DashboardPageProps> = ({ user, role, onLogout, onBackToRoles, onNavigate }) => {
    const roleIcon = roleSpecificData[role]?.icon || <UserCircleIcon className="w-24 h-24 text-slate-400 dark:text-slate-500 mb-4 sm:mb-0 sm:mr-8" />;
    
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="w-full p-8 bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl dark:border dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                        {roleIcon}
                        <div className="flex-grow">
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                {/* FIX: Safely access email and provide a fallback as the email property is now optional on the User type. */}
                                Welcome, {user.user_metadata?.fullName || user.email?.split('@')[0] || 'User'}!
                            </h1>
                            <p className="mt-2 text-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold rounded-full px-4 py-1 inline-block">
                                {role} Dashboard
                            </p>
                        </div>
                    </div>
                     <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-end gap-4">
                         <button
                            onClick={onBackToRoles}
                            className="px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                        >
                            Change Role
                        </button>
                        <button
                            onClick={onLogout}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-800 transition-colors duration-200"
                        >
                            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                <div className="w-full p-8 mt-8 bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl dark:border dark:border-slate-700">
                    <RoleSpecificContent role={role} onNavigate={onNavigate} />
                </div>
            </div>
        </div>
    );
};