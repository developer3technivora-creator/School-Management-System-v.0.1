import React, { useState, useEffect } from 'react';
import type { SchoolEvent } from '../../types';
import { EventCategory } from '../../types';

interface AddEditEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Omit<SchoolEvent, 'id'>) => void;
    event: SchoolEvent | null;
}

export const AddEditEventModal: React.FC<AddEditEventModalProps> = ({ isOpen, onClose, onSave, event }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        category: EventCategory.Academic,
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title,
                description: event.description,
                startDate: event.startDate,
                endDate: event.endDate || '',
                category: event.category,
            });
        } else {
            setFormData({
                title: '',
                description: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                category: EventCategory.Academic,
            });
        }
        setError('');
    }, [event, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.startDate) {
            setError('Title and Start Date are required.');
            return;
        }
        if (formData.endDate && formData.endDate < formData.startDate) {
            setError('End Date cannot be before Start Date.');
            return;
        }
        onSave({ ...formData, endDate: formData.endDate || undefined });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" aria-modal="true" role="dialog">
            <div className="relative w-full max-w-lg p-4">
                <div className="relative bg-white rounded-2xl shadow dark:bg-slate-800">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-slate-600">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                            {event ? 'Edit School Event' : 'Add New School Event'}
                        </h3>
                        <button type="button" onClick={onClose} className="text-slate-400 bg-transparent hover:bg-slate-200 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-slate-600">
                             <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-4 md:p-5 space-y-4">
                        <div>
                            <label htmlFor="title" className="block mb-2 text-sm font-medium">Title</label>
                            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="bg-slate-50 border border-slate-300 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600" required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="startDate" className="block mb-2 text-sm font-medium">Start Date</label>
                                <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} className="bg-slate-50 border border-slate-300 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600" required />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block mb-2 text-sm font-medium">End Date (Optional)</label>
                                <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} className="bg-slate-50 border border-slate-300 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="category" className="block mb-2 text-sm font-medium">Category</label>
                            <select name="category" id="category" value={formData.category} onChange={handleChange} className="bg-slate-50 border border-slate-300 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600">
                                {/* FIX: Explicitly type the mapped variable `cat` to ensure type safety and resolve the 'unknown' type error. */}
                                {Object.values(EventCategory).map((cat: EventCategory) => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium">Description</label>
                            <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleChange} className="bg-slate-50 border border-slate-300 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600"></textarea>
                        </div>
                        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                        <div className="flex items-center justify-end pt-4 border-t border-slate-200 dark:border-slate-600">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-900 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="ml-3 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">{event ? 'Save Changes' : 'Create Event'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};