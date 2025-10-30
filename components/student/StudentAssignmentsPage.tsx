import React from 'react';
import type { Student, Homework } from '../../types';
import { Subject } from '../../types';
import { PencilSquareIcon } from '../Icons';
import { mockHomeworks } from '../../data/mockData';

const getStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate + 'T23:59:59'); // Consider due at end of day
    today.setHours(0, 0, 0, 0); // Normalize today to start of day
    
    if (due < today) {
        return { text: 'Past Due', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' };
    }
    return { text: 'Assigned', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' };
};

export const StudentAssignmentsPage: React.FC<{ student: Student }> = ({ student }) => {
    const studentAssignments = mockHomeworks.filter(hw => hw.gradeLevel === student.academic_info.grade);
    
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <PencilSquareIcon className="w-8 h-8 text-blue-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">My Assignments</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">View and submit your upcoming and past due homework.</p>
                </div>
            </div>
            
            <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Subject</th>
                            <th scope="col" className="px-6 py-3">Due Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentAssignments.length > 0 ? studentAssignments.map(hw => {
                            const status = getStatus(hw.dueDate);
                            return (
                                <tr key={hw.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{hw.title}</td>
                                    <td className="px-6 py-4">{hw.subject}</td>
                                    <td className="px-6 py-4">{hw.dueDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                                            {status.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Submit</button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-slate-500 dark:text-slate-400">No assignments found for your grade.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
