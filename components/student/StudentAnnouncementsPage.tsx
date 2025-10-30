import React from 'react';
import type { Announcement } from '../../types';
import { Role } from '../../types';
import { MegaphoneIcon, UsersIcon } from '../Icons';
import { mockAnnouncements } from '../../data/mockData';

export const StudentAnnouncementsPage: React.FC = () => {
    const studentAnnouncements = mockAnnouncements
        .filter(ann => ann.audience.includes(Role.Student))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <MegaphoneIcon className="w-8 h-8 text-blue-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">School News & Announcements</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Important updates from the school administration and faculty.</p>
                </div>
            </div>

            <div className="space-y-4">
                {studentAnnouncements.map(ann => (
                    <div key={ann.id} className="bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col">
                        <div className="p-6 flex-grow">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{ann.title}</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 whitespace-pre-wrap">{ann.content}</p>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-b-xl border-t dark:border-slate-700">
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>By <strong>{ann.author}</strong></span>
                                <span>{ann.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};