import React, { useState } from 'react';
import type { Course } from '../../../types';
import { Subject } from '../../../types';
import { ArrowUturnLeftIcon, BookOpenIcon, PlusIcon } from '../../Icons';
import { AddEditCourseModal } from './AddEditCourseModal';
import { CourseTable } from './CourseTable';

const initialCourses: Course[] = [
    { id: 'C101', courseName: 'Algebra 1', courseCode: 'MATH-101', gradeLevel: '9th Grade', subject: Subject.Mathematics, description: 'Fundamental concepts of algebra.' },
    { id: 'C102', courseName: 'Biology', courseCode: 'SCI-101', gradeLevel: '9th Grade', subject: Subject.Science, description: 'Introduction to biological sciences.' },
    { id: 'C201', courseName: 'American Literature', courseCode: 'ENG-201', gradeLevel: '10th Grade', subject: Subject.English, description: 'Study of American authors and their works.' },
    { id: 'C301', courseName: 'World History', courseCode: 'HIST-301', gradeLevel: '11th Grade', subject: Subject.History, description: 'A survey of world history from ancient times to the present.' },
];

export const CourseManagementPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const openAddModal = () => {
        setEditingCourse(null);
        setIsModalOpen(true);
    };

    const openEditModal = (course: Course) => {
        setEditingCourse(course);
        setIsModalOpen(true);
    };

    const handleDeleteCourse = (courseId: string) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            setCourses(prev => prev.filter(c => c.id !== courseId));
        }
    };

    const handleSaveCourse = (course: Course) => {
        if (editingCourse) {
            setCourses(prev => prev.map(c => c.id === course.id ? course : c));
        } else {
            setCourses(prev => [...prev, { ...course, id: `C${Date.now()}` }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <BookOpenIcon className="w-10 h-10 text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Course Management
                            </h1>
                            <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">
                                Add, edit, and manage all academic courses.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onBackToDashboard}
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                        >
                            <ArrowUturnLeftIcon className="h-5 w-5" />
                            <span>Dashboard</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl dark:border dark:border-slate-700 p-6">
                     <div className="flex justify-end items-center mb-6">
                        <button
                            onClick={openAddModal}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Create New Course</span>
                        </button>
                    </div>
                    <CourseTable 
                        courses={courses} 
                        onEdit={openEditModal}
                        onDelete={handleDeleteCourse}
                    />
                </div>
            </div>

            {isModalOpen && (
                <AddEditCourseModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveCourse}
                    course={editingCourse}
                />
            )}
        </div>
    );
};