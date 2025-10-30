import React, { useState, useMemo } from 'react';
import { ArrowUturnLeftIcon, ChartBarIcon, TrophyIcon } from '../Icons';
import type { CourseGrade, ChildProfile } from '../../types';
import { mockChildren, mockAcademicData, mockStudents } from '../../data/mockData';

const gradeToPoints: Record<CourseGrade['grade'], number> = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
const gradeToColorStyles: Record<CourseGrade['grade'], { text: string; bg: string; border: string; }> = {
    'A': { text: 'text-green-600 dark:text-green-300', bg: 'bg-green-50 dark:bg-green-900/30', border: 'border-green-500' },
    'B': { text: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-500' },
    'C': { text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/30', border: 'border-yellow-500' },
    'D': { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30', border: 'border-orange-500' },
    'F': { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30', border: 'border-red-500' },
};

const GradeCard: React.FC<{ grade: CourseGrade }> = ({ grade }) => {
    const styles = gradeToColorStyles[grade.grade];
    return (
        <div className={`p-5 rounded-xl shadow-sm border ${styles.bg} border-l-4 ${styles.border}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{grade.courseName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{grade.semester}</p>
                </div>
                <div className="text-right">
                    <p className={`text-3xl font-bold ${styles.text}`}>{grade.grade}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{grade.score}%</p>
                </div>
            </div>
        </div>
    );
};

export const ParentGradesPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [selectedChildId, setSelectedChildId] = useState<string>(mockChildren[0].id);
    
    const childToStudentIdMap = useMemo(() => {
        const mapping = new Map<string, string>();
        mockChildren.forEach(child => {
            const student = mockStudents.find(s => s.personal_info.full_name === child.fullName);
            if (student) mapping.set(child.id, student.id);
        });
        return mapping;
    }, []);

    const selectedChildGrades = useMemo(() => {
        const studentId = childToStudentIdMap.get(selectedChildId);
        if (!studentId) return [];
        return mockAcademicData[studentId] || [];
    }, [selectedChildId, childToStudentIdMap]);

    const gpa = useMemo(() => {
        if (selectedChildGrades.length === 0) return 'N/A';
        const totalPoints = selectedChildGrades.reduce((acc, curr) => acc + gradeToPoints[curr.grade], 0);
        return (totalPoints / selectedChildGrades.length).toFixed(2);
    }, [selectedChildGrades]);
    
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-500 rounded-xl">
                        <ChartBarIcon className="w-8 h-8"/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Grades & Reports</h1>
                        <p className="text-slate-500 dark:text-slate-400">View academic performance for your children.</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-200 dark:bg-slate-800 rounded-xl">
                {mockChildren.map(child => (
                    <button
                        key={child.id}
                        onClick={() => setSelectedChildId(child.id)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2 ${selectedChildId === child.id ? 'bg-white dark:bg-slate-700 shadow-md' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                         <img className="h-6 w-6 rounded-full" src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${child.fullName.split(' ')[0]}`} alt={child.fullName} />
                        {child.fullName}
                    </button>
                ))}
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-500 rounded-full">
                    <TrophyIcon className="w-10 h-10"/>
                </div>
                <div>
                    <p className="font-semibold text-slate-500 dark:text-slate-400">Overall GPA</p>
                    <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{gpa}</p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Course Grades</h3>
                {selectedChildGrades.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedChildGrades.map((g) => <GradeCard key={g.id} grade={g} />)}
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/60 rounded-xl border border-dashed">
                        <p className="font-semibold">No Grades Recorded</p>
                        <p>Grades for this child have not been posted yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
