import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Course } from '../../../types';
import { Subject } from '../../../types';
import { ArrowUturnLeftIcon, BookOpenIcon, PlusIcon, MagnifyingGlassIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from '../../Icons';
import { AddEditCourseModal } from './AddEditCourseModal';

export const initialCourses: Course[] = [
  // Grade 1
  { id: 'C011', courseName: 'English', courseCode: 'ENG-011', gradeLevel: '1st Grade', subject: Subject.English, description: 'Introduces basic phonics, reading, and writing skills for first graders.' },
  { id: 'C012', courseName: 'English Composition', courseCode: 'ENG-012', gradeLevel: '1st Grade', subject: Subject.English, description: 'Focuses on forming simple sentences and basic storytelling.' },
  { id: 'C013', courseName: 'Hindi', courseCode: 'HIN-013', gradeLevel: '1st Grade', subject: Subject.ForeignLanguage, description: 'Introduction to Hindi alphabet and basic vocabulary.' },
  { id: 'C014', courseName: 'Mathematics', courseCode: 'MATH-014', gradeLevel: '1st Grade', subject: Subject.Mathematics, description: 'Covers counting, addition, subtraction, and basic shapes.' },
  { id: 'C015', courseName: 'Science', courseCode: 'SCI-015', gradeLevel: '1st Grade', subject: Subject.Science, description: 'Exploration of the natural world, including plants, animals, and weather.' },
  { id: 'C016', courseName: 'Social Studies', courseCode: 'SS-016', gradeLevel: '1st Grade', subject: Subject.History, description: 'Introduces concepts of family, community, and holidays.' },
  { id: 'C017', courseName: 'Technology & Computer', courseCode: 'CS-017', gradeLevel: '1st Grade', subject: Subject.ComputerScience, description: 'Basic computer use and digital literacy skills.' },
  
  // Grade 2
  { id: 'C021', courseName: 'English', courseCode: 'ENG-021', gradeLevel: '2nd Grade', subject: Subject.English, description: 'Builds on reading fluency and comprehension skills.' },
  { id: 'C022', courseName: 'English Composition', courseCode: 'ENG-022', gradeLevel: '2nd Grade', subject: Subject.English, description: 'Develops paragraph writing and more complex sentence structures.' },
  { id: 'C023', courseName: 'Hindi', courseCode: 'HIN-023', gradeLevel: '2nd Grade', subject: Subject.ForeignLanguage, description: 'Continues with Hindi script, vocabulary, and simple conversation.' },
  { id: 'C024', courseName: 'Mathematics', courseCode: 'MATH-024', gradeLevel: '2nd Grade', subject: Subject.Mathematics, description: 'Introduction to multiplication, place value, and measurement.' },
  { id: 'C025', courseName: 'Science', courseCode: 'SCI-025', gradeLevel: '2nd Grade', subject: Subject.Science, description: 'Study of life cycles, matter, and the solar system.' },
  { id: 'C026', courseName: 'Social Studies', courseCode: 'SS-026', gradeLevel: '2nd Grade', subject: Subject.History, description: 'Learning about neighborhoods, maps, and historical figures.' },
  { id: 'C027', courseName: 'Technology & Computer', courseCode: 'CS-027', gradeLevel: '2nd Grade', subject: Subject.ComputerScience, description: 'Introduction to keyboarding and using educational software.' },

  // Grade 3
  { id: 'C031', courseName: 'English', courseCode: 'ENG-031', gradeLevel: '3rd Grade', subject: Subject.English, description: 'Develops reading comprehension, vocabulary, and grammar skills.' },
  { id: 'C032', courseName: 'English Composition', courseCode: 'ENG-032', gradeLevel: '3rd Grade', subject: Subject.English, description: 'Focuses on writing different types of paragraphs and short stories.' },
  { id: 'C033', courseName: 'Hindi', courseCode: 'HIN-033', gradeLevel: '3rd Grade', subject: Subject.ForeignLanguage, description: 'Enhances Hindi reading, writing, and conversational abilities.' },
  { id: 'C034', courseName: 'Mathematics', courseCode: 'MATH-034', gradeLevel: '3rd Grade', subject: Subject.Mathematics, description: 'Covers multiplication, division, fractions, and geometry.' },
  { id: 'C035', courseName: 'Science', courseCode: 'SCI-035', gradeLevel: '3rd Grade', subject: Subject.Science, description: 'Topics include ecosystems, energy, and simple machines.' },
  { id: 'C036', courseName: 'Social Studies', courseCode: 'SS-036', gradeLevel: '3rd Grade', subject: Subject.History, description: 'Study of communities, government, and local history.' },
  { id: 'C037', courseName: 'Technology & Computer', courseCode: 'CS-037', gradeLevel: '3rd Grade', subject: Subject.ComputerScience, description: 'Basic research skills and introduction to presentation software.' },

  // Grade 4
  { id: 'C041', courseName: 'English', courseCode: 'ENG-041', gradeLevel: '4th Grade', subject: Subject.English, description: 'Focus on analyzing texts, figurative language, and complex vocabulary.' },
  { id: 'C042', courseName: 'English Composition', courseCode: 'ENG-042', gradeLevel: '4th Grade', subject: Subject.English, description: 'Writing multi-paragraph essays and reports.' },
  { id: 'C043', courseName: 'Hindi', courseCode: 'HIN-043', gradeLevel: '4th Grade', subject: Subject.ForeignLanguage, description: 'Advanced grammar and composition in Hindi.' },
  { id: 'C044', courseName: 'Mathematics', courseCode: 'MATH-044', gradeLevel: '4th Grade', subject: Subject.Mathematics, description: 'Covers long division, decimals, and problem-solving strategies.' },
  { id: 'C045', courseName: 'Science', courseCode: 'SCI-045', gradeLevel: '4th Grade', subject: Subject.Science, description: 'Exploration of electricity, geology, and the human body.' },
  { id: 'C046', courseName: 'Social Studies', courseCode: 'SS-046', gradeLevel: '4th Grade', subject: Subject.History, description: 'Focus on state history and regional geography.' },
  { id: 'C047', courseName: 'Technology & Computer', courseCode: 'CS-047', gradeLevel: '4th Grade', subject: Subject.ComputerScience, description: 'Internet safety, digital citizenship, and coding basics.' },

  // Grade 5
  { id: 'C051', courseName: 'English', courseCode: 'ENG-051', gradeLevel: '5th Grade', subject: Subject.English, description: 'Advanced reading comprehension, literary analysis, and vocabulary.' },
  { id: 'C052', courseName: 'English Composition', courseCode: 'ENG-052', gradeLevel: '5th Grade', subject: Subject.English, description: 'Developing persuasive and expository writing skills.' },
  { id: 'C053', courseName: 'Hindi', courseCode: 'HIN-053', gradeLevel: '5th Grade', subject: Subject.ForeignLanguage, description: 'Study of Hindi literature and advanced conversation.' },
  { id: 'C054', courseName: 'Mathematics', courseCode: 'MATH-054', gradeLevel: '5th Grade', subject: Subject.Mathematics, description: 'Covers fractions, decimals, percentages, and pre-algebra concepts.' },
  { id: 'C055', courseName: 'Science', courseCode: 'SCI-055', gradeLevel: '5th Grade', subject: Subject.Science, description: 'Introduction to chemistry, physics concepts, and ecosystems.' },
  { id: 'C056', courseName: 'Social Studies', courseCode: 'SS-056', gradeLevel: '5th Grade', subject: Subject.History, description: 'Study of American history and government.' },
  { id: 'C057', courseName: 'Technology & Computer', courseCode: 'CS-057', gradeLevel: '5th Grade', subject: Subject.ComputerScience, description: 'Introduction to spreadsheets, databases, and multimedia projects.' },
  
  // Grade 6
  { id: 'C061', courseName: 'English', courseCode: 'ENG-061', gradeLevel: '6th Grade', subject: Subject.English, description: 'Analysis of literature, including novels, poetry, and drama.' },
  { id: 'C062', courseName: 'English Composition', courseCode: 'ENG-062', gradeLevel: '6th Grade', subject: Subject.English, description: 'Focus on research papers and argumentative essays.' },
  { id: 'C063', courseName: 'Hindi', courseCode: 'HIN-063', gradeLevel: '6th Grade', subject: Subject.ForeignLanguage, description: 'Advanced Hindi for fluent communication and literary analysis.' },
  { id: 'C064', courseName: 'Mathematics', courseCode: 'MATH-064', gradeLevel: '6th Grade', subject: Subject.Mathematics, description: 'Ratios, proportions, and an introduction to algebraic expressions.' },
  { id: 'C065', courseName: 'Science', courseCode: 'SCI-065', gradeLevel: '6th Grade', subject: Subject.Science, description: 'Earth science, including geology, meteorology, and astronomy.' },
  { id: 'C066', courseName: 'Social Studies', courseCode: 'SS-066', gradeLevel: '6th Grade', subject: Subject.History, description: 'Study of ancient world history and civilizations.' },
  { id: 'C067', courseName: 'Technology & Computer', courseCode: 'CS-067', gradeLevel: '6th Grade', subject: Subject.ComputerScience, description: 'Intermediate coding, web design, and digital media production.' },
  
  // Grade 7
  { id: 'C071', courseName: 'English', courseCode: 'ENG-071', gradeLevel: '7th Grade', subject: Subject.English, description: 'Critical reading and analysis of diverse literary genres.' },
  { id: 'C072', courseName: 'English Composition', courseCode: 'ENG-072', gradeLevel: '7th Grade', subject: Subject.English, description: 'Advanced essay structures and research techniques.' },
  { id: 'C073', courseName: 'Hindi', courseCode: 'HIN-073', gradeLevel: '7th Grade', subject: Subject.ForeignLanguage, description: 'Focus on fluency and cultural aspects of the Hindi language.' },
  { id: 'C074', courseName: 'Mathematics', courseCode: 'MATH-074', gradeLevel: '7th Grade', subject: Subject.Mathematics, description: 'Pre-Algebra concepts including integers, expressions, and inequalities.' },
  { id: 'C075', courseName: 'Science', courseCode: 'SCI-075', gradeLevel: '7th Grade', subject: Subject.Science, description: 'Life science, including cell biology, genetics, and human anatomy.' },
  { id: 'C076', courseName: 'Social Studies', courseCode: 'SS-076', gradeLevel: '7th Grade', subject: Subject.History, description: 'Medieval world history and the rise of empires.' },
  { id: 'C077', courseName: 'Technology & Computer', courseCode: 'CS-077', gradeLevel: '7th Grade', subject: Subject.ComputerScience, description: 'Introduction to programming languages like Python or JavaScript.' },
  
  // Grade 8
  { id: 'C081', courseName: 'English', courseCode: 'ENG-081', gradeLevel: '8th Grade', subject: Subject.English, description: 'In-depth literary analysis and preparation for high school English.' },
  { id: 'C082', courseName: 'English Composition', courseCode: 'ENG-082', gradeLevel: '8th Grade', subject: Subject.English, description: 'Refining research and citation skills for academic writing.' },
  { id: 'C083', courseName: 'Hindi', courseCode: 'HIN-083', gradeLevel: '8th Grade', subject: Subject.ForeignLanguage, description: 'Advanced conversational Hindi and study of modern literature.' },
  { id: 'C084', courseName: 'Mathematics', courseCode: 'MATH-084', gradeLevel: '8th Grade', subject: Subject.Mathematics, description: 'Algebra I foundations, including linear functions and systems of equations.' },
  { id: 'C085', courseName: 'Science', courseCode: 'SCI-085', gradeLevel: '8th Grade', subject: Subject.Science, description: 'Physical science, including chemistry, physics, and earth science.' },
  { id: 'C086', courseName: 'Social Studies', courseCode: 'SS-086', gradeLevel: '8th Grade', subject: Subject.History, description: 'U.S. history from colonization through the Civil War.' },
  { id: 'C087', courseName: 'Technology & Computer', courseCode: 'CS-087', gradeLevel: '8th Grade', subject: Subject.ComputerScience, description: 'Project-based programming and an introduction to data science.' },
  
  // Grade 9
  { id: 'C091', courseName: 'English I', courseCode: 'ENG-091', gradeLevel: '9th Grade', subject: Subject.English, description: 'Foundational high school course in literature and composition.' },
  { id: 'C092', courseName: 'English Composition', courseCode: 'ENG-092', gradeLevel: '9th Grade', subject: Subject.English, description: 'Focuses on formal essay writing and literary analysis.' },
  { id: 'C093', courseName: 'Hindi I', courseCode: 'HIN-093', gradeLevel: '9th Grade', subject: Subject.ForeignLanguage, description: 'Beginning high school Hindi, focusing on grammar and conversation.' },
  { id: 'C094', courseName: 'Algebra I', courseCode: 'MATH-094', gradeLevel: '9th Grade', subject: Subject.Mathematics, description: 'Covers linear equations, inequalities, functions, and polynomials.' },
  { id: 'C095', courseName: 'Biology', courseCode: 'SCI-095', gradeLevel: '9th Grade', subject: Subject.Science, description: 'A comprehensive study of living organisms and their processes.' },
  { id: 'C096', courseName: 'World Geography', courseCode: 'SS-096', gradeLevel: '9th Grade', subject: Subject.History, description: 'Examines the physical and human geography of the world.' },
  { id: 'C097', courseName: 'Introduction to Computer Science', courseCode: 'CS-097', gradeLevel: '9th Grade', subject: Subject.ComputerScience, description: 'An introduction to programming principles and computational thinking.' },
  
  // Grade 10
  { id: 'C101', courseName: 'English II', courseCode: 'ENG-101', gradeLevel: '10th Grade', subject: Subject.English, description: 'A survey of world literature and advanced composition.' },
  { id: 'C102', courseName: 'English Composition', courseCode: 'ENG-102', gradeLevel: '10th Grade', subject: Subject.English, description: 'Focuses on research methods and writing analytical papers.' },
  { id: 'C103', courseName: 'Hindi II', courseCode: 'HIN-103', gradeLevel: '10th Grade', subject: Subject.ForeignLanguage, description: 'Intermediate study of Hindi language and literature.' },
  { id: 'C104', courseName: 'Geometry', courseCode: 'MATH-104', gradeLevel: '10th Grade', subject: Subject.Mathematics, description: 'Study of points, lines, angles, and shapes in two and three dimensions.' },
  { id: 'C105', courseName: 'Chemistry', courseCode: 'SCI-105', gradeLevel: '10th Grade', subject: Subject.Science, description: 'Introduction to atomic structure, chemical bonding, and reactions.' },
  { id: 'C106', courseName: 'World History', courseCode: 'SS-106', gradeLevel: '10th Grade', subject: Subject.History, description: 'A survey of major global events from the Renaissance to the modern era.' },
  { id: 'C107', courseName: 'AP Computer Science Principles', courseCode: 'CS-107', gradeLevel: '10th Grade', subject: Subject.ComputerScience, description: 'Introduces students to the foundational concepts of computer science.' },
];

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
    const [courses, setCourses] = useState<Course[]>(initialCourses);
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

    const allSubjects: Subject[] = [...new Set(courses.map(c => c.subject))];

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