import React from 'react';
import type { Student, HealthRecord, CourseGrade } from '../../types';
import {
    ArrowUturnLeftIcon,
    UserCircleIcon,
    AcademicCapIcon,
    HeartIcon,
    IdentificationIcon,
    ExclamationTriangleIcon,
} from '../Icons';
import { mockAcademicData, mockHealthData } from '../../data/mockData';

const InfoCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <h3 className="flex items-center gap-3 font-bold text-lg text-slate-800 dark:text-slate-200">
                <span className="text-blue-500">{icon}</span>
                {title}
            </h3>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {children}
        </div>
    </div>
);

const InfoItem: React.FC<{ label: string; value?: string | React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-slate-500 dark:text-slate-400 font-semibold">{label}</p>
        <p className="text-slate-900 dark:text-white">{value || 'N/A'}</p>
    </div>
);


export const StudentDetailPage: React.FC<{ student: Student; onBack: () => void }> = ({ student, onBack }) => {
    const academicRecords: CourseGrade[] = mockAcademicData[student.id] || [];
    const healthRecord: HealthRecord | null = mockHealthData[student.id] || null;

    const gpa = academicRecords.length > 0
        ? (academicRecords.reduce((acc, curr) => acc + ({ 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 }[curr.grade]), 0) / academicRecords.length).toFixed(2)
        : 'N/A';

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                     <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Student Profile
                    </h1>
                     <button
                        onClick={onBack}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                        <ArrowUturnLeftIcon className="h-5 w-5" />
                        <span>Back to List</span>
                    </button>
                </div>

                {/* Student Header */}
                <div className="p-6 bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl dark:border dark:border-slate-700 mb-8 flex items-center gap-6">
                    <UserCircleIcon className="w-24 h-24 text-slate-400" />
                    <div>
                        {/* FIX: Changed property access from 'fullName' to 'full_name'. */}
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{student.personal_info.full_name}</h2>
                        {/* FIX: Changed property access from 'studentId' to 'student_id'. */}
                        <p className="text-slate-500 dark:text-slate-400">{student.student_id} | {student.academic_info.grade}</p>
                        {/* FIX: Changed property access from 'enrollmentStatus' to 'enrollment_status'. */}
                        <span className={`mt-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${student.academic_info.enrollment_status === 'Enrolled' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-slate-100 text-slate-800'}`}>
                            {/* FIX: Changed property access from 'enrollmentStatus' to 'enrollment_status'. */}
                            {student.academic_info.enrollment_status}
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Personal & Contact Info */}
                    <InfoCard title="Personal & Contact Information" icon={<IdentificationIcon className="w-6 h-6" />}>
                        {/* FIX: Changed property access from camelCase to snake_case. */}
                        <InfoItem label="Full Name" value={student.personal_info.full_name} />
                        <InfoItem label="Student ID" value={student.student_id} />
                        <InfoItem label="Date of Birth" value={student.personal_info.date_of_birth} />
                        <InfoItem label="Gender" value={student.personal_info.gender} />
                        <InfoItem label="Address" value={student.personal_info.address} />
                        <div className="sm:col-span-2 border-t border-slate-200 dark:border-slate-700 my-2"></div>
                        <InfoItem label="Parent/Guardian" value={student.contact_info.parent_guardian.name} />
                        <InfoItem label="Parent Phone" value={student.contact_info.parent_guardian.phone} />
                        <InfoItem label="Parent Email" value={student.contact_info.parent_guardian.email} />
                        <div className="sm:col-span-2 border-t border-slate-200 dark:border-slate-700 my-2"></div>
                        {/* FIX: Changed property access from camelCase to snake_case. */}
                        <InfoItem label="Emergency Contact" value={`${student.contact_info.emergency_contact.name} (${student.contact_info.emergency_contact.phone})`} />
                    </InfoCard>

                    {/* Health Records */}
                    <InfoCard title="Health Summary" icon={<HeartIcon className="w-6 h-6" />}>
                        {healthRecord ? (
                            <>
                                <InfoItem label="Blood Type" value={healthRecord.bloodType} />
                                <InfoItem label="Last Checkup" value={healthRecord.lastHealthCheckupDate} />
                                <div className="sm:col-span-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30">
                                    <h4 className="flex items-center gap-2 font-bold text-red-800 dark:text-red-300">
                                        <ExclamationTriangleIcon className="w-5 h-5"/>
                                        Critical Alerts
                                    </h4>
                                    <ul className="list-disc list-inside mt-1 text-red-700 dark:text-red-300">
                                        {healthRecord.allergies.filter(a => a.toLowerCase() !== 'none known').map(a => <li key={a}>{a}</li>)}
                                        {/* FIX: Display the medical condition text inside the list item. */}
                                        {healthRecord.medicalConditions.filter(c => c.toLowerCase() !== 'none known').map(c => <li key={c}>{c}</li>)}
                                    </ul>
                                </div>
                            </>
                        ) : <p className="col-span-2 text-slate-500">No health records on file.</p>}
                    </InfoCard>

                    {/* Academic Records */}
                    <InfoCard title="Academic Summary" icon={<AcademicCapIcon className="w-6 h-6" />}>
                        <InfoItem label="Overall GPA" value={<span className="font-bold text-xl">{gpa}</span>} />
                        <div className="sm:col-span-2">
                             <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Recent Grades</h4>
                             {academicRecords.length > 0 ? (
                                <ul className="space-y-2">
                                {academicRecords.slice(0, 4).map(grade => (
                                    <li key={grade.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900/50 rounded-md">
                                        <span>{grade.courseName}</span>
                                        <span className="font-bold">{grade.grade} ({grade.score}%)</span>
                                    </li>
                                ))}
                                </ul>
                             ) : <p className="text-slate-500">No grades recorded.</p>}
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};