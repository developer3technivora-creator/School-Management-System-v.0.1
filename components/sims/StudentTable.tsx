import React, { useState, useMemo } from 'react';
import type { Student } from '../../types';
import { PencilIcon, TrashIcon, UserCircleIcon, ChevronUpIcon, ChevronDownIcon, AcademicCapIcon, HeartIcon, EyeIcon } from '../Icons';

// FIX: Create a specific SortKey type for sortable columns instead of using keyof Student.
type SortKey = 'full_name' | 'student_id' | 'grade' | 'enrollment_status';
type SortDirection = 'asc' | 'desc';

// FIX: Changed initial sort key from 'fullName' to 'full_name'.
const useSortableData = (items: Student[], initialSortKey: SortKey = 'full_name') => {
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: initialSortKey, direction: 'asc' });

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        sortableItems.sort((a, b) => {
            // FIX: Add a helper to get values from nested properties for sorting.
            const getSortableValue = (student: Student, key: SortKey): string => {
                switch(key) {
                    case 'full_name': return student.personal_info.full_name;
                    case 'student_id': return student.student_id;
                    case 'grade': return student.academic_info.grade;
                    case 'enrollment_status': return student.academic_info.enrollment_status;
                    default: return '';
                }
            }

            const valA = getSortableValue(a, sortConfig.key);
            const valB = getSortableValue(b, sortConfig.key);
            
            if (valA < valB) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
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


// FIX: Changed property access from 'enrollmentStatus' to 'enrollment_status'.
const getStatusClass = (status: Student['academic_info']['enrollment_status']) => {
    switch (status) {
        case 'Enrolled':
            return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'Withdrawn':
            return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        case 'Graduated':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        default:
            return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
};

const SortableHeader: React.FC<{
    label: string;
    sortKey: SortKey;
    requestSort: (key: SortKey) => void;
    sortConfig: { key: SortKey; direction: SortDirection };
}> = ({ label, sortKey, requestSort, sortConfig }) => {
    const isActive = sortConfig.key === sortKey;
    const directionIcon = sortConfig.direction === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />;

    return (
        <th scope="col" className="px-6 py-3">
            <button onClick={() => requestSort(sortKey)} className="group flex items-center gap-1.5">
                {label}
                {isActive ? directionIcon : <span className="opacity-0 group-hover:opacity-50"><ChevronUpIcon className="h-4 w-4" /></span>}
            </button>
        </th>
    );
}

export const StudentTable: React.FC<{ students: Student[]; onEdit: (student: Student) => void; onDelete: (id: string) => void; onViewAcademics: (student: Student) => void; onViewHealth: (student: Student) => void; onViewDetails: (student: Student) => void; }> = ({ students, onEdit, onDelete, onViewAcademics, onViewHealth, onViewDetails }) => {
    const { items: sortedStudents, requestSort, sortConfig } = useSortableData(students);

    if (students.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 py-8">No students found.</p>;
    }

    return (
        <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Student Name</th>
                        {/* FIX: Changed sortKey from 'studentId' to 'student_id'. */}
                        <SortableHeader label="Student ID" sortKey="student_id" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader label="Grade" sortKey="grade" requestSort={requestSort} sortConfig={sortConfig} />
                        {/* FIX: Changed sortKey from 'enrollmentStatus' to 'enrollment_status'. */}
                        <SortableHeader label="Status" sortKey="enrollment_status" requestSort={requestSort} sortConfig={sortConfig} />
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedStudents.map((student) => (
                        <tr key={student.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                            <th scope="row" className="flex items-center px-6 py-4 text-slate-900 whitespace-nowrap dark:text-white">
                                {/* FIX: Changed property access from 'photoUrl' to 'photo_url'. */}
                                {student.photo_url ? (
                                    // FIX: Changed property access from 'photoUrl' and 'fullName' to 'photo_url' and 'full_name'.
                                    <img className="w-10 h-10 rounded-full" src={student.photo_url} alt={`${student.personal_info.full_name} profile`} />
                                ) : (
                                    <UserCircleIcon className="w-10 h-10 text-slate-400" />
                                )}
                                <div className="pl-3">
                                    {/* FIX: Changed property access from 'fullName' to 'full_name'. */}
                                    <div className="text-base font-semibold">{student.personal_info.full_name}</div>
                                    {/* FIX: Changed property access from 'parentGuardianEmail' to 'parent_guardian_email'. */}
                                    <div className="font-normal text-slate-500">{student.contact_info.parent_guardian.email}</div>
                                </div>
                            </th>
                            {/* FIX: Changed property access from 'studentId' to 'student_id'. */}
                            <td className="px-6 py-4">{student.student_id}</td>
                            <td className="px-6 py-4">{student.academic_info.grade}</td>
                            <td className="px-6 py-4">
                                {/* FIX: Changed property access from 'enrollmentStatus' to 'enrollment_status'. */}
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(student.academic_info.enrollment_status)}`}>
                                    {/* FIX: Changed property access from 'enrollmentStatus' to 'enrollment_status'. */}
                                    {student.academic_info.enrollment_status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-1">
                                    <button onClick={() => onViewDetails(student)} className="p-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="View Details">
                                        <EyeIcon className="h-5 w-5" />
                                        <span className="sr-only">View Details</span>
                                    </button>
                                    <button onClick={() => onViewHealth(student)} className="p-2 text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="View Health Records">
                                        <HeartIcon className="h-5 w-5" />
                                        <span className="sr-only">View Health</span>
                                    </button>
                                     <button onClick={() => onViewAcademics(student)} className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="View Academics">
                                        <AcademicCapIcon className="h-5 w-5" />
                                        <span className="sr-only">View Academics</span>
                                    </button>
                                    <button onClick={() => onEdit(student)} className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Edit Student">
                                        <PencilIcon className="h-5 w-5" />
                                        <span className="sr-only">Edit student</span>
                                    </button>
                                    <button onClick={() => onDelete(student.id)} className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Delete Student">
                                        <TrashIcon className="h-5 w-5" />
                                         <span className="sr-only">Delete student</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
