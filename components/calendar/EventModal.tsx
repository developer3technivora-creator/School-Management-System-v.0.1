import React, { useState, useEffect } from 'react';
import type { SchoolEvent } from '../../types';
import { EventCategory } from '../../types';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Omit<SchoolEvent, 'id'>) => void;
    onDelete: (eventId: string) => void;
    event: SchoolEvent | null;
    selectedDate: string | null;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, onDelete, event, selectedDate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [category, setCategory] = useState<EventCategory>(EventCategory.Academic);
    const [error, setError] = useState('');

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setDescription(event.description);
            setStartDate(event.startDate);
            setEndDate(event.endDate || '');
            setCategory(event.category);
        } else {
            setTitle('');
            setDescription('');
            setStartDate(selectedDate || '');
            setEndDate('');
            setCategory(EventCategory.Academic);
        }
        setError('');
    }, [event, selectedDate, isOpen]);

    const handleSubmit = () => {
        if (!title.trim() || !startDate) {
            setError('Title and Start Date are required.');
            return;
        }
        if (endDate && endDate < startDate) {
            setError('End Date cannot be before Start Date.');
            return;
        }
        onSave({ title, description, startDate, endDate: endDate || undefined, category });
    };
    
    const handleDelete = () => {
        if (event && window.confirm('Are you sure you want to delete this event?')) {
            onDelete(event.id);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" aria-modal="true" role="dialog">
            <div className="relative w-full max-w-lg max-h-[90vh] p-4">
                <div className="relative bg-white rounded-2xl shadow dark:bg-slate-800 flex flex-col">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-slate-600">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{event ? 'Edit Event' : 'Create New Event'}</h3>
                        <button onClick={onClose} className="text-slate-400 bg-transparent hover:bg-slate-200 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-slate-600">
                             <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                        </button>
                    </div>

                    <div className="p-4 md:p-5 overflow-y-auto space-y-4">
                        <div>
                            <label htmlFor="title" className="block mb-2 text-sm font-medium">Title</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="bg-slate-50 border border-slate-300 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startDate" className="block mb-2 text-sm font-medium">Start Date</label>
                                <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-slate-50 border border-slate-300 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600" />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block mb-2 text-sm font-medium">End Date (Optional)</label>
                                <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-slate-50 border border-slate-300 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="category" className="block mb-2 text-sm font-medium">Category</label>
                            <select id="category" value={category} onChange={e => setCategory(e.target.value as EventCategory)} className="bg-slate-50 border border-slate-300 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600">
                                {/* FIX: Explicitly type the mapped variable `cat` to ensure type safety and resolve the 'unknown' type error. */}
                                {Object.values(EventCategory).map((cat: EventCategory) => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium">Description</label>
                            <textarea id="description" rows={4} value={description} onChange={e => setDescription(e.target.value)} className="bg-slate-50 border border-slate-300 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600"></textarea>
                        </div>
                        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-600">
                        <div>
                           {event && <button onClick={handleDelete} className="px-5 py-2.5 text-sm font-medium text-red-600 bg-transparent hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700 rounded-lg">Delete Event</button>}
                        </div>
                        <div className="flex items-center">
                            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-900 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">Cancel</button>
                            <button onClick={handleSubmit} className="ml-3 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">{event ? 'Save Changes' : 'Create Event'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};