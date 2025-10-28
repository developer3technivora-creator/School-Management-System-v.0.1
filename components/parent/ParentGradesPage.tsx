import React, { useState, useMemo } from 'react';
import { ArrowUturnLeftIcon, ChartBarIcon, TrophyIcon } from '../Icons';
import type { CourseGrade, ChildProfile } from '../../types';

// Mock Data
const mockChildren: ChildProfile[] = [
    { id: 'child1', guardianId: 'user1', fullName: 'Alice Johnson', gender: 'Female', age: 15, grade: '10th Grade', hobbies: 'Reading, Painting', documents: [] },
    { id: 'child2', guardianId: 'user1', fullName: 'Alex Johnson', gender: 'Male', age: 13, grade: '8th Grade', hobbies: 'Soccer, Video Games', documents: [] },
];

const mockAcademicData: { [childId: string]: CourseGrade[] } = {
    'child1': [
        { id: 'g1', courseName: 'Algebra II', semester: 'Fall 2024', grade: 'A', score: 94 },
        { id: 'g2', courseName: 'English Literature', semester: 'Fall 2024', grade: 'B', score: 85 },
        { id: 'g3', courseName: 'World History', semester: 'Fall 2024', grade: 'A', score: 98 },
        { id: 'g4', courseName: 'Physics', semester: 'Spring 2024', grade: 'B', score: 89 },
    ],
    'child2': [
        { id: 'g5', courseName: 'Pre-Algebra', semester: 'Fall 2024', grade: 'B', score: 88 },
        { id: 'g6', courseName: 'Life Science', semester: 'Fall 2024', grade: 'A', score: 92 },
    ],
};

const gradeToPoints: Record<CourseGrade['grade'], number> = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
const gradeToColor: Record<CourseGrade['grade'], string> = {
    'A': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'B': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'C': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'D': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    'F': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export const ParentGradesPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [selectedChildId, setSelectedChildId] = useState<string>(mockChildren[0].id);
    const selectedChildGrades = mockAcademicData[selectedChildId] || [];

    const gpa = useMemo(() => {
        if (selectedChildGrades.length === 0) return 'N/A';
        const totalPoints = selectedChildGrades.reduce((acc, curr) => acc + gradeToPoints[curr.grade], 0);
        return (totalPoints / selectedChildGrades.length).toFixed(2);
    }, [selectedChildGrades]);
    
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <ChartBarIcon className="w-10 h-10 text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Grades & Reports
                            </h1>
                            <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">
                                Access your children's academic performance and report cards.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onBackToDashboard}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                        <ArrowUturnLeftIcon className="h-5 w-5" />
                        <span>Dashboard</span>
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl dark:border dark:border-slate-700 p-6">
                    <div className="mb-6">
                        <label htmlFor="child-selector" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Viewing grades for:</label>
                        <select
                            id="child-selector"
                            value={selectedChildId}
                            onChange={(e) => setSelectedChildId(e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-1/3 p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        >
                            {mockChildren.map(child => (
                                <option key={child.id} value={child.id}>{child.fullName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-500 rounded-lg">
                            <TrophyIcon className="w-8 h-8"/>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-500 dark:text-slate-400">Overall GPA</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{gpa}</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Course Grades</h3>
                    <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Course Name</th>
                                    <th scope="col" className="px-6 py-3">Semester</th>
                                    <th scope="col" className="px-6 py-3 text-center">Score</th>
                                    <th scope="col" className="px-6 py-3 text-center">Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedChildGrades.length > 0 ? selectedChildGrades.map((g) => (
                                    <tr key={g.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{g.courseName}</td>
                                        <td className="px-6 py-4">{g.semester}</td>
                                        <td className="px-6 py-4 text-center">{g.score}%</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 text-sm font-bold rounded-full ${gradeToColor[g.grade]}`}>
                                                {g.grade}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-slate-500 dark:text-slate-400">No grades have been recorded yet for this child.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
