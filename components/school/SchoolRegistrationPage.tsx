import React, { useState } from 'react';
import type { User } from '../../types';
import { supabase } from '../../services/supabase';
import { BuildingLibraryIcon } from '../Icons';

interface SchoolRegistrationPageProps {
    user: User;
    onRegistrationSuccess: () => void;
}

const generateSchoolCode = (schoolName: string): string => {
    const namePart = schoolName.trim().toUpperCase().replace(/[^A-Z]/g, '').substring(0, 4).padEnd(4, 'X');
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${namePart}-${randomPart}`;
};

export const SchoolRegistrationPage: React.FC<SchoolRegistrationPageProps> = ({ user, onRegistrationSuccess }) => {
    const [schoolName, setSchoolName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!schoolName.trim()) {
            setError('School Name is required.');
            return;
        }

        setIsSaving(true);
        const schoolCode = generateSchoolCode(schoolName);

        try {
            const { error: insertError } = await supabase.from('schools').insert({
                user_id: user.id,
                name: schoolName,
                code: schoolCode,
                admin_username: user.user_metadata?.fullName || user.email,
                email: user.email,
                phone: phone || null,
                address: address || null,
                is_active: true,
            });

            if (insertError) throw insertError;

            onRegistrationSuccess();

        } catch (err: any) {
            setError(`Registration failed: ${err.message}`);
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-950 p-4">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-lg dark:bg-slate-800/60 dark:border dark:border-slate-700">
                <div className="text-center">
                    <BuildingLibraryIcon className="mx-auto h-12 w-12 text-blue-500" />
                    <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
                        Register Your School
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Complete your school's profile to get started. This profile is linked to your account.
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <InputField id="schoolName" type="text" label="School Name" value={schoolName} onChange={e => setSchoolName(e.target.value)} required />
                    <InputField id="email" type="email" label="Administrator Email" value={user.email || ''} onChange={() => {}} disabled />
                    <InputField id="phone" type="tel" label="School Contact Number (Optional)" value={phone} onChange={e => setPhone(e.target.value)} required={false} />
                    <InputField id="address" type="text" label="School Address (Optional)" value={address} onChange={e => setAddress(e.target.value)} required={false} />
                    
                    {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}

                    <div>
                        <button type="submit" disabled={isSaving} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-all duration-300">
                            {isSaving ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InputField: React.FC<{ id: string, type: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean, disabled?: boolean }> = ({ id, type, label, value, onChange, required = true, disabled = false }) => (
    <div className="relative">
        <input 
            type={type} 
            id={id} 
            name={id}
            value={value} 
            onChange={onChange} 
            className="peer bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg block w-full p-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed" 
            required={required} 
            placeholder={label}
            disabled={disabled}
        />
        <label 
            htmlFor={id} 
            className="absolute left-3 -top-2.5 text-slate-500 dark:text-slate-400 text-xs bg-white dark:bg-slate-800/60 px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-blue-500 peer-focus:text-xs peer-focus:dark:bg-slate-800/60"
        >
            {label}
        </label>
    </div>
);
