import React, { useMemo } from 'react';
import type { Student, CourseGrade } from '../../types';
import { ChartBarIcon, TrophyIcon } from '../Icons';

// Mock Data from AcademicRecordsModal
const mockAcademicData: { [studentId: string]: CourseGrade[] } = {
    '1': [
        { id: 'g1', courseName: 'Algebra II', semester: 'Fall 2024', grade: 'A', score: 94 },
        { id: 'g2', courseName: 'English Literature', semester: 'Fall 2024', grade: 'B', score: 85 },
        { id: 'g3', courseName: 'World History', semester: 'Fall 2024', grade: 'A', score: 98 },
        { id: 'g4', courseName: 'Physics', semester: 'Spring 2024', grade: 'B', score: 89 },
        { id: 'g5', courseName: 'Chemistry', semester: 'Spring 2024', grade: 'C', score: 78 },
        { id: 'g6', courseName: 'Art', semester: 'Spring 2024', grade: 'A', score: 95 },
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


export const StudentGradesPage: React.FC<{ student: Student }> = ({ student }) => {
    const grades = mockAcademicData[student.id] || [];
    
    const gpa = useMemo(() => {
        if (grades.length === 0) return 'N/A';
        const totalPoints = grades.reduce((acc, curr) => acc + gradeToPoints[curr.grade], 0);
        return (totalPoints / grades.length).toFixed(2);
    }, [grades]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <ChartBarIcon className="w-8 h-8 text-blue-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">My Grades & Performance</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">A summary of your academic achievements.</p>
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-500 rounded-lg">
                    <TrophyIcon className="w-8 h-8"/>
                </div>
                <div>
                    <p className="font-semibold text-slate-500 dark:text-slate-400">Overall GPA</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{gpa}</p>
                </div>
            </div>

            <div>
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
                            {grades.length > 0 ? grades.map((g) => (
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
                                    <td colSpan={4} className="text-center py-8 text-slate-500 dark:text-slate-400">No grades have been recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};