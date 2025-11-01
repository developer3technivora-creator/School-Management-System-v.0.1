import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase';
import type { Student, AttendanceRecord, School, AttendanceStatus } from '../../types';
import { AttendanceTable } from './AttendanceTable';
import { MarkAttendanceModal } from './MarkAttendanceModal';
import { ArrowUturnLeftIcon, DocumentCheckIcon, PlusIcon, PercentIcon, UserMinusIcon, ClockIcon, ArrowDownTrayIcon } from '../Icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800/80 p-5 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-4">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">{icon}</div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

export const AttendanceManagementPage: React.FC<{ school: School; onBackToDashboard: () => void }> = ({ school, onBackToDashboard }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [attendanceForDate, setAttendanceForDate] = useState<AttendanceRecord[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(true);
    const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [gradeFilter, setGradeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'All' | 'Not Marked'>('All');
    
    const fetchStudents = useCallback(async () => {
        setIsLoadingStudents(true);
        setError(null);
        try {
            const { data: schoolStudentsData, error: schoolStudentsError } = await supabase
                .from('school_students')
                .select('student_id, student_unique_id, parent_user_id')
                .eq('school_id', school.id);

            if (schoolStudentsError) throw schoolStudentsError;
            if (!schoolStudentsData || schoolStudentsData.length === 0) {
                setStudents([]);
                return;
            }

            const studentIds = schoolStudentsData.map(s => s.student_id);
            const parentUserIds = [...new Set(schoolStudentsData.map(s => s.parent_user_id))];

            const [profilesRes, guardiansRes] = await Promise.all([
                supabase.from('child_profile').select('*').in('id', studentIds),
                supabase.from('guardian_profile').select('*').in('user_id', parentUserIds).eq('is_primary', true)
            ]);

            if (profilesRes.error) throw profilesRes.error;
            if (guardiansRes.error) throw guardiansRes.error;

            const parentMap = new Map((guardiansRes.data || []).map(p => [p.user_id, p]));
            
            const schoolStudentsList: Student[] = (profilesRes.data || []).map(profile => {
                const enrollment = schoolStudentsData.find(s => s.student_id === profile.id);
                // FIX: Explicitly type `parent` as `any` to resolve property access errors on what is inferred as `unknown`.
                const parent: any = parentMap.get(enrollment?.parent_user_id);
                return {
                    id: profile.id,
                    student_id: enrollment?.student_unique_id || 'N/A',
                    photo_url: undefined, // child_profile doesn't have photo_url currently
                    personal_info: {
                        full_name: profile.full_name || 'No Name',
                        date_of_birth: '', // Not in child_profile
                        gender: profile.gender || '',
                        address: parent?.address || '',
                    },
                    academic_info: {
                        grade: profile.grade || 'N/A',
                        enrollment_status: 'Enrolled', // This should be ideally in school_students
                        admission_status: null, // This is complex, leaving null for now
                    },
                    contact_info: {
                        parent_guardian: { name: parent?.full_name || 'N/A', phone: parent?.phone || 'N/A', email: parent?.email || 'N/A' },
                        emergency_contact: { name: parent?.full_name || 'N/A', phone: parent?.phone || 'N/A' }
                    }
                };
            });
            setStudents(schoolStudentsList);
        } catch (err: any) {
            setError(`Failed to load students: ${err.message}`);
            console.error(err);
        } finally {
            setIsLoadingStudents(false);
        }
    }, [school.id]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const fetchAttendanceForDate = useCallback(async () => {
        if (students.length === 0) {
            setAttendanceForDate([]);
            return;
        }
        setIsLoadingAttendance(true);
        setError(null);
        try {
            const studentIds = students.map(s => s.id);
            const { data, error: attendanceError } = await supabase
                .from('attendance_records')
                .select('*')
                .eq('date', selectedDate)
                .in('student_id', studentIds);

            if (attendanceError) throw attendanceError;

            const transformedData = data.map(r => ({
                id: r.id,
                studentId: r.student_id,
                date: r.date,
                status: r.status as AttendanceStatus,
                notes: r.notes
            }));
            setAttendanceForDate(transformedData);
        } catch (err: any) {
            setError(`Failed to load attendance: ${err.message}`);
            console.error(err);
        } finally {
            setIsLoadingAttendance(false);
        }
    }, [selectedDate, students]);

    useEffect(() => {
        if(students.length > 0) {
            fetchAttendanceForDate();
        }
    }, [fetchAttendanceForDate, students.length]);

    const handleSaveAttendance = async (newRecords: Omit<AttendanceRecord, 'id'>[]): Promise<boolean> => {
        const recordsToUpsert = newRecords.map(rec => ({
            student_id: rec.studentId,
            date: rec.date,
            status: rec.status,
            notes: rec.notes,
            school_id: school.id
        }));

        const { data, error: upsertError } = await supabase
            .from('attendance_records')
            .upsert(recordsToUpsert, { onConflict: 'student_id,date,school_id' })
            .select();
        
        if (upsertError) {
            setError(`Failed to save attendance: ${upsertError.message}`);
            console.error(upsertError);
            return false;
        } 
        
        if (data) {
            await fetchAttendanceForDate(); // Refetch to get all records for the day
            setIsModalOpen(false);
            return true;
        }

        return false;
    };

    const attendanceStats = useMemo(() => {
        if (students.length === 0) {
            return { rate: '0%', absent: 0, late: 0 };
        }
        const markedStudents = attendanceForDate.length;
        const presentOrLate = attendanceForDate.filter(r => r.status === 'Present' || r.status === 'Late').length;
        const rate = markedStudents > 0 ? ((presentOrLate / students.length) * 100).toFixed(0) : 0;
        const absent = attendanceForDate.filter(r => r.status === 'Absent').length;
        const late = attendanceForDate.filter(r => r.status === 'Late').length;
    
        return {
            rate: `${rate}%`,
            absent,
            late,
        };
    }, [attendanceForDate, students]);

    const gradeLevels = useMemo(() => Array.from(new Set(students.map(s => s.academic_info.grade))).sort(), [students]);
    const statusOptions: (AttendanceStatus | 'Not Marked')[] = ['Present', 'Absent', 'Late', 'Excused', 'Not Marked'];
    
    const displayData = useMemo(() => {
        return students
            .map(student => {
                const record = attendanceForDate.find(r => r.studentId === student.id);
                return {
                    student,
                    record: record ? { status: record.status, notes: record.notes } : { status: 'Not Marked' as const, notes: '' },
                };
            })
            .filter(item => {
                if (gradeFilter !== 'All' && item.student.academic_info.grade !== gradeFilter) {
                    return false;
                }
                if (statusFilter !== 'All' && item.record.status !== statusFilter) {
                    return false;
                }
                return true;
            });
    }, [students, attendanceForDate, gradeFilter, statusFilter]);

    const handleExport = () => {
        const headers = ['Student ID', 'Student Name', 'Date', 'Status', 'Notes'];
        const rows = displayData.map(item => [
            item.student.student_id,
            item.student.personal_info.full_name,
            selectedDate,
            item.record.status,
            item.record.notes || ''
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `attendance_${selectedDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const renderContent = () => {
        if (isLoadingStudents) {
            return <div className="text-center p-12 text-slate-500 dark:text-slate-400">Loading student data...</div>;
        }
        if (error) {
            return <div className="text-center p-12 text-red-500">{error}</div>;
        }
         if (students.length === 0) {
            return <div className="text-center p-12 text-slate-500 dark:text-slate-400">No students found for this school.</div>;
        }
        return (
            <div className="relative">
                {isLoadingAttendance && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 flex items-center justify-center z-10 rounded-lg">
                        <p>Loading attendance...</p>
                    </div>
                )}
                <AttendanceTable data={displayData} />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <DocumentCheckIcon className="w-10 h-10 text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Attendance Management
                            </h1>
                            <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">
                                Track and manage daily student attendance for {selectedDate}.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onBackToDashboard}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                        <ArrowUturnLeftIcon className="h-5 w-5" />
                        <span>Dashboard</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Attendance Rate (Marked)" value={attendanceStats.rate} icon={<PercentIcon className="w-6 h-6"/>} />
                    <StatCard title="Total Absences" value={attendanceStats.absent} icon={<UserMinusIcon className="w-6 h-6"/>} />
                    <StatCard title="Late Arrivals" value={attendanceStats.late} icon={<ClockIcon className="w-6 h-6"/>} />
                </div>

                <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl dark:border dark:border-slate-700 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                             <div className="relative w-full sm:w-auto">
                                <label htmlFor="attendance-date" className="sr-only">Select Date:</label>
                                <input
                                    type="date"
                                    id="attendance-date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="bg-slate-100/50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg block w-full p-2.5"
                                />
                            </div>
                             <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)} className="w-full sm:w-auto bg-slate-100/50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm rounded-lg block p-2.5">
                                <option value="All">All Grades</option>
                                {gradeLevels.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                             <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="w-full sm:w-auto bg-slate-100/50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm rounded-lg block p-2.5">
                                <option value="All">All Statuses</option>
                                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button onClick={handleExport} className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                                <ArrowDownTrayIcon className="h-5 w-5" />
                                <span>Export</span>
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                disabled={isLoadingStudents || students.length === 0}
                                className="flex items-center justify-center gap-2 w-full md:w-auto px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                            >
                                <PlusIcon className="h-5 w-5" />
                                <span>Mark Attendance</span>
                            </button>
                        </div>
                    </div>
                    {renderContent()}
                </div>

            </div>
            {isModalOpen && (
                <MarkAttendanceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveAttendance}
                    students={students}
                    date={selectedDate}
                    existingRecords={attendanceForDate}
                />
            )}
        </div>
    );
};
