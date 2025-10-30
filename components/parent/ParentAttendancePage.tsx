import React, { useState, useMemo } from 'react';
import { ArrowUturnLeftIcon, DocumentCheckIcon, CheckCircleIcon, XCircleIcon, ClockIcon, InformationCircleIcon, UserCircleIcon } from '../Icons';
import type { AttendanceRecord, ChildProfile, AttendanceStatus } from '../../types';
import { mockChildren, mockParentAttendance } from '../../data/mockData';

const getStatusInfo = (status: AttendanceStatus) => {
    switch (status) {
        case 'Present': return { icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />, textClass: 'text-green-600 dark:text-green-400' };
        case 'Absent': return { icon: <XCircleIcon className="w-5 h-5 text-red-500" />, textClass: 'text-red-600 dark:text-red-400' };
        case 'Late': return { icon: <ClockIcon className="w-5 h-5 text-yellow-500" />, textClass: 'text-yellow-600 dark:text-yellow-400' };
        case 'Excused': return { icon: <InformationCircleIcon className="w-5 h-5 text-blue-500" />, textClass: 'text-blue-600 dark:text-blue-400' };
        default: return { icon: null, textClass: '' };
    }
};

const StatCard: React.FC<{ title: string, value: number, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
        <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-full">{icon}</div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

export const ParentAttendancePage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [selectedChildId, setSelectedChildId] = useState<string>(mockChildren[0].id);
    const selectedChildRecords = mockParentAttendance[selectedChildId] || [];

    const attendanceStats = useMemo(() => {
        return selectedChildRecords.reduce((acc, record) => {
            acc[record.status] = (acc[record.status] || 0) + 1;
            return acc;
        }, {} as Record<AttendanceStatus, number>);
    }, [selectedChildRecords]);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <DocumentCheckIcon className="w-10 h-10 text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Attendance Records
                            </h1>
                            <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">
                                View attendance for all your children.
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

                <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl dark:border dark:border-slate-700 p-6">
                    <div className="mb-6">
                        <label htmlFor="child-selector" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Viewing records for:</label>
                        <select
                            id="child-selector"
                            value={selectedChildId}
                            onChange={(e) => setSelectedChildId(e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-1/3 p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        >
                            {mockChildren.map(child => (
                                <option key={child.id} value={child.id}>{child.fullName}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <StatCard title="Present" value={attendanceStats.Present || 0} icon={<CheckCircleIcon className="w-5 h-5 text-green-500"/>} />
                        <StatCard title="Absent" value={attendanceStats.Absent || 0} icon={<XCircleIcon className="w-5 h-5 text-red-500"/>} />
                        <StatCard title="Late" value={attendanceStats.Late || 0} icon={<ClockIcon className="w-5 h-5 text-yellow-500"/>} />
                        <StatCard title="Excused" value={attendanceStats.Excused || 0} icon={<InformationCircleIcon className="w-5 h-5 text-blue-500"/>} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Recent Records (This Month)</h3>
                     <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Notes from Teacher</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedChildRecords.length > 0 ? selectedChildRecords.map(record => {
                                    const { icon, textClass } = getStatusInfo(record.status);
                                    return (
                                        <tr key={record.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{record.date}</td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center gap-2 font-semibold ${textClass}`}>
                                                    {icon}
                                                    <span>{record.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{record.notes || '-'}</td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-8 text-slate-500 dark:text-slate-400">No attendance records found for this child.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};