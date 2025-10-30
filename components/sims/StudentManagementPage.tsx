import React, { useState, useMemo } from 'react';
import type { Student } from '../../types';
import { AddEditStudentModal } from './AddEditStudentModal';
import { StudentTable } from './StudentTable';
import { AcademicRecordsModal } from './AcademicRecordsModal';
import { HealthRecordsModal } from './HealthRecordsModal';
import { StudentDetailPage } from './StudentDetailPage';
import { ArrowUturnLeftIcon, PlusIcon, UsersIcon } from '../Icons';
import { mockStudents } from '../../data/mockData';

export const StudentManagementPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [students, setStudents] = useState<Student[]>(mockStudents);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    
    // Filters State
    const [searchTerm, setSearchTerm] = useState('');
    const [gradeFilter, setGradeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    
    const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

    const [isAcademicsModalOpen, setIsAcademicsModalOpen] = useState(false);
    const [selectedStudentForAcademics, setSelectedStudentForAcademics] = useState<Student | null>(null);

    const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
    const [selectedStudentForHealth, setSelectedStudentForHealth] = useState<Student | null>(null);

    const openAddModal = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const openEditModal = (student: Student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleDeleteStudent = (studentId: string) => {
        if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            setStudents(prev => prev.filter(s => s.id !== studentId));
        }
    };

    const handleViewAcademics = (student: Student) => {
        setSelectedStudentForAcademics(student);
        setIsAcademicsModalOpen(true);
    };

    const handleViewHealth = (student: Student) => {
        setSelectedStudentForHealth(student);
        setIsHealthModalOpen(true);
    };

    const handleViewDetails = (student: Student) => {
        setViewingStudent(student);
    };

    const handleSaveStudent = (student: Student) => {
        if (editingStudent) {
            // Update existing student
            setStudents(prev => prev.map(s => s.id === student.id ? student : s));
        } else {
            // Add new student
            setStudents(prev => [...prev, { ...student, id: Date.now().toString() }]); // Use a better ID in a real app
        }
        setIsModalOpen(false);
    };
    
    const gradeLevels = useMemo(() => {
        const grades = new Set(students.map(s => s.academic_info.grade));
        return Array.from(grades).sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0));
    }, [students]);
    const enrollmentStatuses: Student['academic_info']['enrollment_status'][] = ['Enrolled', 'Withdrawn', 'Graduated', 'Pending'];


    const filteredStudents = useMemo(() => {
        return students
            .filter(student => {
                if (gradeFilter !== 'All' && student.academic_info.grade !== gradeFilter) {
                    return false;
                }
                if (statusFilter !== 'All' && student.academic_info.enrollment_status !== statusFilter) {
                    return false;
                }
                const lowercasedFilter = searchTerm.toLowerCase();
                if (!lowercasedFilter) return true;
                return (
                    student.personal_info.full_name.toLowerCase().includes(lowercasedFilter) ||
                    student.student_id.toLowerCase().includes(lowercasedFilter)
                );
            });
    }, [students, searchTerm, gradeFilter, statusFilter]);

    if (viewingStudent) {
        return <StudentDetailPage student={viewingStudent} onBack={() => setViewingStudent(null)} />;
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <UsersIcon className="w-10 h-10 text-blue-500" />
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Student Management
                                </h1>
                                <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">
                                    Manage all student records and information.
                                </p>
                            </div>
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
                     <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search by name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 bg-slate-100/50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg block p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                            />
                            <select
                                value={gradeFilter}
                                onChange={(e) => setGradeFilter(e.target.value)}
                                className="w-full sm:w-auto bg-slate-100/50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg block p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                            >
                                <option value="All">All Grades</option>
                                {gradeLevels.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full sm:w-auto bg-slate-100/50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg block p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                            >
                                <option value="All">All Statuses</option>
                                {enrollmentStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="flex items-center justify-center gap-2 w-full md:w-auto px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Add New Student</span>
                        </button>
                    </div>
                    <StudentTable 
                        students={filteredStudents} 
                        onEdit={openEditModal}
                        onDelete={handleDeleteStudent}
                        onViewAcademics={handleViewAcademics}
                        onViewHealth={handleViewHealth}
                        onViewDetails={handleViewDetails}
                    />
                </div>
            </div>

            {isModalOpen && (
                <AddEditStudentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveStudent}
                    student={editingStudent}
                    students={students}
                />
            )}

            {isAcademicsModalOpen && selectedStudentForAcademics && (
                <AcademicRecordsModal
                    isOpen={isAcademicsModalOpen}
                    onClose={() => setIsAcademicsModalOpen(false)}
                    student={selectedStudentForAcademics}
                />
            )}

             {isHealthModalOpen && selectedStudentForHealth && (
                <HealthRecordsModal
                    isOpen={isHealthModalOpen}
                    onClose={() => setIsHealthModalOpen(false)}
                    student={selectedStudentForHealth}
                />
            )}
        </div>
    );
};