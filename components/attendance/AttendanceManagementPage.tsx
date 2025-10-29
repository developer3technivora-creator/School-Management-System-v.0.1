import React, { useState, useMemo } from 'react';
import type { Student, AttendanceRecord } from '../../types';
import { AttendanceTable } from './AttendanceTable';
import { MarkAttendanceModal } from './MarkAttendanceModal';
import { ArrowUturnLeftIcon, DocumentCheckIcon, PlusIcon } from '../Icons';

// Mock Data
const mockStudents: Student[] = [
    { 
        id: '1', 
        student_id: 'S-2024001',
        personal_info: { full_name: 'Alice Johnson', date_of_birth: '2008-05-12', gender: 'Female', address: '123 Oak Ave, Springfield' },
        academic_info: { grade: '10th Grade', enrollment_status: 'Enrolled' },
        contact_info: { 
            parent_guardian: { name: 'John Johnson', phone: '555-1234', email: 'j.johnson@email.com' },
            emergency_contact: { name: 'Jane Johnson', phone: '555-5678' }
        }
    },
    { 
        id: '2', 
        student_id: 'S-2024002',
        personal_info: { full_name: 'Bob Williams', date_of_birth: '2009-02-20', gender: 'Male', address: '456 Maple St, Springfield' },
        academic_info: { grade: '9th Grade', enrollment_status: 'Enrolled' },
        contact_info: { 
            parent_guardian: { name: 'Sarah Williams', phone: '555-2345', email: 's.williams@email.com' },
            emergency_contact: { name: 'Tom Williams', phone: '555-6789' }
        }
    },
    { 
        id: '3', 
        student_id: 'S-2024003',
        personal_info: { full_name: 'Charlie Brown', date_of_birth: '2007-11-30', gender: 'Male', address: '789 Pine Ln, Springfield' },
        academic_info: { grade: '11th Grade', enrollment_status: 'Enrolled' },
        contact_info: { 
            parent_guardian: { name: 'David Brown', phone: '555-3456', email: 'd.brown@email.com' },
            emergency_contact: { name: 'Susan Brown', phone: '555-7890' }
        }
    },
];

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const initialAttendance: AttendanceRecord[] = [
    { id: 'att1', studentId: '1', date: getTodayDateString(), status: 'Present' },
    { id: 'att2', studentId: '2', date: getTodayDateString(), status: 'Absent', notes: 'Feeling unwell' },
    { id: 'att3', studentId: '3', date: getTodayDateString(), status: 'Late', notes: 'Arrived at 9:15 AM' },
];


export const AttendanceManagementPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>(initialAttendance);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(getTodayDateString());

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