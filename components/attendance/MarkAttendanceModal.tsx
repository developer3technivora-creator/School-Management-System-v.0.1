import React, { useState, useEffect } from 'react';
import type { Student, AttendanceStatus, AttendanceRecord } from '../../types';
import { UserCircleIcon } from '../Icons';

interface MarkAttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (records: Omit<AttendanceRecord, 'id'>[]) => void;
    students: Student[];
    date: string;
    existingRecords: AttendanceRecord[];
}

type StatusMap = {
    [studentId: string]: { status: AttendanceStatus; notes: string };
};

const statusOptions: AttendanceStatus[] = ['Present', 'Absent', 'Late', 'Excused'];
const statusStyles: Record<AttendanceStatus, string> = {
    'Present': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Absent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'Late': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Excused': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
}
const activeStatusStyles: Record<AttendanceStatus, string> = {
    'Present': 'bg-green-600 text-white',
    'Absent': 'bg-red-600 text-white',
    'Late': 'bg-yellow-500 text-white',
    'Excused': 'bg-blue-600 text-white',
}

export const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({ isOpen, onClose, onSave, students, date, existingRecords }) => {
    const [statuses, setStatuses] = useState<StatusMap>({});

    useEffect(() => {
        const initialStatuses: StatusMap = {};
        students.forEach(student => {
            const existing = existingRecords.find(r => r.studentId === student.id);
            initialStatuses[student.id] = {
                status: existing?.status || 'Present',
                notes: existing?.notes || '',
            };
        });
        setStatuses(initialStatuses);
    }, [isOpen, students, existingRecords]);

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setStatuses(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status },
        }));
    };

    const handleNotesChange = (studentId: string, notes: string) => {
        setStatuses(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], notes },
        }));
    };
    
    const handleMarkAllPresent = () => {
        const newStatuses: StatusMap = {};
        students.forEach(student => {
             newStatuses[student.id] = { status: 'Present', notes: '' };
        });
        setStatuses(newStatuses);
    };

    const handleSubmit = () => {
        const recordsToSave: Omit<AttendanceRecord, 'id'>[] = Object.entries(statuses).map(([studentId, data]) => ({
            studentId,
            date,
            status: data.status,
            notes: data.notes,
        }));
        onSave(recordsToSave);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" aria-modal="true" role="dialog">
            <div className="relative w-full max-w-4xl max-h-[90vh] p-4">
                <div className="relative bg-white rounded-2xl shadow dark:bg-slate-800 flex flex-col">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-slate-600">
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Mark Attendance
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">For date: {date}</p>
                        </div>
                        <button type="button" onClick={onClose} className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-slate-600 dark:hover:text-white">
                           <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="p-4 md:p-5 overflow-y-auto flex-grow space-y-4">
                        <div className="flex justify-end">
                            <button onClick={handleMarkAllPresent} className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg">Mark All Present</button>
                        </div>
                        {students.map(student => (
                            <div key={student.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-3 col-span-1">
                                    <UserCircleIcon className="w-10 h-10 text-slate-400" />
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{student.personal_info.full_name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{student.student_id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 col-span-2">
                                    <div className="flex-grow flex flex-wrap gap-2">
                                    {statusOptions.map(status => (
                                        <button 
                                            key={status}
                                            onClick={() => handleStatusChange(student.id, status)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${statuses[student.id]?.status === status ? activeStatusStyles[status] : statusStyles[status]}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                    </div>
                                    <input 
                                        type="text"
                                        placeholder="Optional notes..."
                                        value={statuses[student.id]?.notes || ''}
                                        onChange={(e) => handleNotesChange(student.id, e.target.value)}
                                        className="w-full md:w-40 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-sm rounded-lg p-2"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end p-4 border-t border-slate-200 dark:border-slate-600">
                        <button onClick={onClose} type="button" className="px-5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none bg-white rounded-lg border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} type="button" className="ml-3 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                            Save Attendance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};