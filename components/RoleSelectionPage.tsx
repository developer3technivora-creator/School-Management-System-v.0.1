

import React from 'react';
import type { Role } from '../types';
import { Role as RoleEnum } from '../types';
import { 
    UserGroupIcon, 
    AcademicCapIcon, 
    BriefcaseIcon, 
    BuildingLibraryIcon, 
    TruckIcon, 
    ShoppingCartIcon 
} from './Icons';

const roles = [
    { name: RoleEnum.School, icon: <BuildingLibraryIcon className="h-12 w-12" /> },
    { name: RoleEnum.Parent, icon: <UserGroupIcon className="h-12 w-12" /> },
    { name: RoleEnum.Student, icon: <AcademicCapIcon className="h-12 w-12" /> },
    { name: RoleEnum.Teacher, icon: <BriefcaseIcon className="h-12 w-12" /> },
    { name: RoleEnum.Transport, icon: <TruckIcon className="h-12 w-12" /> },
    { name: RoleEnum.ECommerce, icon: <ShoppingCartIcon className="h-12 w-12" /> },
];

interface RoleSelectionPageProps {
    onSelectRole: (role: Role) => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ onSelectRole }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4 transition-colors duration-300">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Select Your Role</h1>
                <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Choose your profile to proceed. This will tailor your dashboard and experience within the application.</p>
            </div>
            <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {roles.map((role) => (
                    <button
                        key={role.name}
                        onClick={() => onSelectRole(role.name)}
                        className="group relative flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg hover:shadow-2xl dark:hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-300 ease-in-out border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                        <div className="relative z-10 flex flex-col items-center">
                           <div className="text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">
                                {role.icon}
                            </div>
                            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">
                                {role.name}
                            </h3>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};