import React, { useState, useMemo } from 'react';
import { ArrowUturnLeftIcon, DocumentCheckIcon, CheckCircleIcon, XCircleIcon, ClockIcon, InformationCircleIcon } from '../Icons';
import type { AttendanceRecord, ChildProfile, AttendanceStatus } from '../../types';
import { mockChildren, mockAttendanceRecords, mockStudents } from '../../data/mockData';

const getStatusInfo = (status: AttendanceStatus) => {
    switch (status) {
        case 'Present': return { icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />, textClass: 'text-green-600 dark:text-green-400', color: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-500/30' };
        case 'Absent': return { icon: <XCircleIcon className="w-5 h-5 text-red-500" />, textClass: 'text-red-600 dark:text-red-400', color: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-500/30' };
        case 'Late': return { icon: <ClockIcon className="w-5 h-5 text-yellow-500" />, textClass: 'text-yellow-600 dark:text-yellow-400', color: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-500/30' };
        case 'Excused': return { icon: <InformationCircleIcon className="w-5 h-5 text-blue-500" />, textClass: 'text-blue-600 dark:text-blue-400', color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-500/30' };
        default: return { icon: null, textClass: '', color: 'bg-slate-50 dark:bg-slate-800/50' };
    }
};

const StatCard: React.FC<{ title: string, value: number, icon: React.ReactNode, colorClass: string }> = ({ title, value, icon, colorClass }) => (
    <div className={`p-4 rounded-xl border ${colorClass}`}>
        <div className="flex items-center gap-3">
            {icon}
            <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            </div>
        </div>
    </div>
);

const CalendarView: React.FC<{ records: AttendanceRecord[] }> = ({ records }) => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const daysInMonth = Array.from({ length: lastDay.getDate() }, (_, i) => i + 1);
    const startingDay = firstDay.getDay();

    const recordsByDate = useMemo(() => new Map(records.map(r => [new Date(r.date + 'T00:00:00').getDate(), r])), [records]);

    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-lg mb-4">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startingDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {daysInMonth.map(day => {
                    const record = recordsByDate.get(day);
                    const statusClass = record ? getStatusInfo(record.status).color : 'bg-slate-50 dark:bg-slate-800/50';
                    return (
                        <div key={day} title={record ? `${record.status}${record.notes ? `: ${record.notes}`: ''}` : 'No record'} className={`h-12 w-full rounded-md flex items-center justify-center font-semibold text-slate-700 dark:text-slate-200 ${statusClass} transition-transform hover:scale-110`}>
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export const ParentAttendancePage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [selectedChildId, setSelectedChildId] = useState<string>(mockChildren[0].id);

    const childToStudentIdMap = useMemo(() => {
        const mapping = new Map<string, string>();
        mockChildren.forEach(child => {
            const student = mockStudents.find(s => s.personal_info.full_name === child.fullName);
            if (student) mapping.set(child.id, student.id);
        });
        return mapping;
    }, []);

    const selectedChildRecords = useMemo(() => {
        const studentId = childToStudentIdMap.get(selectedChildId);
        if (!studentId) return [];
        return mockAttendanceRecords.filter(record => record.studentId === studentId);
    }, [selectedChildId, childToStudentIdMap]);

    const attendanceStats = useMemo(() => {
        return selectedChildRecords.reduce((acc, record) => {
            acc[record.status] = (acc[record.status] || 0) + 1;
            return acc;
        }, {} as Record<AttendanceStatus, number>);
    }, [selectedChildRecords]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-500 rounded-xl">
                        <DocumentCheckIcon className="w-8 h-8"/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance Records</h1>
                        <p className="text-slate-500 dark:text-slate-400">View attendance for your children.</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-200 dark:bg-slate-800 rounded-xl">
                {mockChildren.map(child => (
                    <button
                        key={child.id}
                        onClick={() => setSelectedChildId(child.id)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2 ${selectedChildId === child.id ? 'bg-white dark:bg-slate-700 shadow-md' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                         <img className="h-6 w-6 rounded-full" src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${child.fullName.split(' ')[0]}`} alt={child.fullName} />
                        {child.fullName}
                    </button>
                ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Present" value={attendanceStats.Present || 0} icon={<CheckCircleIcon className="w-6 h-6 text-green-500"/>} colorClass="border-green-200 dark:border-green-500/30" />
                <StatCard title="Absent" value={attendanceStats.Absent || 0} icon={<XCircleIcon className="w-6 h-6 text-red-500"/>} colorClass="border-red-200 dark:border-red-500/30"/>
                <StatCard title="Late" value={attendanceStats.Late || 0} icon={<ClockIcon className="w-6 h-6 text-yellow-500"/>} colorClass="border-yellow-200 dark:border-yellow-500/30"/>
                <StatCard title="Excused" value={attendanceStats.Excused || 0} icon={<InformationCircleIcon className="w-6 h-6 text-blue-500"/>} colorClass="border-blue-200 dark:border-blue-500/30"/>
            </div>

            <CalendarView records={selectedChildRecords} />
        </div>
    );
};
