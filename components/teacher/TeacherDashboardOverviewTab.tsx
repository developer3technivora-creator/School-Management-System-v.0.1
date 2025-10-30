import React, { useState, useEffect, useMemo } from 'react';
import type { User, TimetableEntry, Homework } from '../../types';
import { 
    ClockIcon, 
    PencilSquareIcon, 
    ChartBarIcon, 
    DocumentCheckIcon, 
    MegaphoneIcon, 
    PlusIcon 
} from '../Icons';
import type { TeacherDashboardView } from './TeacherDashboardPage';
import { mockStudentTimetable, mockHomeworks, mockAttendanceRecords } from '../../data/mockData';

const SummaryCard: React.FC<{ title: string; value: string; subtext?: string; icon: React.ReactNode; }> = ({ title, value, subtext, icon }) => (
    <div className="p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-start gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-500 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="font-semibold text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">{value}</p>
            {subtext && <p className="text-xs text-slate-500 dark:text-slate-400">{subtext}</p>}
        </div>
    </div>
);

const QuickActionCard: React.FC<{ title: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, icon, onClick }) => (
    <button onClick={onClick} className="p-4 w-full bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-left hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors">
        <div className="p-2.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
            {icon}
        </div>
        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{title}</p>
    </button>
);


export const TeacherDashboardOverviewTab: React.FC<{ user: User; onNavigate: (view: TeacherDashboardView) => void }> = ({ user, onNavigate }) => {
    // For demonstration, we'll hardcode the teacher's name. In a real app, this would come from the user object.
    const teacherName = user.user_metadata?.fullName || 'Emily White';
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000); // Update every second
        return () => clearInterval(timer);
    }, []);

    const teacherData = useMemo(() => {
        const today = currentTime.toLocaleString('en-US', { weekday: 'long' });
        const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

        const teacherSchedule = mockStudentTimetable.filter(slot => slot.teacher === teacherName);

        const todaySchedule = teacherSchedule
            .filter(slot => slot.day === today)
            .sort((a, b) => parseInt(a.time.split(':')[0]) - parseInt(b.time.split(':')[0]));

        let currentClass: TimetableEntry | null = null;
        let nextClass: TimetableEntry | null = null;

        for (const slot of todaySchedule) {
            const [startTime, endTime] = slot.time.split(' - ');
            const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
            const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
            if (nowMinutes >= startMinutes && nowMinutes < endMinutes) {
                currentClass = slot;
            } else if (startMinutes > nowMinutes && !nextClass) {
                nextClass = slot;
            }
        }
        
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(currentTime.getDate() + 7);
        const upcomingAssignments = mockHomeworks.filter(hw => {
            const dueDate = new Date(hw.dueDate);
            return hw.teacher === teacherName && dueDate >= currentTime && dueDate <= oneWeekFromNow;
        });

        // Mock attendance calculation
        const totalStudentsInClasses = 50; // Mock value
        const presentToday = mockAttendanceRecords.filter(r => r.date === new Date().toISOString().split('T')[0] && r.status === 'Present').length;
        const attendancePercentage = totalStudentsInClasses > 0 ? ((presentToday / totalStudentsInClasses) * 100).toFixed(0) : 'N/A';
        
        return { todaySchedule, currentClass, nextClass, upcomingAssignments, attendancePercentage };
    }, [currentTime, teacherName]);
    
    const { todaySchedule, currentClass, nextClass, upcomingAssignments, attendancePercentage } = teacherData;
    
    const [countdown, setCountdown] = useState('');
    useEffect(() => {
        if (!nextClass) { setCountdown(''); return; }
        const [startHour, startMinute] = nextClass.time.split(' - ')[0].split(':').map(Number);
        const nextClassTime = new Date(currentTime);
        nextClassTime.setHours(startHour, startMinute, 0, 0);
        
        const diff = nextClassTime.getTime() - currentTime.getTime();
        if (diff <= 0) { setCountdown('Starting now'); return; }

        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, [currentTime, nextClass]);


    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Welcome, {teacherName.split(' ')[0]}!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard 
                    title={currentClass ? "Current Class" : "Next Class"}
                    value={currentClass?.subject || nextClass?.subject || "No more classes"}
                    subtext={currentClass ? `Ends at ${currentClass.time.split(' - ')[1]}` : (nextClass ? `Starts in ${countdown}`: "Your day is done!")}
                    icon={<ClockIcon className="w-6 h-6"/>}
                />
                <SummaryCard 
                    title="Assignments Due Soon" 
                    value={`${upcomingAssignments.length} this week`}
                    icon={<PencilSquareIcon className="w-6 h-6"/>}
                />
                <SummaryCard 
                    title="Today's Attendance" 
                    value={`${attendancePercentage}%`}
                    subtext="Present"
                    icon={<DocumentCheckIcon className="w-6 h-6"/>}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200">Today's Schedule</h3>
                    <ul className="space-y-3">
                        {todaySchedule.length > 0 ? todaySchedule.map((slot, index) => (
                            <li key={index} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <span className="font-semibold text-blue-600 dark:text-blue-400 w-24">{slot.time}</span>
                                <div className="flex-grow">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{slot.subject}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Room: {slot.room}</p>
                                </div>
                            </li>
                        )) : (
                            <li className="text-slate-500 dark:text-slate-400 text-center py-8">No classes scheduled for today.</li>
                        )}
                    </ul>
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                           <QuickActionCard title="Mark Attendance" icon={<DocumentCheckIcon className="w-5 h-5"/>} onClick={() => onNavigate('attendance')} />
                           <QuickActionCard title="Enter Grades" icon={<ChartBarIcon className="w-5 h-5"/>} onClick={() => onNavigate('gradebook')} />
                           <QuickActionCard title="New Assignment" icon={<PlusIcon className="w-5 h-5"/>} onClick={() => onNavigate('assignments')} />
                           <QuickActionCard title="Send Announcement" icon={<MegaphoneIcon className="w-5 h-5"/>} onClick={() => alert('Feature coming soon!')} />
                        </div>
                    </div>
                     <div className="p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200">Upcoming Assignments</h3>
                        <ul className="space-y-2">
                           {upcomingAssignments.slice(0, 3).map(hw => (
                               <li key={hw.id} className="text-sm">
                                   <p className="font-semibold text-slate-700 dark:text-slate-200">{hw.title}</p>
                                   <p className="text-xs text-slate-500 dark:text-slate-400">{hw.gradeLevel} • Due {hw.dueDate}</p>
                               </li>
                           ))}
                           {upcomingAssignments.length === 0 && <p className="text-sm text-slate-500">No assignments due this week.</p>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
