import React, { useEffect, useState } from 'react';
import type { Student, HealthRecord } from '../../types';
import { HeartIcon, ShieldCheckIcon } from '../Icons';
import { mockHealthData } from '../../data/mockData';

const InfoCard: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-2 text-sm">{title}</h4>
        <div className="text-slate-900 dark:text-white">{children}</div>
    </div>
);


export const HealthRecordsModal: React.FC<{ isOpen: boolean; onClose: () => void; student: Student; }> = ({ isOpen, onClose, student }) => {
    const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);

    useEffect(() => {
        if (student) {
            // Fetch and set data
            setHealthRecord(mockHealthData[student.id] || null);
        }
    }, [student]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" aria-modal="true" role="dialog">
            <div className="relative w-full max-w-4xl max-h-[90vh] p-4">
                <div className="relative bg-white rounded-2xl shadow dark:bg-slate-800 flex flex-col">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-slate-600">
                        <div className="flex items-center gap-3">
                            <HeartIcon className="w-8 h-8 text-pink-500" />
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    Health Information
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{student.personal_info.full_name}</p>
                            </div>
                        </div>
                        <button type="button" onClick={onClose} className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-slate-600 dark:hover:text-white">
                             <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 overflow-y-auto flex-grow">
                        {healthRecord ? (
                            <div className="space-y-6">
                                {/* Critical Alerts */}
                                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheckIcon className="w-7 h-7 text-red-500 dark:text-red-400" />
                                        <h4 className="text-lg font-bold text-red-800 dark:text-red-300">Critical Health Alerts</h4>
                                    </div>
                                    <ul className="mt-2 ml-10 list-disc list-inside text-red-700 dark:text-red-300 space-y-1">
                                       {healthRecord.allergies.find(a => a.toLowerCase() !== 'none known' && a.toLowerCase() !== 'none') ? healthRecord.allergies.map(allergy => <li key={allergy}>{allergy}</li>) : <li>No critical allergies reported.</li>}
                                       {healthRecord.medicalConditions.find(a => a.toLowerCase() !== 'none known' && a.toLowerCase() !== 'none') ? healthRecord.medicalConditions.map(condition => <li key={condition}>{condition}</li>) : <li>No critical medical conditions reported.</li>}
                                    </ul>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                     <InfoCard title="Blood Type">{healthRecord.bloodType || 'N/A'}</InfoCard>
                                     <InfoCard title="Last Checkup">{healthRecord.lastHealthCheckupDate || 'N/A'}</InfoCard>
                                     <InfoCard title="Primary Physician">{healthRecord.physician.name} ({healthRecord.physician.phone})</InfoCard>
                                </div>
                                
                                <InfoCard title="Current Medications">
                                    {healthRecord.medications.length > 0 ? (
                                        <ul className="space-y-1">
                                            {healthRecord.medications.map(med => <li key={med.name}><strong>{med.name}</strong> ({med.dosage}, {med.frequency}) - {med.reason}</li>)}
                                        </ul>
                                    ) : <p>None</p>}
                                </InfoCard>
                                
                                <div>
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Vaccination Log</h4>
                                    <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">Vaccine Name</th>
                                                    <th scope="col" className="px-6 py-3">Date Administered</th>
                                                    <th scope="col" className="px-6 py-3">Administered By</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {healthRecord.vaccinations.length > 0 ? healthRecord.vaccinations.map(v => (
                                                    <tr key={v.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{v.vaccineName}</td>
                                                        <td className="px-6 py-4">{v.dateAdministered}</td>
                                                        <td className="px-6 py-4">{v.administeredBy}</td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={3} className="text-center py-6 text-slate-500 dark:text-slate-400">No vaccination records available.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                             <p className="text-center py-12 text-slate-500 dark:text-slate-400">No health records found for this student.</p>
                        )}
                    </div>
                    <div className="flex items-center justify-end p-4 border-t border-slate-200 dark:border-slate-600">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none bg-white rounded-lg border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};