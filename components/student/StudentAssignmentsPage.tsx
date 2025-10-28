import React from 'react';
import type { Student, Homework } from '../../types';
import { Subject } from '../../types';
import { PencilSquareIcon } from '../Icons';

// Mock Data from HomeworkManagementPage
const initialHomeworks: Homework[] = [
    { id: 'HW1', title: 'Algebra Worksheet Chapter 3', instructions: 'Complete all odd-numbered problems from the worksheet attached.', subject: Subject.Mathematics, gradeLevel: '9th Grade', assignedDate: '2024-10-20', dueDate: '2024-10-27', attachmentLink: 'https://example.com/worksheet.pdf' },
    { id: 'HW2', title: 'Essay: The Great Gatsby', instructions: 'Write a 500-word essay on the symbolism of the green light in The Great Gatsby.', subject: Subject.English, gradeLevel: '10th Grade', assignedDate: '2024-10-18', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 'HW3', title: 'Lab Report: Photosynthesis', instructions: 'Submit your lab report based on last week\'s experiment.', subject: Subject.Science, gradeLevel: '9th Grade', assignedDate: '2024-10-22', dueDate: '2024-10-29' },
    { id: 'HW4', title: 'World History Reading', instructions: 'Read Chapter 5 and answer the questions at the end.', subject: Subject.History, gradeLevel: '10th Grade', assignedDate: '2024-10-25', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 'HW5', title: 'Past Due: Physics Problems', instructions: 'Complete problems 1-10 on page 50.', subject: Subject.Science, gradeLevel: '10th Grade', assignedDate: '2024-10-15', dueDate: '2024-10-22' },
];

const getStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate + 'T23:59:59');
    today.setHours(0, 0, 0, 0);
    
    if (due < today) {
        return { text: 'Past Due', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' };
    }
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) {
        return { text: `Due in ${diffDays} day(s)`, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' };
    }
    return { text: 'Assigned', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' };
};

export const StudentAssignmentsPage: React.FC<{ student: Student }> = ({ student }) => {
    const studentAssignments = initialHomeworks
        .filter(hw => hw.gradeLevel === student.grade)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <PencilSquareIcon className="w-8 h-8 text-blue-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">My Assignments</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">All homework and assignments for your classes.</p>
                </div>
            </div>
            
            {studentAssignments.length > 0 ? (
                <div className="space-y-4">
                    {studentAssignments.map(hw => {
                        const status = getStatus(hw.dueDate);
                        return (
                            <div key={hw.id} className="p-5 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{hw.title}</h3>
                                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{hw.subject}</p>
                                    </div>
                                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${status.className}`}>
                                        {status.text}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{hw.instructions}</p>
                                {hw.attachmentLink && (
                                    <a href={hw.attachmentLink} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm text-blue-600 hover:underline">View Attachment</a>
                                )}
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
                                    <span>Assigned: {hw.assignedDate}</span>
                                    <span className="font-semibold">Due: {hw.dueDate}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">No assignments found for your grade level.</p>
                </div>
            )}
        </div>
    );
};