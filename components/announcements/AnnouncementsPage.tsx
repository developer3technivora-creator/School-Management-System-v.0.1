import React, { useState } from 'react';
import type { Announcement, User } from '../../types';
import { Role } from '../../types';
import { ArrowUturnLeftIcon, MegaphoneIcon, PlusIcon, PencilIcon, TrashIcon, UsersIcon } from '../Icons';
import { CreateAnnouncementModal } from './CreateAnnouncementModal';
import { mockAnnouncements } from '../../data/mockData';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const AudienceTag: React.FC<{ role: string }> = ({ role }) => {
    const style: Record<string, string> = {
        [Role.Parent]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        [Role.Student]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        [Role.Teacher]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    }
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${style[role] || 'bg-slate-100'}`}>{role}</span>
}


export const AnnouncementsPage: React.FC<{ onBackToDashboard: () => void; user: User }> = ({ onBackToDashboard, user }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    const openAddModal = () => {
        setEditingAnnouncement(null);
        setIsModalOpen(true);
    };

    const openEditModal = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            setAnnouncements(prev => prev.filter(a => a.id !== id));
        }
    };
    
    const handleSave = (data: Omit<Announcement, 'id' | 'author' | 'date'>) => {
        if (editingAnnouncement) {
            setAnnouncements(prev => prev.map(a => a.id === editingAnnouncement.id ? { ...editingAnnouncement, ...data } : a));
        } else {
            const newAnnouncement: Announcement = {
                ...data,
                id: `anc${Date.now()}`,
                author: user.user_metadata?.fullName || 'School Admin',
                date: getTodayDateString(),
            };
            setAnnouncements(prev => [newAnnouncement, ...prev]);
        }
        setIsModalOpen(false);
    };


    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <MegaphoneIcon className="w-10 h-10 text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Announcements</h1>
                            <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">Broadcast news and updates to the school community.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onBackToDashboard} className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <ArrowUturnLeftIcon className="h-5 w-5" /><span>Dashboard</span>
                        </button>
                        <button onClick={openAddModal} className="flex items-center justify-center gap-2 px-5 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                            <PlusIcon className="h-5 w-5" /><span>Create New</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {announcements.map(ann => (
                        <div key={ann.id} className="bg-white dark:bg-slate-800/60 rounded-xl shadow-lg dark:border dark:border-slate-700 flex flex-col">
                            <div className="p-6 flex-grow">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{ann.title}</h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 whitespace-pre-wrap">{ann.content}</p>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-b-xl border-t dark:border-slate-700 space-y-3">
                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span>By <strong>{ann.author}</strong> on {ann.date}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(ann)} className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"><PencilIcon className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete(ann.id)} className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-red-500"><TrashIcon className="h-4 w-4" /></button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <UsersIcon className="h-4 w-4 text-slate-400" />
                                    <div className="flex flex-wrap gap-1.5">
                                        {ann.audience.map(role => <AudienceTag key={role} role={role} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {isModalOpen && (
                <CreateAnnouncementModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    announcement={editingAnnouncement}
                />
            )}
        </div>
    );
};