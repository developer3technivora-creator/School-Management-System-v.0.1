import React, { useMemo, useState } from 'react';
import type { Student, AttendanceRecord, AttendanceStatus } from '../../types';
import { UserCircleIcon, CheckCircleIcon, XCircleIcon, ClockIcon, InformationCircleIcon, ChevronUpIcon, ChevronDownIcon } from '../Icons';

type SortableKey = 'fullName' | 'studentId' | 'grade' | 'status';
type SortDirection = 'asc' | 'desc';

interface CombinedRecord {
    student: Student;
    record?: AttendanceRecord;
}

const getStatusInfo = (status: AttendanceStatus | undefined) => {
    switch (status) {
        case 'Present':
            return { icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />, textClass: 'text-green-600 dark:text-green-400' };
        case 'Absent':
            return { icon: <XCircleIcon className="w-5 h-5 text-red-500" />, textClass: 'text-red-600 dark:text-red-400' };
        case 'Late':
            return { icon: <ClockIcon className="w-5 h-5 text-yellow-500" />, textClass: 'text-yellow-600 dark:text-yellow-400' };
        case 'Excused':
            return { icon: <InformationCircleIcon className="w-5 h-5 text-blue-500" />, textClass: 'text-blue-600 dark:text-blue-400' };
        default:
            return { icon: <span className="w-5 h-5 text-slate-400">-</span>, textClass: 'text-slate-500 dark:text-slate-400' };
    }
};

export const AttendanceTable: React.FC<{ students: Student[], records: AttendanceRecord[] }> = ({ students, records }) => {
    
    const combinedData = useMemo<CombinedRecord[]>(() => {
        return students.map(student => ({
            student,
            record: records.find(r => r.studentId === student.id),
        }));
    }, [students, records]);

    if (combinedData.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 py-8">No student data available.</p>;
    }
    
    if (records.length === 0) {
         return <p className="text-center text-slate-500 dark:text-slate-400 py-8">Attendance has not been marked for this date.</p>;
    }

    return (
        <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Student Name</th>
                        <th scope="col" className="px-6 py-3">Student ID</th>
                        <th scope="col" className="px-6 py-3">Grade</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {combinedData.map(({ student, record }) => {
                        const { icon, textClass } = getStatusInfo(record?.status);
                        return (
                             <tr key={student.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                <th scope="row" className="flex items-center px-6 py-4 text-slate-900 whitespace-nowrap dark:text-white">
                                    <UserCircleIcon className="w-10 h-10 text-slate-400" />
                                    <div className="pl-3">
                                        {/* FIX: Changed property access from 'fullName' to 'full_name'. */}
                                        <div className="text-base font-semibold">{student.full_name}</div>
                                        {/* FIX: Changed property access from 'parentGuardianEmail' to 'parent_guardian_email'. */}
                                        <div className="font-normal text-slate-500">{student.parent_guardian_email}</div>
                                    </div>
                                </th>
                                {/* FIX: Changed property access from 'studentId' to 'student_id'. */}
                                <td className="px-6 py-4">{student.student_id}</td>
                                <td className="px-6 py-4">{student.grade}</td>
                                <td className="px-6 py-4">
                                    <div className={`flex items-center gap-2 font-semibold ${textClass}`}>
                                        {icon}
                                        <span>{record?.status || 'Not Marked'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{record?.notes || '-'}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};
