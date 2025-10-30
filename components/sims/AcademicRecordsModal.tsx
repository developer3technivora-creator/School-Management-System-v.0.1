import React, { useState, useMemo, useEffect } from 'react';
import type { Student, CourseGrade } from '../../types';
import { AcademicCapIcon, PlusIcon, TrashIcon, TrophyIcon } from '../Icons';
import { mockAcademicData } from '../../data/mockData';

const gradeToPoints: Record<CourseGrade['grade'], number> = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 };

const AddGradeForm: React.FC<{ onSave: (newGrade: Omit<CourseGrade, 'id'>) => void; onCancel: () => void; }> = ({ onSave, onCancel }) => {
    const [courseName, setCourseName] = useState('');
    const [semester, setSemester] = useState('Fall 2024');
    const [grade, setGrade] = useState<CourseGrade['grade']>('A');
    const [score, setScore] = useState<number>(100);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseName.trim()) return; // Simple validation
        onSave({ courseName, semester, grade, score });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg my-4 border border-slate-200 dark:border-slate-700">
            <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200 mb-4">Add New Grade Record</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <input type="text" placeholder="Course Name" value={courseName} onChange={e => setCourseName(e.target.value)} className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-sm rounded-lg w-full p-2.5" required />
                <input type="text" placeholder="Semester" value={semester} onChange={e => setSemester(e.target.value)} className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-sm rounded-lg w-full p-2.5" required />
                <select value={grade} onChange={e => setGrade(e.target.value as CourseGrade['grade'])} className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-sm rounded-lg w-full p-2.5">
                    {Object.keys(gradeToPoints).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <input type="number" placeholder="Score (%)" value={score} onChange={e => setScore(Number(e.target.value))} min="0" max="100" className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-sm rounded-lg w-full p-2.5" required />
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save Grade</button>
            </div>
        </form>
    );
};


export const AcademicRecordsModal: React.FC<{ isOpen: boolean; onClose: () => void; student: Student; }> = ({ isOpen, onClose, student }) => {
    const [grades, setGrades] = useState<CourseGrade[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (student) {
            // In a real app, you'd fetch this data. For now, we use the mock.
            setGrades(mockAcademicData[student.id] || []);
        }
    }, [student]);

    const gpa = useMemo(() => {
        if (grades.length === 0) return 'N/A';
        const totalPoints = grades.reduce((acc, curr) => acc + gradeToPoints[curr.grade], 0);
        return (totalPoints / grades.length).toFixed(2);
    }, [grades]);

    const handleAddGrade = (newGradeData: Omit<CourseGrade, 'id'>) => {
        const newGrade: CourseGrade = { ...newGradeData, id: `g${Date.now()}` };
        const updatedGrades = [...grades, newGrade];
        setGrades(updatedGrades);
        // Persist change to our mock data store for the session
        mockAcademicData[student.id] = updatedGrades;
        setIsAdding(false);
    };

    const handleDeleteGrade = (gradeId: string) => {
        const updatedGrades = grades.filter(g => g.id !== gradeId);
        setGrades(updatedGrades);
        mockAcademicData[student.id] = updatedGrades;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" aria-modal="true" role="dialog">
            <div className="relative w-full max-w-4xl max-h-[90vh] p-4">
                <div className="relative bg-white rounded-2xl shadow dark:bg-slate-800 flex flex-col">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-slate-600">
                        <div className="flex items-center gap-3">
                            <AcademicCapIcon className="w-8 h-8 text-blue-500" />
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    Academic Records
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{student.personal_info.full_name}</p>
                            </div>
                        </div>
                        <button type="button" onClick={onClose} className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-slate-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="p-4 md:p-5 overflow-y-auto flex-grow">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 rounded-lg bg-slate-100 dark:bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <TrophyIcon className="w-8 h-8 text-yellow-500" />
                                <div>
                                    <h4 className="font-semibold text-slate-600 dark:text-slate-300">Overall GPA</h4>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{gpa}</p>
                                </div>
                            </div>
                            {!isAdding && (
                                <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                                    <PlusIcon className="h-5 w-5" />
                                    Add Grade
                                </button>
                            )}
                        </div>

                        {isAdding && <AddGradeForm onSave={handleAddGrade} onCancel={() => setIsAdding(false)} />}
                        
                        <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Course Name</th>
                                        <th scope="col" className="px-6 py-3">Semester</th>
                                        <th scope="col" className="px-6 py-3">Grade</th>
                                        <th scope="col" className="px-6 py-3">Score (%)</th>
                                        <th scope="col" className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grades.length > 0 ? grades.map((g) => (
                                        <tr key={g.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{g.courseName}</td>
                                            <td className="px-6 py-4">{g.semester}</td>
                                            <td className="px-6 py-4 font-bold">{g.grade}</td>
                                            <td className="px-6 py-4">{g.score}</td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => handleDeleteGrade(g.id)} className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-slate-500 dark:text-slate-400">No academic records found for this student.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex items-center justify-end p-4 border-t border-slate-200 dark:border-slate-600">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none bg-white rounded-lg border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};