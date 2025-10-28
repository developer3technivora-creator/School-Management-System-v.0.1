import React from 'react';
import type { Student } from '../../types';
import { UserCircleIcon, IdentificationIcon, UserGroupIcon, ExclamationTriangleIcon, AcademicCapIcon } from '../Icons';

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

export const StudentProfilePage: React.FC<{ student: Student }> = ({ student }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <UserCircleIcon className="w-8 h-8 text-blue-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">My Profile</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your personal and contact information on file.</p>
                </div>
            </div>

            <div className="space-y-6">
                <InfoCard title="Personal Information" icon={<IdentificationIcon className="w-6 h-6" />}>
                    <InfoItem label="Full Name" value={student.full_name} />
                    <InfoItem label="Student ID" value={student.student_id} />
                    <InfoItem label="Date of Birth" value={student.date_of_birth} />
                    <InfoItem label="Gender" value={student.gender} />
                    <InfoItem label="Grade" value={student.grade} />
                    <InfoItem label="Enrollment Status" value={student.enrollment_status} />
                    <div className="sm:col-span-2">
                        <InfoItem label="Address" value={student.address} />
                    </div>
                </InfoCard>

                {student.admissionStatus && (
                     <InfoCard title="School Admission" icon={<AcademicCapIcon className="w-6 h-6" />}>
                        <InfoItem label="School Name" value={student.admissionStatus.schoolName} />
                        <InfoItem label="School Student ID" value={<span className="font-mono">{student.admissionStatus.studentId}</span>} />
                        <InfoItem label="Admission Date" value={new Date(student.admissionStatus.admissionDate).toLocaleDateString()} />
                    </InfoCard>
                )}

                <InfoCard title="Parent / Guardian Information" icon={<UserGroupIcon className="w-6 h-6" />}>
                    <InfoItem label="Parent/Guardian Name" value={student.parent_guardian_name} />
                    <InfoItem label="Parent Phone" value={student.parent_guardian_phone} />
                    <div className="sm:col-span-2">
                     <InfoItem label="Parent Email" value={student.parent_guardian_email} />
                    </div>
                </InfoCard>

                 <InfoCard title="Emergency Contact" icon={<ExclamationTriangleIcon className="w-6 h-6" />}>
                    <InfoItem label="Contact Name" value={student.emergency_contact_name} />
                    <InfoItem label="Contact Phone" value={student.emergency_contact_phone} />
                </InfoCard>
            </div>
        </div>
    );
};