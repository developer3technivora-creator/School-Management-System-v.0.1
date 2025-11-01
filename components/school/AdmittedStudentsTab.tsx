import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { supabase } from '../../services/supabase';
import type { School, AdmittedStudentView } from '../../types';
import { 
    MagnifyingGlassIcon, 
    UserCircleIcon, 
    UsersIcon, 
    UserPlusIcon, 
    CalendarDaysIcon, 
    EllipsisVerticalIcon,
    EyeIcon,
    EnvelopeIcon,
    TrashIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ArrowDownTrayIcon,
    FunnelIcon
} from '../Icons';

interface AdmittedStudentsTabProps {
    school: School;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800/60 p-5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/80 flex items-center gap-4">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-500 dark:text-blue-300">
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        </div>
    </div>
);

type SortKey = keyof AdmittedStudentView;
type SortDirection = 'asc' | 'desc';

const useSortableData = (items: AdmittedStudentView[], initialSortKey: SortKey = 'student_name') => {
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: initialSortKey, direction: 'asc' });

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        sortableItems.sort((a, b) => {
            const valA = a[sortConfig.key] || '';
            const valB = b[sortConfig.key] || '';
            
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
        <th scope="col" className="px-6 py-3 font-medium">
            <button onClick={() => requestSort(sortKey)} className="group flex items-center gap-1.5">
                {label}
                <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                    {icon}
                </span>
            </button>
        </th>
    );
};

export const AdmittedStudentsTab: React.FC<AdmittedStudentsTabProps> = ({ school }) => {
    const [allStudents, setAllStudents] = useState<AdmittedStudentView[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data: enrollments, error: enrollmentsError } = await supabase
                .from('school_students')
                .select('*')
                .eq('school_id', school.id);
            if (enrollmentsError) throw enrollmentsError;
            if (!enrollments || enrollments.length === 0) {
                setAllStudents([]);
                setIsLoading(false);
                return;
            }

            const childIds = [...new Set(enrollments.map(e => e.student_id))];
            const parentUserIds = [...new Set(enrollments.map(e => e.parent_user_id))];

            const [childrenResult, parentsResult] = await Promise.all([
                supabase.from('child_profile').select('*').in('id', childIds),
                supabase.from('guardian_profile').select('*').in('user_id', parentUserIds).eq('is_primary', true)
            ]);

            if (childrenResult.error) throw childrenResult.error;
            if (parentsResult.error) throw parentsResult.error;

            const childMap = new Map((childrenResult.data || []).map(c => [c.id, c]));
            const parentMap = new Map((parentsResult.data || []).map(p => [p.user_id, p]));

            const combinedData = enrollments.map(enrollment => {
                // FIX: Explicitly type `child` and `parent` as `any` to resolve property access errors on what is inferred as `unknown`.
                const child: any = childMap.get(enrollment.student_id);
                const parent: any = parentMap.get(enrollment.parent_user_id);
                return {
                    enrollment_id: enrollment.id,
                    unique_student_id: enrollment.student_unique_id,
                    admission_date: enrollment.added_date,
                    student_name: child?.full_name || 'Unknown Student',
                    student_grade: child?.grade || 'N/A',
                    student_age: child?.age ?? '',
                    parent_name: parent?.full_name || 'Unknown Parent',
                    parent_email: parent?.email || null,
                    parent_phone: parent?.phone || null,
                };
            });
            
            setAllStudents(combinedData);

        } catch (err: any) {
            setError(`Failed to load students: ${err.message}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [school.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const filteredStudents = useMemo(() => {
        return allStudents.filter(s => 
            s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.unique_student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.parent_email && s.parent_email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [allStudents, searchTerm]);
    
    const { items: sortedStudents, requestSort, sortConfig } = useSortableData(filteredStudents, 'student_name');

    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedStudents.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedStudents, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const stats = useMemo(() => {
        const total = allStudents.length;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newThisMonth = allStudents.filter(s => new Date(s.admission_date) >= startOfMonth).length;
        return { total, newThisMonth };
    }, [allStudents]);

    const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuId && menuRefs.current[openMenuId] && !menuRefs.current[openMenuId]!.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuId]);

    if (isLoading) return <p className="text-center p-8 text-slate-500 dark:text-slate-400">Loading student data...</p>;
    if (error) return <p className="text-red-500 p-8 text-center">{error}</p>;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Admitted Students" value={stats.total} icon={<UsersIcon className="w-6 h-6"/>} />
                <StatCard title="New Admissions (This Month)" value={stats.newThisMonth} icon={<UserPlusIcon className="w-6 h-6"/>} />
                <StatCard title="Avg. Admission Age" value="12.5" icon={<CalendarDaysIcon className="w-6 h-6"/>} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                 <div className="relative w-full md:w-80">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search students by name, ID, parent..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <FunnelIcon className="w-4 h-4" /> Filter
                    </button>
                     <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <ArrowDownTrayIcon className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300">
                        <tr>
                            <SortableHeader label="Student Name" sortKey="student_name" requestSort={requestSort} sortConfig={sortConfig} />
                            <SortableHeader label="Unique ID" sortKey="unique_student_id" requestSort={requestSort} sortConfig={sortConfig} />
                            <SortableHeader label="Grade" sortKey="student_grade" requestSort={requestSort} sortConfig={sortConfig} />
                            <SortableHeader label="Parent" sortKey="parent_name" requestSort={requestSort} sortConfig={sortConfig} />
                            <SortableHeader label="Admission Date" sortKey="admission_date" requestSort={requestSort} sortConfig={sortConfig} />
                            <th scope="col" className="px-6 py-3 font-medium text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                         {paginatedStudents.map(student => (
                            <tr key={student.enrollment_id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/20">
                                <td scope="row" className="flex items-center px-6 py-4 text-slate-900 whitespace-nowrap dark:text-white">
                                    <UserCircleIcon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                    <div className="pl-3">
                                        <div className="text-base font-semibold">{student.student_name}</div>
                                        <div className="font-normal text-slate-500">{student.parent_email || 'No email on file'}</div>
                                    </div>  
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">{student.unique_student_id}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 font-semibold leading-tight text-blue-700 bg-blue-100 rounded-full dark:bg-blue-700 dark:text-blue-100 text-xs">
                                        {student.student_grade}
                                    </span>
                                </td>
                                 <td className="px-6 py-4">
                                     <div className="flex flex-col">
                                         <span className="font-medium text-slate-800 dark:text-slate-100">{student.parent_name}</span>
                                         <span className="text-slate-500">{student.parent_phone}</span>
                                     </div>
                                 </td>
                                <td className="px-6 py-4">{new Date(student.admission_date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="relative inline-block">
                                        <button onClick={() => setOpenMenuId(openMenuId === student.enrollment_id ? null : student.enrollment_id)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                                            <EllipsisVerticalIcon className="w-5 h-5"/>
                                        </button>
                                        {openMenuId === student.enrollment_id && (
                                            // FIX: Corrected the callback ref to not return a value, resolving the TypeScript error.
                                            <div ref={el => { menuRefs.current[student.enrollment_id] = el; }} className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-10 border dark:border-slate-700 py-1 text-left">
                                                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"><EyeIcon className="w-4 h-4" /> View Profile</a>
                                                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"><EnvelopeIcon className="w-4 h-4" /> Send Email</a>
                                                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"><TrashIcon className="w-4 h-4" /> Deactivate</a>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {paginatedStudents.length === 0 && (
                    <div className="text-center py-16 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800">
                        <p className="font-semibold">No Students Found</p>
                        <p className="text-sm mt-1">{searchTerm ? 'Try adjusting your search or filter.' : 'No students have been admitted yet.'}</p>
                    </div>
                 )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 text-sm px-2">
                    <span className="text-slate-600 dark:text-slate-400">
                        Showing <span className="font-semibold">{paginatedStudents.length}</span> of <span className="font-semibold">{sortedStudents.length}</span> students
                    </span>
                    <div className="inline-flex items-center -space-x-px">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 ml-0 leading-tight text-slate-500 bg-white border border-slate-300 rounded-l-lg hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white disabled:opacity-50">
                            Previous
                        </button>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 leading-tight text-slate-500 bg-white border border-slate-300 rounded-r-lg hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white disabled:opacity-50">
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};