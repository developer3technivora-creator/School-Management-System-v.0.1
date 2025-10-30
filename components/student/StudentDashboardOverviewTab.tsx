import React, { useMemo } from 'react';
import type { Student, TimetableEntry } from '../../types';
import { ClockIcon, PencilSquareIcon, ChartBarIcon, BookOpenIcon, CalendarDaysIcon, MegaphoneIcon } from '../Icons';
import type { StudentDashboardView } from './StudentDashboardPage';
import { mockStudentTimetable, mockHomeworks, mockAcademicData, mockCourses } from '../../data/mockData';

const SummaryCard: React.FC<{ title: string; value: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, value, icon, onClick }) => (
    <button onClick={onClick} className="p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-start gap-4 text-left hover:shadow-xl hover:-translate-y-1 transition-all">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-500 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="font-semibold text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">{value}</p>
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

const normalizeGrade = (grade: string): string => {
    const gradeString = String(grade).toLowerCase();
    const numberMatch = gradeString.match(/\d+/);
    return numberMatch ? numberMatch[0] : gradeString;
};

export const StudentDashboardOverviewTab: React.FC<{ student: Student; onNavigate: (view: StudentDashboardView) => void }> = ({ student, onNavigate }) => {
    
    const studentData = useMemo(() => {
        const now = new Date();
        const today = now.toLocaleString('en-US', { weekday: 'long' });
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const studentGrade = normalizeGrade(student.academic_info.grade);

        const studentCoursesForGrade = mockCourses
            .filter(c => normalizeGrade(c.gradeLevel) === studentGrade)
            .map(c => c.subject);

        // 1. Today's Schedule and Next Class
        const todaySchedule = mockStudentTimetable
            .filter(slot => {
                if (slot.day !== today) return false;
                if (slot.subject === 'Lunch' || slot.subject === 'Free Period') return true;
                return studentCoursesForGrade.includes(slot.subject);
            })
            .sort((a, b) => {
                const aStart = parseInt(a.time.split(':')[0]);
                const bStart = parseInt(b.time.split(':')[0]);
                return aStart - bStart;
            });
        
        let nextClass: TimetableEntry | null = null;
        for (const slot of todaySchedule) {
            const [startTime] = slot.time.split(' - ');
            const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
            if (startMinutes > nowMinutes) {
                if (typeof slot.subject === 'string' && slot.subject !== 'Lunch' && slot.subject !== 'Free Period') {
                    nextClass = slot;
                    break;
                }
            }
        }

        // 2. Assignments Due this week
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(now.getDate() + 7);
        const upcomingAssignments = mockHomeworks.filter(hw => {
            const dueDate = new Date(hw.dueDate);
            return normalizeGrade(hw.gradeLevel) === studentGrade && dueDate >= now && dueDate <= oneWeekFromNow;
        }).length;

        // 3. Recent Grade
        const studentGrades = mockAcademicData[student.id] || [];
        const recentGrade = studentGrades.length > 0 ? studentGrades[studentGrades.length - 1] : null;

        return {
            todaySchedule,
            nextClass,
            upcomingAssignments,
            recentGrade
        };
    }, [student.academic_info.grade, student.id]);

    const { todaySchedule, nextClass, upcomingAssignments, recentGrade } = studentData;
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Welcome, {student.personal_info.full_name.split(' ')[0]}!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard 
                    title="Next Class" 
                    value={nextClass ? (typeof nextClass.subject === 'string' ? nextClass.subject : 'N/A') : 'No more classes'} 
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
                    value={recentGrade ? recentGrade.grade : 'N/A'}
                    icon={<ChartBarIcon className="w-6 h-6"/>}
                    onClick={() => onNavigate('grades')}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg mb-4">Today's Schedule</h3>
                    <ul className="space-y-3">
                        {todaySchedule.length > 0 ? todaySchedule.map((slot, index) => (
                            <li key={index} className="flex items-center gap-4">
                                <span className="font-semibold text-slate-500 dark:text-slate-400 w-20">{slot.time.split(' - ')[0]}</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{slot.subject}</span>
                            </li>
                        )) : (
                            <li className="text-slate-500 dark:text-slate-400">No classes scheduled for today.</li>
                        )}
                    </ul>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <QuickLinkCard title="My Classes" icon={<BookOpenIcon className="w-6 h-6"/>} onClick={() => onNavigate('classes')} />
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
