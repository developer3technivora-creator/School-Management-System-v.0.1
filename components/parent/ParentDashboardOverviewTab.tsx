import React from 'react';
import type { User } from '../../types';
import { FaceSmileIcon, DocumentCheckIcon, ChartBarIcon, CurrencyDollarIcon, ShareIcon } from '../Icons';

const DashboardCard: React.FC<{ title: string, description: string, icon: React.ReactNode, onClick: () => void }> = ({ title, description, icon, onClick }) => (
    <button onClick={onClick} className="group p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-md hover:shadow-xl dark:hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer transition-all duration-300 border border-slate-200 dark:border-slate-700/80 text-left w-full">
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-300">
                {icon}
            </div>
            <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h4>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </div>
        </div>
    </button>
);

interface ParentDashboardOverviewTabProps {
    user: User;
    onNavigate: (view: any) => void;
}

export const ParentDashboardOverviewTab: React.FC<ParentDashboardOverviewTabProps> = ({ user, onNavigate }) => {
    const features = [
        { icon: <FaceSmileIcon className="w-6 h-6" />, title: 'My Children & Profile', description: 'Manage family and child profiles.', view: 'myChildren' },
        { icon: <ShareIcon className="w-6 h-6" />, title: 'Shareable Codes', description: 'Generate codes to share with the school.', view: 'shareCode' },
        { icon: <DocumentCheckIcon className="w-6 h-6" />, title: 'Attendance Records', description: 'Track attendance for each child.', view: 'attendance' },
        { icon: <ChartBarIcon className="w-6 h-6" />, title: 'Grades & Reports', description: 'Access report cards and performance.', view: 'grades' },
        { icon: <CurrencyDollarIcon className="w-6 h-6" />, title: 'School Fees', description: 'View and pay outstanding school fees.', view: 'fees' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(feature => (
                <DashboardCard 
                    key={feature.title}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    onClick={() => onNavigate(feature.view)}
                />
            ))}
        </div>
    );
};