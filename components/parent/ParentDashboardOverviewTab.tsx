import React from 'react';
import type { User } from '../../types';
import { FaceSmileIcon, DocumentCheckIcon, ChartBarIcon, CurrencyDollarIcon, ShareIcon, ArrowRightIcon } from '../Icons';
import { mockChildren } from '../../data/mockData';

const KeyMetricCard: React.FC<{ title: string, value: string, icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        </div>
    </div>
);

const ChildCard: React.FC<{ child: typeof mockChildren[0], onNavigate: (view: any) => void }> = ({ child, onNavigate }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col">
        <div className="p-5 flex items-center gap-4">
            <img 
                className="h-16 w-16 rounded-full object-cover border-4 border-slate-100 dark:border-slate-700" 
                src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${child.fullName.split(' ')[0]}`} 
                alt={child.fullName} 
            />
            <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{child.fullName}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{child.grade}</p>
            </div>
        </div>
        <div className="px-5 pb-5 mt-auto">
             <div className="flex -space-x-px">
                <button onClick={() => onNavigate('attendance')} className="w-full relative inline-flex items-center justify-center rounded-l-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <DocumentCheckIcon className="w-5 h-5 mr-2"/> Attendance
                </button>
                <button onClick={() => onNavigate('grades')} className="w-full relative inline-flex items-center justify-center border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <ChartBarIcon className="w-5 h-5 mr-2"/> Grades
                </button>
                 <button onClick={() => onNavigate('myChildren')} className="w-full relative inline-flex items-center justify-center rounded-r-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <ArrowRightIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    </div>
);

interface ParentDashboardOverviewTabProps {
    user: User;
    onNavigate: (view: any) => void;
}

export const ParentDashboardOverviewTab: React.FC<ParentDashboardOverviewTabProps> = ({ user, onNavigate }) => {
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Welcome, {user.user_metadata?.fullName || 'Parent'}!
                </h1>
                <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
                    Here’s a summary of your children's progress and school updates.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <KeyMetricCard title="Attendance This Month" value="98%" icon={<DocumentCheckIcon className="w-6 h-6"/>} color="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300" />
                <KeyMetricCard title="Overdue Fees" value="$0.00" icon={<CurrencyDollarIcon className="w-6 h-6"/>} color="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" />
                <KeyMetricCard title="New Grades" value="3" icon={<ChartBarIcon className="w-6 h-6"/>} color="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300" />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Your Children</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockChildren.map(child => (
                        <ChildCard key={child.id} child={child} onNavigate={onNavigate} />
                    ))}
                </div>
            </div>
        </div>
    );
};
