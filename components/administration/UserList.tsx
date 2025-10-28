import React from 'react';
import type { AuthUser } from '../../types';
import { MagnifyingGlassIcon, EnvelopeIcon, GoogleIcon } from '../Icons';

interface UserListProps {
    users: AuthUser[];
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
}

const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const UserList: React.FC<UserListProps> = ({ users, searchTerm, onSearchTermChange }) => {

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Users</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">A list of all the users in your project including their name, email and role.</p>
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div className="relative w-full md:w-80">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search by email, phone, or UID"
                        value={searchTerm}
                        onChange={(e) => onSearchTermChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        Refresh
                    </button>
                    <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors">
                        Add user
                    </button>
                </div>
            </div>

            <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">UID</th>
                            <th scope="col" className="px-6 py-3 font-medium">Display Name</th>
                            <th scope="col" className="px-6 py-3 font-medium">Email</th>
                            <th scope="col" className="px-6 py-3 font-medium">Providers</th>
                            <th scope="col" className="px-6 py-3 font-medium">Created at</th>
                            <th scope="col" className="px-6 py-3 font-medium">Last sign in at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/20">
                                <td className="px-6 py-4 font-mono text-xs truncate" title={user.id}>{user.id.substring(0, 18)}...</td>
                                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">{user.displayName}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {user.provider === 'email' && <EnvelopeIcon className="w-5 h-5 text-slate-500" title="Email/Password"/>}
                                        {user.provider === 'google' && <GoogleIcon className="w-5 h-5" title="Google OAuth"/>}
                                        <span className="capitalize">{user.provider}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{formatDate(user.createdAt)}</td>
                                <td className="px-6 py-4">{formatDate(user.lastSignInAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {users.length === 0 && (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <p>No users found for your search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
};