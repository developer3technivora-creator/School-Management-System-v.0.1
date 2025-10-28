import React from 'react';
import type { Meeting } from '../../../types';
import { MeetingType } from '../../../types';
import { CalendarDaysIcon, ClockIcon, PencilIcon, TrashIcon, UsersIcon } from '../../Icons';

interface MeetingCardProps {
    meeting: Meeting;
    onEdit: (meeting: Meeting) => void;
    onDelete: (id: string) => void;
}

const getTypeColor = (type: MeetingType) => {
    switch (type) {
        case MeetingType.ParentTeacher: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case MeetingType.Staff: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case MeetingType.Board: return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
        case MeetingType.IEP: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
};

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{meeting.title}</h3>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getTypeColor(meeting.type)}`}>
                        {meeting.type}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1.5"><CalendarDaysIcon className="w-4 h-4" /> {new Date(meeting.date + 'T00:00:00').toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><ClockIcon className="w-4 h-4" /> {meeting.time}</span>
                </div>
                 <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <strong>Location/Link:</strong> {meeting.locationOrLink}
                </div>
                <div className="flex items-start gap-2 text-sm">
                    <UsersIcon className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0"/>
                    <p>
                        <strong className="text-slate-600 dark:text-slate-300">Attendees:</strong> {meeting.attendees.map(a => a.name).join(', ')}
                    </p>
                </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-b-xl border-t dark:border-slate-700 flex justify-end gap-2">
                <button onClick={() => onEdit(meeting)} className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Edit Meeting">
                    <PencilIcon className="h-5 w-5" />
                </button>
                <button onClick={() => onDelete(meeting.id)} className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Delete Meeting">
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};
