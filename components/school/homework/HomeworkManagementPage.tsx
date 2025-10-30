import React, { useState } from 'react';
import type { Homework } from '../../../types';
import { Subject } from '../../../types';
import { ArrowUturnLeftIcon, PencilSquareIcon, PlusIcon } from '../../Icons';
import { AddEditHomeworkModal } from './AddEditHomeworkModal';
import { HomeworkTable } from './HomeworkTable';
import { mockHomeworks } from '../../../data/mockData';

export const HomeworkManagementPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [homeworks, setHomeworks] = useState<Homework[]>(mockHomeworks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHomework, setEditingHomework] = useState<Homework | null>(null);

    const openAddModal = () => {
        setEditingHomework(null);
        setIsModalOpen(true);
    };

    const openEditModal = (homework: Homework) => {
        setEditingHomework(homework);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this homework assignment?')) {
            setHomeworks(prev => prev.filter(hw => hw.id !== id));
        }
    };

    const handleSave = (homework: Homework) => {
        if (editingHomework) {
            setHomeworks(prev => prev.map(hw => hw.id === homework.id ? homework : hw));
        } else {
            setHomeworks(prev => [{ ...homework, id: `HW${Date.now()}` }, ...prev]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <PencilSquareIcon className="w-10 h-10 text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Homework Management
                            </h1>
                            <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">
                                Create, assign, and track homework.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onBackToDashboard}
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <ArrowUturnLeftIcon className="h-5 w-5" />
                            <span>Dashboard</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl dark:border dark:border-slate-700 p-6">
                     <div className="flex justify-end items-center mb-6">
                        <button
                            onClick={openAddModal}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Create Homework</span>
                        </button>
                    </div>
                    <HomeworkTable 
                        homeworks={homeworks} 
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            {isModalOpen && (
                <AddEditHomeworkModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    homework={editingHomework}
                />
            )}
        </div>
    );
};