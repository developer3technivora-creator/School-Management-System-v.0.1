import React, { useState, useMemo } from 'react';
import type { SchoolEvent } from '../../types';
import { EventCategory } from '../../types';
import { ArrowUturnLeftIcon, CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '../Icons';
import { EventModal } from './EventModal';

// Mock Data
const initialEvents: SchoolEvent[] = [
    { id: 'evt1', title: 'Parent-Teacher Conference', description: 'Discuss student progress.', startDate: '2024-10-05', category: EventCategory.Meeting },
    { id: 'evt2', title: 'Science Fair', description: 'Annual school-wide science fair.', startDate: '2024-11-15', endDate: '2024-11-16', category: EventCategory.Academic },
    { id: 'evt3', title: 'Winter Break', description: 'School closed for winter break.', startDate: '2024-12-23', endDate: '2025-01-03', category: EventCategory.Holiday },
    { id: 'evt4', title: 'Championship Football Game', description: 'Go Tigers!', startDate: '2024-10-18', category: EventCategory.Sports },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getCategoryColor = (category: EventCategory) => {
    switch (category) {
        case EventCategory.Academic: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200';
        case EventCategory.Holiday: return 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-200';
        case EventCategory.Sports: return 'bg-orange-100 text-orange-800 dark:bg-orange-900/70 dark:text-orange-200';
        case EventCategory.Meeting: return 'bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-200';
        default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
};

export const EventCalendarPage: React.FC = () => {
    const [events, setEvents] = useState<SchoolEvent[]>(initialEvents);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const calendarGrid = useMemo(() => {
        const grid = [];
        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            grid.push(date);
        }
        return grid;
    }, [firstDayOfMonth]);
    
    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const handleToday = () => setCurrentDate(new Date());

    const openAddModal = (date: Date) => {
        setSelectedEvent(null);
        setSelectedDate(date.toISOString().split('T')[0]);
        setIsModalOpen(true);
    };

    const openEditModal = (event: SchoolEvent) => {
        setSelectedEvent(event);
        setSelectedDate(null);
        setIsModalOpen(true);
    };
    
    const handleSaveEvent = (eventData: Omit<SchoolEvent, 'id'>) => {
        if (selectedEvent) {
            setEvents(events.map(e => e.id === selectedEvent.id ? { ...selectedEvent, ...eventData } : e));
        } else {
            const newEvent: SchoolEvent = { ...eventData, id: `evt${Date.now()}` };
            setEvents([...events, newEvent]);
        }
        setIsModalOpen(false);
    };
    
    const handleDeleteEvent = (eventId: string) => {
        setEvents(events.filter(e => e.id !== eventId));
        setIsModalOpen(false);
    };

    return (
         <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <button onClick={handlePrevMonth} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronLeftIcon className="h-6 w-6" /></button>
                    <h2 className="text-xl font-bold w-48 text-center">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={handleNextMonth} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronRightIcon className="h-6 w-6" /></button>
                    <button onClick={handleToday} className="ml-4 px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">Today</button>
                </div>
                <button onClick={() => openAddModal(new Date())} className="mt-4 sm:mt-0 flex items-center justify-center gap-2 px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                    <PlusIcon className="h-5 w-5" /><span>Create Event</span>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-px border-l border-t border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-700">
                {daysOfWeek.map(day => (
                    <div key={day} className="py-2 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800">{day}</div>
                ))}
                {calendarGrid.map((date, index) => {
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dateStr = date.toISOString().split('T')[0];
                    const dayEvents = events.filter(e => {
                        const startDate = new Date(e.startDate + 'T00:00:00');
                        const endDate = e.endDate ? new Date(e.endDate + 'T00:00:00') : startDate;
                        return date >= startDate && date <= endDate;
                    });

                    return (
                        <div key={index} onClick={() => openAddModal(date)} className={`relative min-h-[120px] p-2 flex flex-col group ${isCurrentMonth ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400'} border-r border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors`}>
                            <span className={`font-semibold ${isToday ? 'bg-blue-600 text-white rounded-full flex items-center justify-center w-7 h-7' : ''}`}>{date.getDate()}</span>
                            <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
                                {dayEvents.map(event => (
                                    <button key={event.id} onClick={(e) => { e.stopPropagation(); openEditModal(event); }} className={`w-full text-left text-xs font-semibold p-1 rounded-md truncate ${getCategoryColor(event.category)}`}>
                                        {event.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {isModalOpen && (
                <EventModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveEvent}
                    onDelete={handleDeleteEvent}
                    event={selectedEvent}
                    selectedDate={selectedDate}
                />
            )}
        </>
    );
};