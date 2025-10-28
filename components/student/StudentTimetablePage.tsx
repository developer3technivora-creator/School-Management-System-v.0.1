import React from 'react';
import type { Student } from '../../types';
import { ClockIcon } from '../Icons';

// Mock data for a student's timetable
const mockTimetable = {
    '09:00 - 10:00': ['Algebra II', 'Physics', 'Algebra II', 'Physics', 'Study Hall'],
    '10:00 - 11:00': ['English Lit.', 'Chemistry', 'English Lit.', 'Chemistry', 'English Lit.'],
    '11:00 - 12:00': ['Free Period', 'World History', 'Free Period', 'World History', 'Art'],
    '12:00 - 01:00': ['Lunch', 'Lunch', 'Lunch', 'Lunch', 'Lunch'],
    '01:00 - 02:00': ['World History', 'English Lit.', 'Physical Ed.', 'Algebra II', 'Chemistry'],
    '02:00 - 03:00': ['Physics', 'Free Period', 'Computer Sci.', 'Free Period', 'Computer Sci.'],
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = Object.keys(mockTimetable);

export const StudentTimetablePage: React.FC<{ student: Student }> = ({ student }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <ClockIcon className="w-8 h-8 text-blue-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">My Timetable</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your weekly class schedule for {student.grade}.</p>
                </div>
            </div>
            
            <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Time</th>
                            {daysOfWeek.map(day => (
                                <th key={day} scope="col" className="px-6 py-3 text-center">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map(time => (
                            <tr key={time} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                                    {time}
                                </th>
                                {mockTimetable[time as keyof typeof mockTimetable].map((subject, dayIndex) => (
                                    <td key={`${time}-${dayIndex}`} className="px-6 py-4 text-center">
                                        {subject === 'Lunch' || subject === 'Free Period' || subject === 'Study Hall'
                                            ? <span className="text-slate-400">{subject}</span>
                                            : <span className="font-semibold">{subject}</span>
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};