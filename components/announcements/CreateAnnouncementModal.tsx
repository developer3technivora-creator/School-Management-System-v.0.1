import React, { useState, useEffect } from 'react';
import type { Announcement, AnnouncementAudience } from '../../types';
import { Role } from '../../types';

interface CreateAnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Announcement, 'id' | 'author' | 'date'>) => void;
    announcement: Announcement | null;
}

const audienceOptions: AnnouncementAudience[] = [Role.Parent, Role.Student, Role.Teacher];

export const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({ isOpen, onClose, onSave, announcement }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [audience, setAudience] = useState<AnnouncementAudience[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (announcement) {
            setTitle(announcement.title);
            setContent(announcement.content);
            setAudience(announcement.audience);
        } else {
            setTitle('');
            setContent('');
            setAudience([]);
        }
        setError('');
    }, [announcement, isOpen]);

    const handleAudienceChange = (role: AnnouncementAudience) => {
        setAudience(prev => 
            prev.includes(role) 
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );
    };

    const handleSubmit = () => {
        if (!title.trim() || !content.trim() || audience.length === 0) {
            setError('Title, content, and at least one audience are required.');
            return;
        }
        onSave({ title, content, audience });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" aria-modal="true" role="dialog">
            <div className="relative w-full max-w-2xl max-h-[90vh] p-4">
                <div className="relative bg-white rounded-2xl shadow dark:bg-slate-800 flex flex-col">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-slate-600">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                            {announcement ? 'Edit Announcement' : 'Create New Announcement'}
                        </h3>
                        <button type="button" onClick={onClose} className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-slate-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="p-4 md:p-5 overflow-y-auto space-y-4">
                        <div>
                            <label htmlFor="title" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">Title</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white" placeholder="Announcement Title" />
                        </div>
                        <div>
                            <label htmlFor="content" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">Content</label>
                            <textarea id="content" rows={6} value={content} onChange={e => setContent(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white" placeholder="Write the announcement details here..."></textarea>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">Target Audience</label>
                            <div className="flex flex-wrap gap-4">
                                {audienceOptions.map(role => (
                                    <div key={role} className="flex items-center">
                                        <input
                                            id={`role-${role}`}
                                            type="checkbox"
                                            checked={audience.includes(role)}
                                            onChange={() => handleAudienceChange(role)}
                                            className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                                        />
                                        <label htmlFor={`role-${role}`} className="ms-2 text-sm font-medium text-slate-900 dark:text-slate-300">{role}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                    </div>

                    <div className="flex items-center justify-end p-4 border-t border-slate-200 dark:border-slate-600">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-900 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">Cancel</button>
                        <button type="button" onClick={handleSubmit} className="ml-3 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                            {announcement ? 'Save Changes' : 'Publish Announcement'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
