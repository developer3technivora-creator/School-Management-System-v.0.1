import React, { useMemo } from 'react';
import type { Student, Subject } from '../../types';
import { 
    BookOpenIcon,
    AcademicCapIcon,
    BeakerIcon,
    BuildingLibraryIcon,
    PaintBrushIcon,
    MusicalNoteIcon,
    TrophyIcon,
    ComputerDesktopIcon,
    LanguageIcon,
} from '../Icons';
import { mockCourses as allCourses, mockStudentTimetable, subjectIcons } from '../../data/mockData';

const mockTeachers: Record<string, string> = {
    'English': 'Emily White',
    'English I': 'Emily White',
    'English II': 'Emily White',
    'English Composition': 'Emily White',
    'Hindi': 'Priya Sharma',
    'Hindi I': 'Priya Sharma',
    'Hindi II': 'Priya Sharma',
    'Mathematics': 'David Black',
    'Algebra I': 'David Black',
    'Geometry': 'David Black',
    'Science': 'Dr. Chen',
    'Biology': 'Dr. Chen',
    'Chemistry': 'Dr. Chen',
    'Social Studies': 'Laura Grey',
    'World Geography': 'Laura Grey',
    'World History': 'Laura Grey',
    'Technology & Computer': 'Robert Brown',
    'Introduction to Computer Science': 'Robert Brown',
    'AP Computer Science Principles': 'Robert Brown',
};

const normalizeGrade = (grade: string): string => {
    const gradeString = String(grade).toLowerCase();
    const numberMatch = gradeString.match(/\d+/);
    return numberMatch ? numberMatch[0] : gradeString;
};

const subjectHeaderColors: { [key in Subject]: string } = {
    "Mathematics": 'bg-blue-500',
    "Science": 'bg-green-500',
    "English": 'bg-purple-500',
    "History": 'bg-amber-500',
    "Art": 'bg-pink-500',
    "Music": 'bg-indigo-500',
    "Physical Education": 'bg-orange-500',
    "Computer Science": 'bg-teal-500',
    "Foreign Language": 'bg-rose-500',
};

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
        default: return <BookOpenIcon className={className} />;
    }
};

export const StudentCoursesPage: React.FC<{ student: Student }> = ({ student }) => {
    const studentGrade = normalizeGrade(student.academic_info.grade);
    const studentCourses = allCourses.filter(c => normalizeGrade(c.gradeLevel) === studentGrade);

    const scheduleBySubject = useMemo(() => {
        const scheduleMap = new Map<Subject, string[]>();
        mockStudentTimetable.forEach(slot => {
            if (slot.subject !== 'Lunch' && slot.subject !== 'Free Period') {
                if (!scheduleMap.has(slot.subject)) {
                    scheduleMap.set(slot.subject, []);
                }
                scheduleMap.get(slot.subject)!.push(`${slot.day.substring(0,3)} ${slot.time.split(' - ')[0]}`);
            }
        });
        return scheduleMap;
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <BookOpenIcon className="w-8 h-8 text-blue-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">My Classes</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your enrolled subjects, teachers, and weekly schedule.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentCourses.map(course => {
                    const schedule = scheduleBySubject.get(course.subject) || [];
                    const teacherName = mockTeachers[course.courseName] || 'N/A';
                    const headerColor = subjectHeaderColors[course.subject] || 'bg-slate-500';

                    return (
                        <div key={course.id} className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg transition-transform hover:-translate-y-1 overflow-hidden border border-slate-200 dark:border-slate-700/80">
                            <div className={`${headerColor} text-white p-4 rounded-t-xl flex items-center gap-3`}>
                                <SubjectIcon subject={course.subject} className="w-8 h-8 opacity-80" />
                                <h4 className="font-bold text-lg">{course.subject}</h4>
                            </div>
                            <div className="p-5">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate" title={course.courseName}>{course.courseName}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Taught by {teacherName}</p>
                                
                                <div className="mt-4">
                                    <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Schedule</h5>
                                    {schedule.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {schedule.map(s => (
                                                <span key={s} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono px-2 py-1 rounded">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                     ) : (
                                        <p className="text-xs text-slate-400 italic mt-2">Not scheduled this week.</p>
                                     )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};