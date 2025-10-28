import React, { useState, useMemo } from 'react';
import type { Meeting, Attendee } from '../../../types';
import { MeetingType } from '../../../types';
import { ArrowUturnLeftIcon, UserGroupIcon, PlusIcon } from '../../Icons';
import { AddEditMeetingModal } from './AddEditMeetingModal';
import { MeetingCard } from './MeetingCard';

const initialMeetings: Meeting[] = [
    { id: 'M1', title: 'Q3 Board Meeting', date: '2024-09-15', time: '10:00', type: MeetingType.Board, locationOrLink: 'Conference Room 1', attendees: [{id: '1', name: 'Principal Thompson', role: 'Admin'}, {id: '2', name: 'Board Members', role: 'Admin'}]},
    { id: 'M2', title: 'Parent-Teacher Conferences - 10th Grade', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '14:00', type: MeetingType.ParentTeacher, locationOrLink: 'Various Classrooms', attendees: [{id: '3', name: '10th Grade Teachers', role: 'Teacher'}, {id: '4', name: 'Parents', role: 'Parent'}]},
    { id: 'M3', title: 'Weekly Staff Sync', date: new Date().toISOString().split('T')[0], time: '08:30', type: MeetingType.Staff, locationOrLink: 'Staff Lounge', attendees: [{id: '5', name: 'All Staff', role: 'Teacher'}]},
    { id: 'M4', title: 'Past IEP Meeting for C. Brown', date: '2024-05-20', time: '13:00', type: MeetingType.IEP, locationOrLink: 'Counseling Office', attendees: [{id: '6', name: 'Mr. Green', role: 'Teacher'}, {id: '7', name: 'David Brown', role: 'Parent'}]},
];

type MeetingFilter = 'upcoming' | 'past' | 'all';

export const MeetingManagementPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
    const [activeFilter, setActiveFilter] = useState<MeetingFilter>('upcoming');

    const filteredMeetings = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return meetings
            .filter(m => {
                if (activeFilter === 'upcoming') return m.date >= today;
                if (activeFilter === 'past') return m.date < today;
                return true;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [meetings, activeFilter]);

    const openAddModal = () => {
        setEditingMeeting(null);
        setIsModalOpen(true);
    };

    const openEditModal = (meeting: Meeting) => {
        setEditingMeeting(meeting);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this meeting?')) {
            setMeetings(prev => prev.filter(m => m.id !== id));
        }
    };

    const handleSave = (data: Omit<Meeting, 'id' | 'attendees'> & { attendees: string }) => {
        const attendees: Attendee[] = data.attendees.split(',').map((name, i) => ({ id: `a${Date.now()}${i}`, name: name.trim(), role: 'Admin' })); // Role is simplified
        if (editingMeeting) {
            setMeetings(prev => prev.map(m => m.id === editingMeeting.id ? { ...editingMeeting, ...data, attendees } : m));
        } else {
            const newMeeting: Meeting = { ...data, id: `M${Date.now()}`, attendees };
            setMeetings(prev => [...prev, newMeeting]);
        }
        setIsModalOpen(false);
    };
    
    const FilterButton: React.FC<{ filter: MeetingFilter; label: string; }> = ({ filter, label }) => (
         <button
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeFilter === filter ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <UserGroupIcon className="w-10 h-10 text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Meeting Management
                            </h1>
                            <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">
                                Plan and organize all school meetings.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onBackToDashboard}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                        <ArrowUturnLeftIcon className="h-5 w-5" />
                        <span>Dashboard</span>
                    </button>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                     <div className="flex space-x-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                        <FilterButton filter="upcoming" label="Upcoming" />
                        <FilterButton filter="past" label="Past" />
                        <FilterButton filter="all" label="All Meetings" />
                    </div>
                    <button onClick={openAddModal} className="flex items-center justify-center gap-2 px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                        <PlusIcon className="h-5 w-5" /><span>Schedule New Meeting</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMeetings.length > 0 ? (
                        filteredMeetings.map(meeting => (
                            <MeetingCard key={meeting.id} meeting={meeting} onEdit={openEditModal} onDelete={handleDelete} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                            <p>No {activeFilter} meetings found.</p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <AddEditMeetingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} meeting={editingMeeting} />
            )}
        </div>
    );
};
