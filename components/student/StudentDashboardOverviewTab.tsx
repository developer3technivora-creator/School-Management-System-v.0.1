import React from 'react';
import type { Student } from '../../types';
import { ClockIcon, PencilSquareIcon, ChartBarIcon, BookOpenIcon, CalendarDaysIcon, MegaphoneIcon } from '../Icons';
import type { StudentDashboardView } from './StudentDashboardPage';

const SummaryCard: React.FC<{ title: string; value: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, value, icon, onClick }) => (
    <button onClick={onClick} className="p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-start gap-4 text-left hover:shadow-xl hover:-translate-y-1 transition-all">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-500 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="font-semibold text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </button>
);

const QuickLinkCard: React.FC<{ title: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, icon, onClick }) => (
    <button onClick={onClick} className="p-5 w-full bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
        <div className="p-3 bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-full mb-2">
            {icon}
        </div>
        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{title}</p>
    </button>
);

export const StudentDashboardOverviewTab: React.FC<{ student: Student; onNavigate: (view: StudentDashboardView) => void }> = ({ student, onNavigate }) => {
    // Mock data for demonstration
    const upcomingAssignments = 2;
    const nextClass = { time: '10:00 AM', name: 'English Literature' };
    const recentGrade = { course: 'World History', grade: 'A' };
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Welcome, {student.full_name.split(' ')[0]}!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard 
                    title="Next Class" 
                    value={nextClass.name} 
                    icon={<ClockIcon className="w-6 h-6"/>}
                    onClick={() => onNavigate('timetable')}
                />
                <SummaryCard 
                    title="Assignments Due" 
                    value={`${upcomingAssignments} this week`}
                    icon={<PencilSquareIcon className="w-6 h-6"/>}
                    onClick={() => onNavigate('assignments')}
                />
                <SummaryCard 
                    title="Recent Grade" 
                    value={recentGrade.grade}
                    icon={<ChartBarIcon className="w-6 h-6"/>}
                    onClick={() => onNavigate('grades')}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg mb-4">Today's Schedule</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-4">
                            <span className="font-semibold text-slate-500 dark:text-slate-400 w-20">09:00 AM</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">Algebra II</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="font-semibold text-slate-500 dark:text-slate-400 w-20">10:00 AM</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">English Literature</span>
                        </li>
                         <li className="flex items-center gap-4">
                            <span className="font-semibold text-slate-500 dark:text-slate-400 w-20">11:00 AM</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">Free Period</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="font-semibold text-slate-500 dark:text-slate-400 w-20">12:00 PM</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">Lunch</span>
                        </li>
                         <li className="flex items-center gap-4">
                            <span className="font-semibold text-slate-500 dark:text-slate-400 w-20">01:00 PM</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">World History</span>
                        </li>
                    </ul>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <QuickLinkCard title="My Courses" icon={<BookOpenIcon className="w-6 h-6"/>} onClick={() => onNavigate('courses')} />
                        <QuickLinkCard title="Assignments" icon={<PencilSquareIcon className="w-6 h-6"/>} onClick={() => onNavigate('assignments')} />
                        <QuickLinkCard title="Check Grades" icon={<ChartBarIcon className="w-6 h-6"/>} onClick={() => onNavigate('grades')} />
                        <QuickLinkCard title="Timetable" icon={<CalendarDaysIcon className="w-6 h-6"/>} onClick={() => onNavigate('timetable')} />
                        <QuickLinkCard title="School News" icon={<MegaphoneIcon className="w-6 h-6"/>} onClick={() => onNavigate('announcements')} />
                        <QuickLinkCard title="Library" icon={<BookOpenIcon className="w-6 h-6"/>} onClick={() => alert('Library feature coming soon!')} />
                    </div>
                </div>
            </div>
        </div>
    );
};
