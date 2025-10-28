import React from 'react';
import type { Homework } from '../../../types';
import { PencilIcon, TrashIcon } from '../../Icons';

interface HomeworkTableProps {
    homeworks: Homework[];
    onEdit: (homework: Homework) => void;
    onDelete: (id: string) => void;
}

const getStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate + 'T23:59:59'); // Consider due at end of day
    today.setHours(0, 0, 0, 0); // Normalize today to start of day
    
    if (due < today) {
        return { text: 'Past Due', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' };
    }
    return { text: 'Assigned', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' };
};

export const HomeworkTable: React.FC<HomeworkTableProps> = ({ homeworks, onEdit, onDelete }) => {
    if (homeworks.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 py-8">No homework assignments found.</p>;
    }

    return (
        <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Title</th>
                        <th scope="col" className="px-6 py-3">Subject</th>
                        <th scope="col" className="px-6 py-3">Grade Level</th>
                        <th scope="col" className="px-6 py-3">Due Date</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {homeworks.map((hw) => {
                        const status = getStatus(hw.dueDate);
                        return (
                            <tr key={hw.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{hw.title}</td>
                                <td className="px-6 py-4">{hw.subject}</td>
                                <td className="px-6 py-4">{hw.gradeLevel}</td>
                                <td className="px-6 py-4">{hw.dueDate}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                                        {status.text}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-1">
                                        <button onClick={() => onEdit(hw)} className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700" title="Edit Homework">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => onDelete(hw.id)} className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700" title="Delete Homework">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};