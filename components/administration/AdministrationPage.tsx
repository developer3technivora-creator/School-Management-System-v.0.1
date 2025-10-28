


import React, { useState, useMemo } from 'react';
import type { StaffMember, SchoolEvent, AuthUser } from '../../types';
import { StaffRole, EmploymentStatus, EventCategory } from '../../types';
import { ArrowUturnLeftIcon, Cog6ToothIcon, PlusIcon, PencilIcon, TrashIcon, UserCircleIcon, ChevronUpIcon, ChevronDownIcon } from '../Icons';
import { AddEditStaffModal } from './AddEditStaffModal';
import { AddEditEventModal } from './AddEditEventModal';
import { SchoolEventList } from './SchoolEventList';
import { UserList } from './UserList';



// Mock Data
const initialStaff: StaffMember[] = [
    { id: 'st1', staffId: 'T-001', fullName: 'John Davis', role: StaffRole.Principal, email: 'j.davis@school.edu', phone: '555-0101', joiningDate: '2010-08-15', status: 'Active' },
    { id: 'st2', staffId: 'T-002', fullName: 'Emily White', role: StaffRole.Teacher, email: 'e.white@school.edu', phone: '555-0102', joiningDate: '2015-09-01', status: 'Active' },
    { id: 'st3', staffId: 'T-003', fullName: 'Michael Green', role: StaffRole.Counselor, email: 'm.green@school.edu', phone: '555-0103', joiningDate: '2018-03-10', status: 'Active' },
    { id: 'st4', staffId: 'T-004', fullName: 'Sarah Blue', role: StaffRole.Librarian, email: 's.blue@school.edu', phone: '555-0104', joiningDate: '2020-01-20', status: 'On Leave' },
];

const initialEvents: SchoolEvent[] = [
    { id: 'evt1', title: 'Parent-Teacher Conference', description: 'Discuss student progress.', startDate: '2024-10-05', category: EventCategory.Meeting },
    { id: 'evt2', title: 'Science Fair', description: 'Annual school-wide science fair.', startDate: '2024-11-15', endDate: '2024-11-16', category: EventCategory.Academic },
    { id: 'evt3', title: 'Winter Break', description: 'School closed for winter break.', startDate: '2024-12-23', endDate: '2025-01-03', category: EventCategory.Holiday },
];

// Mock user data for the new User Management section.
// In a real app, this would be fetched from a secure backend function.
const initialAuthUsers: AuthUser[] = [
    { id: '2e55fa3d-ea11-4c97-8b03-19328512a543', displayName: 'Sanjay Dutt Sharma', email: 'sdsajmer@gmail.com', provider: 'email', createdAt: '2025-10-12T13:06:34Z', lastSignInAt: '2025-10-12T13:06:48Z' },
    { id: '8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', displayName: 'Jane Doe', email: 'jane.doe@example.com', provider: 'google', createdAt: '2025-10-11T10:20:00Z', lastSignInAt: '2025-10-12T09:15:30Z' },
    { id: 'c4d5e6f7-8a9b-0c1d-2e3f-4a5b6c7d8e9f', displayName: 'John Smith', email: 'john.smith@example.com', provider: 'email', createdAt: '2025-10-10T15:00:12Z', lastSignInAt: '2025-10-10T15:00:12Z' },
];


type SortKey = keyof StaffMember;
type SortDirection = 'asc' | 'desc';

const getStatusClass = (status: EmploymentStatus) => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'On Leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'Terminated': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    }
};

const StaffTable: React.FC<{ staff: StaffMember[], onEdit: (staff: StaffMember) => void, onDelete: (id: string) => void }> = ({ staff, onEdit, onDelete }) => {
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'fullName', direction: 'asc' });

    const sortedStaff = useMemo(() => {
        let sortableItems = [...staff];
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [staff, sortConfig]);

    const requestSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const SortableHeader: React.FC<{ label: string; sortKey: SortKey; }> = ({ label, sortKey }) => {
        const isActive = sortConfig.key === sortKey;
        const icon = sortConfig.direction === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />;
        return (
            <th scope="col" className="px-6 py-3">
                <button onClick={() => requestSort(sortKey)} className="group flex items-center gap-1.5">
                    {label}
                    {isActive ? icon : <span className="opacity-0 group-hover:opacity-50"><ChevronUpIcon className="h-4 w-4" /></span>}
                </button>
            </th>
        );
    };

    return (
         <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Staff Name</th>
                        <SortableHeader label="Staff ID" sortKey="staffId" />
                        <SortableHeader label="Role" sortKey="role" />
                        <SortableHeader label="Status" sortKey="status" />
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedStaff.map((member) => (
                        <tr key={member.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                            <th scope="row" className="flex items-center px-6 py-4 text-slate-900 whitespace-nowrap dark:text-white">
                                <UserCircleIcon className="w-10 h-10 text-slate-400" />
                                <div className="pl-3">
                                    <div className="text-base font-semibold">{member.fullName}</div>
                                    <div className="font-normal text-slate-500">{member.email}</div>
                                </div>
                            </th>
                            <td className="px-6 py-4">{member.staffId}</td>
                            <td className="px-6 py-4">{member.role}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(member.status)}`}>
                                    {member.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-1">
                                    <button onClick={() => onEdit(member)} className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><PencilIcon className="h-5 w-5" /></button>
                                    <button onClick={() => onDelete(member.id)} className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><TrashIcon className="h-5 w-5" /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// FIX: Removed 'Code Lookup' as it was causing an error and is redundant.
type AdminTab = 'Users' | 'Staff' | 'Events' | 'Settings';

export const AdministrationPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    // FIX: Changed initial active tab to 'Users' since 'Code Lookup' was removed.
    const [activeTab, setActiveTab] = useState<AdminTab>('Users');

    // Staff state
    const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

    // Event state
    const [events, setEvents] = useState<SchoolEvent[]>(initialEvents);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);

    // User Management State
    const [users, setUsers] = useState<AuthUser[]>(initialAuthUsers);
    const [userSearchTerm, setUserSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        return users.filter((user: AuthUser) =>
            user.displayName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
        );
    }, [users, userSearchTerm]);


    // Staff handlers
    const openAddStaffModal = () => { setEditingStaff(null); setIsStaffModalOpen(true); };
    const openEditStaffModal = (member: StaffMember) => { setEditingStaff(member); setIsStaffModalOpen(true); };
    const handleDeleteStaff = (id: string) => { if (window.confirm('Are you sure?')) setStaff(p => p.filter(s => s.id !== id)); };
    const handleSaveStaff = (member: StaffMember) => {
        if (editingStaff) setStaff(p => p.map(s => s.id === member.id ? member : s));
        else setStaff(p => [...p, { ...member, id: `st${Date.now()}` }]);
        setIsStaffModalOpen(false);
    };
    
    // Event handlers
    const openAddEventModal = () => { setEditingEvent(null); setIsEventModalOpen(true); };
    const openEditEventModal = (event: SchoolEvent) => { setEditingEvent(event); setIsEventModalOpen(true); };
    const handleDeleteEvent = (id: string) => { if (window.confirm('Are you sure?')) setEvents(p => p.filter(e => e.id !== id));};
    const handleSaveEvent = (eventData: Omit<SchoolEvent, 'id'>) => {
        if (editingEvent) setEvents(p => p.map(e => e.id === editingEvent.id ? { ...editingEvent, ...eventData } : e));
        else setEvents(p => [...p, { ...eventData, id: `evt${Date.now()}` }]);
        setIsEventModalOpen(false);
    };

    const TabButton: React.FC<{tabName: AdminTab, children: React.ReactNode}> = ({ tabName, children }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tabName ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <Cog6ToothIcon className="w-10 h-10 text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Administration</h1>
                            <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">Manage school staff, events, and settings.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onBackToDashboard} className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700">
                            <ArrowUturnLeftIcon className="h-5 w-5" /><span>Dashboard</span>
                        </button>
                        {activeTab === 'Staff' && (
                            <button onClick={openAddStaffModal} className="flex items-center justify-center gap-2 px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                                <PlusIcon className="h-5 w-5" /><span>Add Staff</span>
                            </button>
                        )}
                         {activeTab === 'Events' && (
                            <button onClick={openAddEventModal} className="flex items-center justify-center gap-2 px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                                <PlusIcon className="h-5 w-5" /><span>Add Event</span>
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl dark:border dark:border-slate-700 p-6">
                    <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                        <nav className="flex space-x-4">
                            <TabButton tabName="Users">User Management</TabButton>
                            <TabButton tabName="Staff">Staff Management</TabButton>
                            <TabButton tabName="Events">Event Management</TabButton>
                            {/* FIX: Removed 'Code Lookup' tab which was causing a missing property error. */}
                            <TabButton tabName="Settings">Settings</TabButton>
                        </nav>
                    </div>

                    {activeTab === 'Users' && (
                        <div>
                            <UserList 
                                users={filteredUsers} 
                                searchTerm={userSearchTerm}
                                onSearchTermChange={setUserSearchTerm}
                            />
                        </div>
                    )}

                    {activeTab === 'Staff' && (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Staff Members</h2>
                            <StaffTable staff={staff} onEdit={openEditStaffModal} onDelete={handleDeleteStaff} />
                        </div>
                    )}
                    
                    {activeTab === 'Events' && (
                         <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">School Events</h2>
                            <SchoolEventList events={events} onEdit={openEditEventModal} onDelete={handleDeleteEvent} />
                        </div>
                    )}

                    {/* FIX: Removed CodeLookupTab content as it was missing a required 'school' prop. */}
                    
                    {activeTab === 'Settings' && (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">School Settings</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">
                                Settings management will be implemented here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            {isStaffModalOpen && <AddEditStaffModal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} onSave={handleSaveStaff} staffMember={editingStaff} />}
            {isEventModalOpen && <AddEditEventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} onSave={handleSaveEvent} event={editingEvent} />}
        </div>
    );
};