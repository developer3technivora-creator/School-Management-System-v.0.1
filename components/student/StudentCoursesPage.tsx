import React from 'react';
import type { Student } from '../../types';
import { BookOpenIcon } from '../Icons';
import { initialCourses as allCourses } from '../school/courses/CourseManagementPage';

// Mock data for teachers. This could be expanded or moved to a central place in a real app.
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


export const StudentCoursesPage: React.FC<{ student: Student }> = ({ student }) => {
    const studentGrade = normalizeGrade(student.academic_info.grade);
    const studentCourses = allCourses.filter(c => normalizeGrade(c.gradeLevel) === studentGrade);

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