import React, { useState, useEffect, useMemo } from 'react';
import type { Student, Course, Homework, TimetableEntry, SchoolEvent } from '../../types';
import { Subject } from '../../types';
import { 
    ClockIcon, 
    ClipboardDocumentListIcon,
    XCircleIcon,
    AcademicCapIcon,
    BeakerIcon,
    BookOpenIcon,
    BuildingLibraryIcon,
    PaintBrushIcon,
    MusicalNoteIcon,
    TrophyIcon,
    ComputerDesktopIcon,
    LanguageIcon,
    SignalIcon,
    CalendarDaysIcon
} from '../Icons';
import { mockStudentTimetable, subjectColors, subjectIcons, mockCourses, mockHomeworks, mockEvents } from '../../data/mockData';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 01:00', '01:00 - 02:00', '02:00 - 03:00'];
const schoolDayStartHour = 9;
const schoolDayEndHour = 15;

const BriefingCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white dark:bg-slate-800/60 p-5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 h-full">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-slate-500 dark:text-slate-400">{icon}</div>
            <h4 className="font-semibold text-slate-500 dark:text-slate-400">{title}</h4>
        </div>
        {children}
    </div>
);

const SubjectIcon: React.FC<{ subject: Subject, className: string }> = ({ subject, className }) => {
    const iconName = subjectIcons[subject];
    switch(iconName) {
        case 'AcademicCapIcon': return <AcademicCapIcon className={className} />;
        case 'BeakerIcon': return <BeakerIcon className={className} />;
        case 'BookOpenIcon': return <BookOpenIcon className={className} />;
        case 'BuildingLibraryIcon': return <BuildingLibraryIcon className={className} />;
        case 'PaintBrushIcon': return <PaintBrushIcon className={className} />;
        case 'MusicalNoteIcon': return <MusicalNoteIcon className={className} />;
        case 'TrophyIcon': return <TrophyIcon className={className} />;
        case 'ComputerDesktopIcon': return <ComputerDesktopIcon className={className} />;
        case 'LanguageIcon': return <LanguageIcon className={className} />;
        default: return null;
    }
};

type EnrichedCourse = Course & { teacher: string; room: string; };

const ClassDetailModal: React.FC<{ course: EnrichedCourse | null; onClose: () => void }> = ({ course, onClose }) => {
    if (!course) return null;

    const relevantHomework = mockHomeworks.filter(hw => hw.subject === course.subject && hw.gradeLevel === course.gradeLevel);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
            <div className="relative w-full max-w-lg p-4" onClick={e => e.stopPropagation()}>
                <div className="relative bg-white rounded-2xl shadow dark:bg-slate-800">
                    <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-slate-600">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{course.courseName}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{course.teacher} • Room {course.room}</p>
                        </div>
                        <button type="button" onClick={onClose} className="p-1.5 text-slate-400 bg-transparent hover:bg-slate-200 rounded-lg dark:hover:bg-slate-600">
                            <XCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                        <div>
                            <h4 className="font-semibold mb-1 text-slate-800 dark:text-slate-200">Description</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{course.description || "No description available."}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Upcoming Assignments</h4>
                            {relevantHomework.length > 0 ? (
                                <ul className="space-y-2">
                                    {relevantHomework.map(hw => (
                                        <li key={hw.id} className="text-sm p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{hw.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Due: {hw.dueDate}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400 italic">No assignments for this course.</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-end p-4 border-t border-slate-200 dark:border-slate-600">
                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">View Course Materials</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const StudentTimetablePage: React.FC<{ student: Student }> = ({ student }) => {
    const [view, setView] = useState<'week' | 'day'>('week');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedClass, setSelectedClass] = useState<EnrichedCourse | null>(null);
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000); // Update every second for countdown
        return () => clearInterval(timer);
    }, []);

    const { currentClass, nextClass, homeworkDueToday, eventsToday, todaySchedule } = useMemo(() => {
        const day = currentTime.toLocaleString('en-US', { weekday: 'long' });
        const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        
        let current: TimetableEntry | null = null;
        let next: TimetableEntry | null = null;

        const schedule = mockStudentTimetable
            .filter(slot => slot.day === day && mockCourses.find(c => c.subject === slot.subject)?.gradeLevel.includes(student.academic_info.grade))
            .sort((a, b) => parseInt(a.time.split(':')[0]) - parseInt(b.time.split(':')[0]));

        for (const slot of schedule) {
            const [startTime, endTime] = slot.time.split(' - ');
            const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
            const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

            if (nowMinutes >= startMinutes && nowMinutes < endMinutes) current = slot;
            else if (nowMinutes < startMinutes && !next) next = slot;
        }
        
        const dueToday = mockHomeworks.filter(hw => hw.dueDate === getTodayDateString() && hw.gradeLevel.includes(student.academic_info.grade));
        const todaysEvents = mockEvents.filter(e => e.startDate === getTodayDateString());
        
        return { currentClass: current, nextClass: next, homeworkDueToday: dueToday, eventsToday: todaysEvents, todaySchedule: schedule };
    }, [currentTime, student.academic_info.grade]);
    
    useEffect(() => {
        if (!nextClass) {
            setCountdown('');
            return;
        }
        const now = new Date();
        const [startHour, startMinute] = nextClass.time.split(' - ')[0].split(':').map(Number);
        const nextClassTime = new Date();
        nextClassTime.setHours(startHour, startMinute, 0, 0);
        
        const diff = nextClassTime.getTime() - now.getTime();
        
        if (diff <= 0) {
            setCountdown('Starting now');
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);

    }, [currentTime, nextClass]);

    const timetableGrid = useMemo(() => {
        const grid = new Map<string, Map<string, TimetableEntry>>();
        timeSlots.forEach(time => {
            const dayMap = new Map<string, TimetableEntry>();
            daysOfWeek.forEach(day => {
                const entry = mockStudentTimetable.find(e => e.day === day && e.time === time && (mockCourses.find(c => c.subject === e.subject)?.gradeLevel.includes(student.academic_info.grade)));
                if (entry) dayMap.set(day, entry);
            });
            grid.set(time, dayMap);
        });
        return grid;
    }, [student.academic_info.grade]);

    const handleClassClick = (entry: TimetableEntry) => {
        const courseDetails = mockCourses.find(c => c.subject === entry.subject && c.gradeLevel.includes(student.academic_info.grade));
        if (courseDetails) {
            setSelectedClass({ ...courseDetails, teacher: entry.teacher, room: entry.room });
        }
    };
    
    const totalMinutes = (schoolDayEndHour - schoolDayStartHour) * 60;
    const elapsedMinutes = Math.max(0, (currentTime.getHours() - schoolDayStartHour) * 60 + currentTime.getMinutes());
    const progressPercent = Math.min(100, (elapsedMinutes / totalMinutes) * 100);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <ClockIcon className="w-8 h-8 text-blue-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">My Timetable</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your weekly class schedule for Grade {student.academic_info.grade}.</p>
                </div>
            </div>

            <div className="p-6 bg-blue-50 dark:bg-slate-800/80 rounded-2xl shadow-inner-lg border border-blue-100 dark:border-slate-700/80">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4">Today's Briefing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <BriefingCard title="Next Class In" icon={<ClockIcon className="w-5 h-5"/>}>
                        <p className="text-3xl font-bold font-mono text-blue-600 dark:text-blue-400 truncate">{countdown || "All Done!"}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{nextClass?.subject || "No more classes"}</p>
                    </BriefingCard>
                    <BriefingCard title="In Progress" icon={<SignalIcon className="w-5 h-5"/>}>
                        <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{currentClass?.subject || "Break Time"}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{currentClass?.time || "Enjoy your break"}</p>
                    </BriefingCard>
                    <BriefingCard title="Assignments Due" icon={<ClipboardDocumentListIcon className="w-5 h-5"/>}>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{homeworkDueToday.length} Assignment(s)</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{homeworkDueToday.map(h => h.title).join(', ') || 'Nothing due today!'}</p>
                    </BriefingCard>
                    <BriefingCard title="Today's Events" icon={<CalendarDaysIcon className="w-5 h-5"/>}>
                         <p className="text-xl font-bold text-slate-900 dark:text-white">{eventsToday.length} Event(s)</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{eventsToday.map(e => e.title).join(', ') || 'No events scheduled'}</p>
                    </BriefingCard>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <button onClick={() => setView('week')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>Week View</button>
                <button onClick={() => setView('day')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${view === 'day' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>Day View</button>
            </div>
            
            {view === 'week' ? (
                 <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400 table-fixed">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                            <tr>
                                <th scope="col" className="px-4 py-3 w-32">Time</th>
                                {daysOfWeek.map(day => <th key={day} scope="col" className="px-4 py-3 text-center">{day}</th>)}
                            </tr>
                        </thead>
                        <tbody className="relative">
                            {progressPercent > 0 && progressPercent < 100 && currentTime.getDay() >= 1 && currentTime.getDay() <= 5 && (
                                <div className="absolute w-full h-0.5 bg-red-500 z-10" style={{ top: `calc(${progressPercent}% + 1px)` }}>
                                    <div className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500"></div>
                                </div>
                            )}
                            {timeSlots.map(time => (
                                <tr key={time} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                    <th scope="row" className="px-4 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{time}</th>
                                    {daysOfWeek.map(day => {
                                        const entry = timetableGrid.get(time)?.get(day);
                                        const subjectClass = entry?.subject && Subject[entry.subject as keyof typeof Subject] ? `bg-gradient-to-br ${subjectColors[entry.subject as Subject]}` : 'bg-transparent';
                                        const nonSubjectClasses = 'bg-slate-50 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500';

                                        return (
                                            <td key={`${time}-${day}`} className="px-1 py-1 text-center border-l border-slate-100 dark:border-slate-700/50">
                                                {entry ? (
                                                    <button onClick={() => handleClassClick(entry)} className={`w-full h-full rounded-lg p-2 flex flex-col justify-center items-start text-left transition-transform hover:scale-105 ${entry.subject === 'Lunch' || entry.subject === 'Free Period' ? nonSubjectClasses : subjectClass}`}>
                                                        <div className="w-full flex justify-between items-start">
                                                            <p className="font-bold text-xs sm:text-sm">{entry.subject}</p>
                                                            {entry.subject !== 'Lunch' && entry.subject !== 'Free Period' && <SubjectIcon subject={entry.subject} className="w-4 h-4 opacity-70 hidden sm:block"/>}
                                                        </div>
                                                        {entry.teacher && <p className="text-xs opacity-80 mt-1 w-full">{entry.teacher}</p>}
                                                    </button>
                                                ) : <div className="h-20"></div>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="relative p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    {progressPercent > 0 && progressPercent < 100 && (
                        <div className="absolute left-0 right-0 h-0.5 bg-red-500 z-10" style={{ top: `calc(3rem + ${progressPercent}%)` }}>
                            <div className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500"></div>
                            <span className="absolute left-3 -top-2.5 text-xs font-mono bg-red-500 text-white px-1.5 py-0.5 rounded-full">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    )}
                    <div className="space-y-4">
                        {todaySchedule.length > 0 ? todaySchedule.map((entry, index) => {
                             const subjectClass = entry?.subject && Subject[entry.subject as keyof typeof Subject] ? `bg-gradient-to-br ${subjectColors[entry.subject as Subject]}` : 'bg-transparent';
                             const nonSubjectClasses = 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
                            
                            return (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-24 text-right">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{entry.time.split(' - ')[0]}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{entry.time.split(' - ')[1]}</p>
                                    </div>
                                    <button onClick={() => handleClassClick(entry)} className={`flex-1 p-4 rounded-lg flex justify-between items-center transition-shadow hover:shadow-md ${entry.subject === 'Lunch' || entry.subject === 'Free Period' ? nonSubjectClasses : subjectClass}`}>
                                        <div>
                                            <p className="font-bold">{entry.subject}</p>
                                            <p className="text-sm opacity-90">{entry.teacher} • Room {entry.room}</p>
                                        </div>
                                        {entry.subject !== 'Lunch' && entry.subject !== 'Free Period' && <SubjectIcon subject={entry.subject} className="w-6 h-6 opacity-80"/>}
                                    </button>
                                </div>
                            )
                        }) : (
                             <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                                <p className="font-semibold">No classes scheduled for today.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {selectedClass && <ClassDetailModal course={selectedClass} onClose={() => setSelectedClass(null)} />}
        </div>
    );
};