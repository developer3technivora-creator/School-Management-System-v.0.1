import React from 'react';
import type { Course } from '../../../types';
import { PencilIcon, TrashIcon } from '../../Icons';

interface CourseTableProps {
    courses: Course[];
    onEdit: (course: Course) => void;
    onDelete: (id: string) => void;
}

export const CourseTable: React.FC<CourseTableProps> = ({ courses, onEdit, onDelete }) => {
    if (courses.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 py-8">No courses found. Get started by creating one!</p>;
    }

    return (
        <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Course Name</th>
                        <th scope="col" className="px-6 py-3">Course Code</th>
                        <th scope="col" className="px-6 py-3">Grade Level</th>
                        <th scope="col" className="px-6 py-3">Subject</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{course.courseName}</td>
                            <td className="px-6 py-4">{course.courseCode}</td>
                            <td className="px-6 py-4">{course.gradeLevel}</td>
                            <td className="px-6 py-4">{course.subject}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-1">
                                    <button onClick={() => onEdit(course)} className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Edit Course">
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => onDelete(course.id)} className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Delete Course">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};