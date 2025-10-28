import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../../services/supabase';
import type { School, AdmittedStudentView } from '../../types';
import { MagnifyingGlassIcon } from '../Icons';

interface AdmittedStudentsTabProps {
    school: School;
}

export const AdmittedStudentsTab: React.FC<AdmittedStudentsTabProps> = ({ school }) => {
    const [students, setStudents] = useState<AdmittedStudentView[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Step 1: Get all student enrollment records for the school
            const { data: enrollments, error: enrollmentsError } = await supabase
                .from('school_students')
                .select('*')
                .eq('school_id', school.id);
            if (enrollmentsError) throw enrollmentsError;
            if (!enrollments || enrollments.length === 0) {
                setStudents([]);
                setIsLoading(false);
                return;
            }

            // Step 2: Get unique child and parent IDs
            const childIds = [...new Set(enrollments.map(e => e.student_id))];
            const parentUserIds = [...new Set(enrollments.map(e => e.parent_user_id))];

            // Step 3: Fetch all required child and parent profiles in parallel
            const [childrenResult, parentsResult] = await Promise.all([
                supabase.from('child_profile').select('*').in('id', childIds),
                supabase.from('guardian_profile').select('*').in('user_id', parentUserIds).eq('is_primary', true)
            ]);

            if (childrenResult.error) throw childrenResult.error;
            if (parentsResult.error) throw parentsResult.error;

            // Step 4: Create maps for easy lookup
            const childMap = new Map((childrenResult.data || []).map(c => [c.id, c]));
            const parentMap = new Map((parentsResult.data || []).map(p => [p.user_id, p]));

            // Step 5: Combine data into the view model
            const combinedData = enrollments.map(enrollment => {
                const child = childMap.get(enrollment.student_id);
                const parent = parentMap.get(enrollment.parent_user_id);
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
            
            setStudents(combinedData);

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
        return students.filter(s => 
            s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.unique_student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.parent_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    if (isLoading) {
        return <p className="text-center p-8">Loading student data...</p>;
    }

    if (error) {
        return <p className="text-red-500 p-8 text-center">{error}</p>;
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Admitted Students</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">A list of all students admitted to your school via the portal.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">Student Name</th>
                            <th scope="col" className="px-6 py-3 font-medium">Unique ID</th>
                            <th scope="col" className="px-6 py-3 font-medium">Grade</th>
                            <th scope="col" className="px-6 py-3 font-medium">Parent Name</th>
                            <th scope="col" className="px-6 py-3 font-medium">Admission Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? filteredStudents.map(student => (
                            <tr key={student.enrollment_id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/20">
                                <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">{student.student_name}</td>
                                <td className="px-6 py-4 font-mono text-xs">{student.unique_student_id}</td>
                                <td className="px-6 py-4">{student.student_grade}</td>
                                <td className="px-6 py-4">{student.parent_name}</td>
                                <td className="px-6 py-4">{new Date(student.admission_date).toLocaleDateString()}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-slate-500 dark:text-slate-400">
                                    {searchTerm ? 'No students match your search.' : 'No students have been admitted yet.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};