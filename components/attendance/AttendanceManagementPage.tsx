import React, { useState, useMemo } from 'react';
import type { Student, AttendanceRecord } from '../../types';
import { AttendanceTable } from './AttendanceTable';
import { MarkAttendanceModal } from './MarkAttendanceModal';
import { ArrowUturnLeftIcon, DocumentCheckIcon, PlusIcon } from '../Icons';
import { mockStudents, mockAttendanceRecords } from '../../data/mockData';

export const AttendanceManagementPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>(mockAttendanceRecords);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const recordsForSelectedDate = useMemo(() => {
        return allAttendance.filter(rec => rec.date === selectedDate);
    }, [allAttendance, selectedDate]);

    const handleSaveAttendance = (newRecords: Omit<AttendanceRecord, 'id'>[]) => {
        const updatedAttendance = [
            ...allAttendance.filter(rec => rec.date !== selectedDate),
            ...newRecords.map((rec, i) => ({ ...rec, id: `att-${Date.now()}-${i}` })),
        ];
        setAllAttendance(updatedAttendance);
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <DocumentCheckIcon className="w-10 h-10 text-blue-500" />
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Attendance Management
                                </h1>
                                <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">
                                    Track and manage daily student attendance.
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
                        <div className="relative">
                             <label htmlFor="attendance-date" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Select Date:</label>
                            <input
                                type="date"
                                id="attendance-date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full md:w-auto peer bg-slate-100/50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg block p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center gap-2 w-full md:w-auto px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Mark Attendance</span>
                        </button>
                    </div>
                    <AttendanceTable
                        students={mockStudents}
                        records={recordsForSelectedDate}
                    />
                </div>

            </div>
            {isModalOpen && (
                <MarkAttendanceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveAttendance}
                    students={mockStudents}
                    date={selectedDate}
                    existingRecords={recordsForSelectedDate}
                />
            )}
        </div>
    );
};