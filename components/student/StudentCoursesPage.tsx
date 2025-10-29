import React from 'react';
import type { Student, Course } from '../../types';
import { Subject } from '../../types';
import { BookOpenIcon } from '../Icons';

// Mock course data, filtered by grade level
const allCourses: Course[] = [
    { id: 'C101', courseName: 'Algebra 1', courseCode: 'MATH-101', gradeLevel: '9th Grade', subject: Subject.Mathematics },
    { id: 'C102', courseName: 'Biology', courseCode: 'SCI-101', gradeLevel: '9th Grade', subject: Subject.Science },
    { id: 'C201', courseName: 'American Literature', courseCode: 'ENG-201', gradeLevel: '10th Grade', subject: Subject.English },
    { id: 'C202', courseName: 'Geometry', courseCode: 'MATH-201', gradeLevel: '10th Grade', subject: Subject.Mathematics },
    { id: 'C203', courseName: 'World History', courseCode: 'HIST-201', gradeLevel: '10th Grade', subject: Subject.History },
    { id: 'C204', courseName: 'Chemistry', courseCode: 'SCI-201', gradeLevel: '10th Grade', subject: Subject.Science },
    { id: 'C301', courseName: 'US History', courseCode: 'HIST-301', gradeLevel: '11th Grade', subject: Subject.History },
];

const mockTeachers: Record<string, string> = {
    'American Literature': 'Ms. Davis',
    'Geometry': 'Mr. Smith',
    'World History': 'Mrs. Jones',
    'Chemistry': 'Dr. Chen',
};

export const StudentCoursesPage: React.FC<{ student: Student }> = ({ student }) => {
    const studentCourses = allCourses.filter(c => c.gradeLevel === student.academic_info.grade);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <BookOpenIcon className="w-8 h-8 text-blue-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">My Courses</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Subjects you are enrolled in this semester.</p>
                </div>
            </div>

            <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Course Name</th>
                            <th scope="col" className="px-6 py-3">Course Code</th>
                            <th scope="col" className="px-6 py-3">Subject</th>
                            <th scope="col" className="px-6 py-3">Teacher</th>
                            <th scope="col" className="px-6 py-3">Materials</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentCourses.map(course => (
                            <tr key={course.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{course.courseName}</td>
                                <td className="px-6 py-4">{course.courseCode}</td>
                                <td className="px-6 py-4">{course.subject}</td>
                                <td className="px-6 py-4">{mockTeachers[course.courseName] || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <button className="font-medium text-blue-600 dark:text-blue-400 hover:underline">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};