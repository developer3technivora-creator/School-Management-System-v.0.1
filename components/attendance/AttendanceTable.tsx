import React, { useMemo, useState } from 'react';
import type { Student, AttendanceRecord, AttendanceStatus } from '../../types';
import { UserCircleIcon, CheckCircleIcon, XCircleIcon, ClockIcon, InformationCircleIcon, ChevronUpIcon, ChevronDownIcon } from '../Icons';

interface CombinedRecord {
    student: Student;
    record: { status: AttendanceStatus | 'Not Marked'; notes?: string };
}

type SortKey = 'fullName' | 'studentId' | 'grade' | 'status';
type SortDirection = 'asc' | 'desc';

const useSortableData = (items: CombinedRecord[], initialSortKey: SortKey = 'fullName') => {
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: initialSortKey, direction: 'asc' });

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        sortableItems.sort((a, b) => {
            const getSortableValue = (item: CombinedRecord, key: SortKey): string => {
                switch(key) {
                    case 'fullName': return item.student.personal_info.full_name;
                    case 'studentId': return item.student.student_id;
                    case 'grade': return item.student.academic_info.grade;
                    case 'status': return item.record.status;
                    default: return '';
                }
            }

            const valA = getSortableValue(a, sortConfig.key);
            const valB = getSortableValue(b, sortConfig.key);
            
            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

const SortableHeader: React.FC<{ label: string; sortKey: SortKey; requestSort: (key: SortKey) => void; sortConfig: { key: SortKey; direction: SortDirection }; }> = ({ label, sortKey, requestSort, sortConfig }) => {
    const isActive = sortConfig.key === sortKey;
    const icon = sortConfig.direction === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />;
    return (
        <th scope="col" className="px-6 py-3">
            <button onClick={() => requestSort(sortKey)} className="group flex items-center gap-1.5">
                {label}
                <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>{icon}</span>
            </button>
        </th>
    );
};


const getStatusInfo = (status: AttendanceStatus | 'Not Marked' | undefined) => {
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
            return { icon: <span className="w-5 h-5 text-slate-400 font-bold">-</span>, textClass: 'text-slate-500 dark:text-slate-400' };
    }
};

export const AttendanceTable: React.FC<{ data: CombinedRecord[] }> = ({ data }) => {
    
    const { items: sortedData, requestSort, sortConfig } = useSortableData(data);

    if (data.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 py-8">No students match the current filters.</p>;
    }

    return (
        <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                    <tr>
                        <SortableHeader label="Student Name" sortKey="fullName" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader label="Student ID" sortKey="studentId" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader label="Grade" sortKey="grade" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader label="Status" sortKey="status" requestSort={requestSort} sortConfig={sortConfig} />
                        <th scope="col" className="px-6 py-3">Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map(({ student, record }) => {
                        const { icon, textClass } = getStatusInfo(record?.status);
                        return (
                             <tr key={student.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                <th scope="row" className="flex items-center px-6 py-4 text-slate-900 whitespace-nowrap dark:text-white">
                                    <UserCircleIcon className="w-10 h-10 text-slate-400" />
                                    <div className="pl-3">
                                        <div className="text-base font-semibold">{student.personal_info.full_name}</div>
                                        <div className="font-normal text-slate-500">{student.contact_info.parent_guardian.email}</div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">{student.student_id}</td>
                                <td className="px-6 py-4">{student.academic_info.grade}</td>
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