import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Course } from '../../../types';
import { Subject } from '../../../types';
import { ArrowUturnLeftIcon, BookOpenIcon, PlusIcon, MagnifyingGlassIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from '../../Icons';
import { AddEditCourseModal } from './AddEditCourseModal';
import { mockCourses } from '../../../data/mockData';

const getSubjectStyle = (subject: Subject) => {
    switch (subject) {
        case Subject.Mathematics: return { tagClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300', borderClass: 'border-blue-500' };
        case Subject.Science: return { tagClass: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', borderClass: 'border-green-500' };
        case Subject.English: return { tagClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300', borderClass: 'border-purple-500' };
        case Subject.History: return { tagClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300', borderClass: 'border-amber-500' };
        case Subject.Art: return { tagClass: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300', borderClass: 'border-pink-500' };
        case Subject.Music: return { tagClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300', borderClass: 'border-indigo-500' };
        case Subject.PhysicalEducation: return { tagClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300', borderClass: 'border-orange-500' };
        case Subject.ComputerScience: return { tagClass: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300', borderClass: 'border-teal-500' };
        case Subject.ForeignLanguage: return { tagClass: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300', borderClass: 'border-rose-500' };
        default: return { tagClass: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300', borderClass: 'border-slate-500' };
    }
};

const CourseCard: React.FC<{
    course: Course;
    onEdit: (course: Course) => void;
    onDelete: (id: string) => void;
    onMenuToggle: (id: string | null) => void;
    isMenuOpen: boolean;
}> = ({ course, onEdit, onDelete, onMenuToggle, isMenuOpen }) => {
    const style = getSubjectStyle(course.subject);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onMenuToggle(null);
            }
        };
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen, onMenuToggle]);

    return (
        <div className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/80 border-t-4 ${style.borderClass} flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${style.tagClass}`}>{course.subject}</span>
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => onMenuToggle(isMenuOpen ? null : course.id)} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                            <EllipsisVerticalIcon className="w-5 h-5" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-10 border dark:border-slate-700 py-1">
                                <a href="#" onClick={(e) => { e.preventDefault(); onEdit(course); onMenuToggle(null); }} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"><PencilIcon className="w-4 h-4" /> Edit</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); onDelete(course.id); onMenuToggle(null); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"><TrashIcon className="w-4 h-4" /> Delete</a>
                            </div>
                        )}
                    </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-2">{course.courseName}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 h-10">{course.description || 'No description available.'}</p>
            </div>
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 rounded-b-xl border-t dark:border-slate-700/80 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>CODE: <span className="font-semibold text-slate-600 dark:text-slate-300">{course.courseCode}</span></span>
                <span>GRADE: <span className="font-semibold text-slate-600 dark:text-slate-300">{course.gradeLevel}</span></span>
            </div>
        </div>
    );
};

export const CourseManagementPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [courses, setCourses] = useState<Course[]>(mockCourses);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const openAddModal = () => { setEditingCourse(null); setIsModalOpen(true); };
    const openEditModal = (course: Course) => { setEditingCourse(course); setIsModalOpen(true); };
    const handleDeleteCourse = (courseId: string) => { if (window.confirm('Are you sure you want to delete this course?')) setCourses(prev => prev.filter(c => c.id !== courseId)); };
    const handleSaveCourse = (course: Course) => {
        if (editingCourse) setCourses(prev => prev.map(c => c.id === course.id ? course : c));
        else setCourses(prev => [...prev, { ...course, id: `C${Date.now()}` }]);
        setIsModalOpen(false);
    };

    const filteredCourses = useMemo(() => {
        return courses
            .filter(course => selectedSubject === 'All' || course.subject === selectedSubject)
            .filter(course => 
                course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [courses, searchTerm, selectedSubject]);

    // FIX: Using Array.from(new Set(...)) to ensure correct type inference, resolving an issue where the spread syntax resulted in 'unknown[]'.
    const allSubjects: Subject[] = Array.from(new Set(courses.map(c => c.subject)));

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-slate-100 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <BookOpenIcon className="w-10 h-10 text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Course Management</h1>
                            <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">Add, edit, and manage all academic courses.</p>
                        </div>
                    </div>
                    <button onClick={onBackToDashboard} className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700">
                        <ArrowUturnLeftIcon className="h-5 w-5" /><span>Dashboard</span>
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl dark:border dark:border-slate-700 p-6">
                     <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="relative w-full md:w-80">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><MagnifyingGlassIcon className="w-5 h-5 text-slate-400" /></div>
                            <input type="text" placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <button onClick={openAddModal} className="flex items-center justify-center gap-2 w-full md:w-auto px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                            <PlusIcon className="h-5 w-5" /><span>Create Course</span>
                        </button>
                    </div>
                    
                    <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                        <div className="flex flex-wrap items-center gap-2 pb-4">
                            <button onClick={() => setSelectedSubject('All')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${selectedSubject === 'All' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>All</button>
                            {allSubjects.map(subject => (
                                <button key={subject} onClick={() => setSelectedSubject(subject)} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${selectedSubject === subject ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>{subject}</button>
                            ))}
                        </div>
                    </div>
                    
                    {filteredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map(course => (
                                <CourseCard key={course.id} course={course} onEdit={openEditModal} onDelete={handleDeleteCourse} onMenuToggle={setOpenMenuId} isMenuOpen={openMenuId === course.id} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-slate-500 dark:text-slate-400">No courses found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <AddEditCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveCourse} course={editingCourse} />
            )}
        </div>
    );
};