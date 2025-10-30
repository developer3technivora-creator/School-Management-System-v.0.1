import React, { useState, useEffect, useMemo } from 'react';
import type { Student, Course, Homework } from '../../types';
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
    SignalIcon
} from '../Icons';
import { mockStudentTimetable, subjectColors, subjectIcons, mockCourses, mockHomeworks } from '../../data/mockData';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 01:00', '01:00 - 02:00', '02:00 - 03:00'];
const schoolDayStartHour = 9;
const schoolDayEndHour = 15;

const BriefingCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white dark:bg-slate-800/60 p-5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
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

type TimetableEntry = {
    day: string;
    time: string;
    subject: Subject | 'Lunch' | 'Free Period';
    teacher: string;
};

type EnrichedCourse = Course & { teacher: string };

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
                            <p className="text-sm text-slate-500 dark:text-slate-400">{course.teacher} • {course.subject}</p>
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
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedClass, setSelectedClass] = useState<EnrichedCourse | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

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

    const { currentClass, nextClass, homeworkDueToday } = useMemo(() => {
        const day = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
        const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        
        let current: TimetableEntry | null = null;
        let next: TimetableEntry | null = null;

        const todaySchedule = mockStudentTimetable
            .filter(slot => slot.day === day)
            .sort((a, b) => parseInt(a.time.split(':')[0]) - parseInt(b.time.split(':')[0]));

        for (const slot of todaySchedule) {
            const [startTime, endTime] = slot.time.split(' - ');
            const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
            const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

            if (nowMinutes >= startMinutes && nowMinutes < endMinutes) current = slot;
            else if (nowMinutes < startMinutes && !next) next = slot;
        }

        const dueToday = mockHomeworks.filter(hw => hw.dueDate === getTodayDateString() && hw.gradeLevel.includes(student.academic_info.grade));
        
        return { currentClass: current, nextClass: next, homeworkDueToday: dueToday };
    }, [currentTime, student.academic_info.grade]);

    const handleClassClick = (entry: TimetableEntry) => {
        const courseDetails = mockCourses.find(c => c.subject === entry.subject && c.gradeLevel.includes(student.academic_info.grade));
        if (courseDetails) {
            setSelectedClass({ ...courseDetails, teacher: entry.teacher });
        }
    };
    
    const totalMinutes = (schoolDayEndHour - schoolDayStartHour) * 60;
    const elapsedMinutes = (currentTime.getHours() - schoolDayStartHour) * 60 + currentTime.getMinutes();
    const progressPercent = Math.max(0, Math.min(100, (elapsedMinutes / totalMinutes) * 100));

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <ClockIcon className="w-8 h-8 text-blue-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">My Timetable</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your weekly class schedule for Grade {student.academic_info.grade}.</p>
                </div>
            </div>

            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Daily Briefing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BriefingCard title="In Progress" icon={<SignalIcon className="w-5 h-5"/>}>
                    <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{currentClass?.subject || "No class"}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{currentClass?.time || "You're on a break"}</p>
                </BriefingCard>
                 <BriefingCard title="Next Up" icon={<ClockIcon className="w-5 h-5"/>}>
                    <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{nextClass?.subject || "End of day"}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{nextClass?.time || "Enjoy your evening!"}</p>
                </BriefingCard>
                <BriefingCard title="Homework Due Today" icon={<ClipboardDocumentListIcon className="w-5 h-5"/>}>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{homeworkDueToday.length} Assignment(s)</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                        {homeworkDueToday.map(h => h.title).join(', ') || 'No homework due today!'}
                    </p>
                </BriefingCard>
            </div>
            
            <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400 table-fixed">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-4 py-3 w-32">Time</th>
                            {daysOfWeek.map(day => (
                                <th key={day} scope="col" className="px-4 py-3 text-center">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="relative">
                        {progressPercent > 0 && progressPercent < 100 && currentTime.getDay() >= 1 && currentTime.getDay() <= 5 && (
                             <div className="absolute w-full h-0.5 bg-red-500 z-10" style={{ top: `${progressPercent}%` }}>
                                <div className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500"></div>
                            </div>
                        )}
                        {timeSlots.map(time => (
                            <tr key={time} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                <th scope="row" className="px-4 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{time}</th>
                                {daysOfWeek.map(day => {
                                    const entry = timetableGrid.get(time)?.get(day);
                                    const subjectClass = entry?.subject && Subject[entry.subject as keyof typeof Subject]
                                        ? `text-white ${subjectColors[entry.subject as Subject]}`
                                        : 'bg-transparent';
                                    const nonSubjectClasses = 'bg-slate-50 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500';

                                    return (
                                        <td key={`${time}-${day}`} className="px-1 py-1 text-center border-l border-slate-100 dark:border-slate-700/50">
                                            {entry ? (
                                                <button onClick={() => handleClassClick(entry)} className={`w-full h-full rounded-lg p-2 flex flex-col justify-center items-center text-left transition-transform hover:scale-105 ${entry.subject === 'Lunch' || entry.subject === 'Free Period' ? nonSubjectClasses : subjectClass}`}>
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
            {selectedClass && <ClassDetailModal course={selectedClass} onClose={() => setSelectedClass(null)} />}
        </div>
    );
};