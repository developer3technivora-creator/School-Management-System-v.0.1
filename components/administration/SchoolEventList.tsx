import React from 'react';
import type { SchoolEvent } from '../../types';
import { EventCategory } from '../../types';
import { PencilIcon, TrashIcon } from '../Icons';

const getCategoryClass = (category: EventCategory) => {
    switch (category) {
        case EventCategory.Academic: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200';
        case EventCategory.Holiday: return 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-200';
        case EventCategory.Sports: return 'bg-orange-100 text-orange-800 dark:bg-orange-900/70 dark:text-orange-200';
        case EventCategory.Meeting: return 'bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-200';
        default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
};

export const SchoolEventList: React.FC<{
    events: SchoolEvent[];
    onEdit: (event: SchoolEvent) => void;
    onDelete: (id: string) => void;
}> = ({ events, onEdit, onDelete }) => {
    if (events.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 py-8">No school events scheduled.</p>;
    }

    return (
        <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300">
                    <tr>
                        <th scope="col" className="px-6 py-3 font-medium">Event Title</th>
                        <th scope="col" className="px-6 py-3 font-medium">Start Date</th>
                        <th scope="col" className="px-6 py-3 font-medium">End Date</th>
                        <th scope="col" className="px-6 py-3 font-medium">Category</th>
                        <th scope="col" className="px-6 py-3 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/20">
                            <td className="px-6 py-4">
                                <p className="font-bold text-slate-800 dark:text-slate-100">{event.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{event.description}</p>
                            </td>
                            <td className="px-6 py-4">{event.startDate}</td>
                            <td className="px-6 py-4">{event.endDate || 'N/A'}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryClass(event.category)}`}>
                                    {event.category}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                    <button onClick={() => onEdit(event)} className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700" title="Edit Event">
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => onDelete(event.id)} className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700" title="Delete Event">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};