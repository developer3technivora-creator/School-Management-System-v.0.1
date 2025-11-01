import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { StaffMember } from '../../../types';
import { StaffRole, EmploymentStatus } from '../../../types';
import { 
    ArrowUturnLeftIcon, 
    BriefcaseIcon, 
    PlusIcon, 
    MagnifyingGlassIcon, 
    UserCircleIcon, 
    EllipsisVerticalIcon, 
    PencilIcon, 
    TrashIcon,
    AdjustmentsHorizontalIcon
} from '../../Icons';
import { AddEditStaffModal } from '../../administration/AddEditStaffModal';
import { mockStaff } from '../../../data/mockData';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800/60 p-5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/80 flex items-center gap-4">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-500 dark:text-blue-300">
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        </div>
    </div>
);

const getStatusClass = (status: EmploymentStatus) => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'On Leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'Terminated': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    }
};

const FacultyCard: React.FC<{ member: StaffMember; onEdit: (member: StaffMember) => void; onDelete: (id: string) => void; }> = ({ member, onEdit, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/80 flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                    <UserCircleIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 -mt-2 -ml-2"/>
                     <div className="relative" ref={menuRef}>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                            <EllipsisVerticalIcon className="w-5 h-5" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-10 border dark:border-slate-700 py-1 text-left">
                                <a href="#" onClick={(e) => { e.preventDefault(); onEdit(member); }} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"><PencilIcon className="w-4 h-4" /> Edit Profile</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); onDelete(member.id); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"><TrashIcon className="w-4 h-4" /> Deactivate</a>
                            </div>
                        )}
                    </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-2">{member.fullName}</h3>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{member.role}</p>
                <div className="mt-3 space-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <p>{member.email}</p>
                    <p>{member.phone}</p>
                </div>
            </div>
             <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 rounded-b-xl border-t dark:border-slate-700/80 flex justify-between items-center">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(member.status)}`}>
                    {member.status}
                </span>
                 <span className="text-xs text-slate-400">Joined: {member.joiningDate}</span>
            </div>
        </div>
    );
};


export const FacultyManagementPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<StaffRole | 'All'>('All');
    const [statusFilter, setStatusFilter] = useState<EmploymentStatus | 'All'>('All');

    const openAddModal = () => { setEditingStaff(null); setIsModalOpen(true); };
    const openEditModal = (member: StaffMember) => { setEditingStaff(member); setIsModalOpen(true); };
    const handleDeleteStaff = (id: string) => { if (window.confirm('Are you sure?')) setStaff(p => p.filter(s => s.id !== id)); };
    const handleSaveStaff = (member: StaffMember) => {
        if (editingStaff) setStaff(p => p.map(s => s.id === member.id ? member : s));
        else setStaff(p => [...p, { ...member, id: `st${Date.now()}` }]);
        setIsModalOpen(false);
    };

    const stats = useMemo(() => ({
        total: staff.length,
        teachers: staff.filter(s => s.role === StaffRole.Teacher).length,
        support: staff.filter(s => s.role !== StaffRole.Teacher).length,
    }), [staff]);

    const filteredStaff = useMemo(() => {
        return staff
            .filter(member => roleFilter === 'All' || member.role === roleFilter)
            .filter(member => statusFilter === 'All' || member.status === statusFilter)
            .filter(member => 
                member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                member.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [staff, searchTerm, roleFilter, statusFilter]);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Faculty Members" value={stats.total} icon={<BriefcaseIcon className="w-6 h-6"/>} />
                    <StatCard title="Active Teachers" value={stats.teachers} icon={<BriefcaseIcon className="w-6 h-6"/>} />
                    <StatCard title="Support Staff" value={stats.support} icon={<BriefcaseIcon className="w-6 h-6"/>} />
                </div>
                
                <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-xl dark:border dark:border-slate-700 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="relative w-full md:w-80">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><MagnifyingGlassIcon className="w-5 h-5 text-slate-400" /></div>
                            <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                             <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as StaffRole | 'All')} className="w-full md:w-auto bg-slate-50 border border-slate-300 text-sm rounded-lg p-2.5 dark:bg-slate-700 dark:border-slate-600">
                                <option value="All">All Roles</option>
                                {Object.values(StaffRole).map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                             <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as EmploymentStatus | 'All')} className="w-full md:w-auto bg-slate-50 border border-slate-300 text-sm rounded-lg p-2.5 dark:bg-slate-700 dark:border-slate-600">
                                <option value="All">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Terminated">Terminated</option>
                            </select>
                            <button onClick={openAddModal} className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                                <PlusIcon className="h-5 w-5" />
                                <span>Add</span>
                            </button>
                        </div>
                    </div>

                    {filteredStaff.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStaff.map(member => (
                                <FacultyCard key={member.id} member={member} onEdit={openEditModal} onDelete={handleDeleteStaff} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                            <p className="font-semibold">No Faculty Found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && <AddEditStaffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveStaff} staffMember={editingStaff} />}
        </div>
    );
};