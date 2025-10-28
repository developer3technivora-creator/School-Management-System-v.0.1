import React from 'react';
import { supabase } from '../../services/supabase';
import type { School } from '../../types';
import { 
    UsersIcon, 
    AcademicCapIcon, 
    BriefcaseIcon, 
    CurrencyDollarIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '../Icons';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => (
    <div className={`p-5 rounded-2xl text-white shadow-lg ${color}`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-4xl font-bold">{value}</p>
                <p className="text-sm opacity-90">{title}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
                {icon}
            </div>
        </div>
    </div>
);

const ManagementValueChart = () => (
    <div className="p-6 bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Management Value</h3>
        <div className="h-48">
            <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
                <path d="M 0 80 C 40 60, 80 90, 120 70 S 200 20, 240 50 S 320 100, 360 80, 400 60" fill="none" stroke="#fb923c" strokeWidth="3" />
                <path d="M 0 100 C 40 110, 80 90, 120 100 S 200 130, 240 110 S 320 90, 360 110, 400 100" fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="3 3"/>
            </svg>
        </div>
    </div>
);

const DonutChart = () => (
    <div className="p-6 bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg h-full flex flex-col justify-between">
        <div className="relative w-32 h-32 mx-auto">
            <div 
                className="absolute inset-0 rounded-full"
                style={{ background: 'conic-gradient(#06b6d4 0% 60%, #a855f7 60% 95%, #f59e0b 95% 100%)' }}
            ></div>
            <div className="absolute inset-2 bg-white dark:bg-slate-800/60 rounded-full flex items-center justify-center">
                 <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">80%</span>
            </div>
        </div>
        <div className="flex justify-around text-xs mt-4">
            <div className="text-center"><span className="font-bold">60%</span><p className="text-slate-500">Male</p></div>
            <div className="text-center"><span className="font-bold">35%</span><p className="text-slate-500">Female</p></div>
            <div className="text-center"><span className="font-bold">5%</span><p className="text-slate-500">Out Of</p></div>
        </div>
    </div>
);

const SubjectTaskChart = () => {
    const subjects = [
        { name: 'Mathematics', progress: '90%', color: 'bg-orange-400' },
        { name: 'English', progress: '60%', color: 'bg-purple-500' },
        { name: 'Physics', progress: '70%', color: 'bg-cyan-400' },
        { name: 'English SP', progress: '40%', color: 'bg-blue-500' },
    ];
    return (
        <div className="p-6 bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg col-span-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Subject Task</h3>
            <div className="space-y-4">
                {subjects.map(s => (
                     <div key={s.name}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{s.name}</span>
                            <span className="text-slate-500">{s.progress}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                            <div className={`${s.color} h-2.5 rounded-full`} style={{ width: s.progress }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CalendarWidget = () => (
    <div className="p-4 bg-slate-800 text-white rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <button><ChevronLeftIcon className="w-5 h-5"/></button>
            <h4 className="font-bold text-sm">January 2020</h4>
            <button><ChevronRightIcon className="w-5 h-5"/></button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs text-slate-400">
            {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => <div key={day} className="py-1">{day}</div>)}
        </div>
         <div className="grid grid-cols-7 text-center text-sm">
            {[29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1].map((day, i) => (
                <div key={i} className={`py-1.5 ${i < 3 || i > 33 ? 'text-slate-500' : ''} ${day === 10 ? 'bg-orange-500 rounded-full' : ''}`}>{day}</div>
            ))}
        </div>
    </div>
);

const TopStudentsWidget = () => {
    const students = [
        { name: 'Lucas Jones', score: '80%' },
        { name: 'Lucas Jones', score: '80%' },
        { name: 'Lucas Jones', score: '80%' },
    ];
    return (
        <div className="p-6 bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg">
             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Top Students</h3>
             <div className="space-y-4">
                {students.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" alt="student"/>
                        <div>
                            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{s.name}</p>
                            <p className="text-xs text-slate-500">Allower score {s.score}</p>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
}

const GroupsWidget = () => {
    const groups = [
        { name: "Teacher's Group", description: 'Wade Wairen, T. Fating issue...' },
        { name: "Class 10th", description: 'These formulas include...' },
        { name: "Notice Board", description: 'Pair of new Equations...' },
    ];
     return (
        <div className="p-6 bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg">
             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Groups</h3>
             <div className="space-y-4">
                {groups.map((g, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex-shrink-0"></div>
                        <div>
                            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{g.name}</p>
                            <p className="text-xs text-slate-500">{g.description}</p>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};

export const SchoolDashboardOverviewTab: React.FC<{ school: School }> = ({ school }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat Cards */}
            <StatCard title="Students" value="1256" icon={<AcademicCapIcon className="w-6 h-6"/>} color="bg-gradient-to-br from-orange-400 to-orange-600"/>
            <StatCard title="Teachers" value="102" icon={<BriefcaseIcon className="w-6 h-6"/>} color="bg-gradient-to-br from-purple-400 to-purple-600"/>
            <StatCard title="Private Teachers" value="102" icon={<UsersIcon className="w-6 h-6"/>} color="bg-gradient-to-br from-cyan-400 to-cyan-600"/>
            <StatCard title="Total Revenue" value="$62532" icon={<CurrencyDollarIcon className="w-6 h-6"/>} color="bg-gradient-to-br from-indigo-500 to-indigo-700"/>

            {/* Main Grid */}
            <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ManagementValueChart />
                </div>
                <div>
                     <DonutChart />
                </div>
                <div className="lg:col-span-3">
                    <SubjectTaskChart />
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                 <CalendarWidget />
                 <TopStudentsWidget />
                 <GroupsWidget />
            </div>
        </div>
    );
};