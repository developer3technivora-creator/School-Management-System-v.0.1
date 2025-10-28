import React, { useState, useEffect } from 'react';
import type { School } from '../../types';
import { supabase } from '../../services/supabase';
import { PencilIcon, UserCircleIcon } from '../Icons';

const InfoDisplay: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
    <div>
        <p className="block mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <div className="bg-slate-50 border border-transparent text-slate-800 dark:text-slate-200 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700/50 min-h-[42px] flex items-center">
            {value || <span className="text-slate-400 italic">Not set</span>}
        </div>
    </div>
);

const InputField: React.FC<{ name: keyof School; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean; }> = ({ name, label, value, onChange, disabled = false }) => (
    <div>
        <label htmlFor={name} className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <input type="text" name={name} id={name} value={value || ''} onChange={onChange} disabled={disabled} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed" />
    </div>
);

interface SchoolProfileTabProps {
    schoolProfile: School;
    onProfileUpdate: (school: School) => void;
}

export const SchoolProfileTab: React.FC<SchoolProfileTabProps> = ({ schoolProfile, onProfileUpdate }) => {
    const [school, setSchool] = useState<School>(schoolProfile);
    const [initialSchool, setInitialSchool] = useState<School>(schoolProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    
    useEffect(() => {
        setSchool(schoolProfile);
        setInitialSchool(schoolProfile);
    }, [schoolProfile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSchool(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0]);
        }
    };
    
    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccess(null);
        
        try {
            let logoUrl = school.logo_url;
            if (logoFile) {
                setIsUploading(true);
                const filePath = `${school.id}/${Date.now()}-${logoFile.name}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('school_logos')
                    .upload(filePath, logoFile, { upsert: true });

                if (uploadError) throw new Error(`Logo upload failed: ${uploadError.message}`);

                const { data: { publicUrl } } = supabase.storage
                    .from('school_logos')
                    .getPublicUrl(filePath);
                
                logoUrl = publicUrl;
                setIsUploading(false);
            }

            const { data, error: updateError } = await supabase
                .from('schools')
                .update({
                    name: school.name,
                    email: school.email,
                    phone: school.phone,
                    address: school.address,
                    city: school.city,
                    state: school.state,
                    country: school.country,
                    school_type: school.school_type,
                    board: school.board,
                    principal_name: school.principal_name,
                    logo_url: logoUrl,
                })
                .eq('id', school.id)
                .select()
                .single();

            if (updateError) throw updateError;
            
            onProfileUpdate(data);
            setIsEditing(false);
            setLogoFile(null);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(null), 3000);

        } catch (err: any) {
            setError(`Failed to save profile: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleCancel = () => {
        setSchool(initialSchool);
        setIsEditing(false);
        setLogoFile(null);
        setError(null);
    };

    return (
        <div>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">School Details</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View and manage your school's registered information.</p>
                </div>
                 {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                        <PencilIcon className="h-4 w-4" /> Edit Profile
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 flex flex-col items-center">
                    {school.logo_url ? (
                        <img src={school.logo_url} alt="School Logo" className="w-32 h-32 rounded-full object-cover border-4 border-slate-200 dark:border-slate-600" />
                    ) : (
                        <UserCircleIcon className="w-32 h-32 text-slate-300 dark:text-slate-600" />
                    )}
                    {isEditing && (
                        <div className="mt-4 text-center">
                             <label htmlFor="logo-upload" className="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                {isUploading ? 'Uploading...' : (logoFile ? 'Change Logo' : 'Upload Logo')}
                            </label>
                            <input id="logo-upload" type="file" className="hidden" onChange={handleLogoSelect} accept="image/png, image/jpeg" />
                            {logoFile && <p className="text-xs text-slate-500 mt-1 truncate max-w-[120px]">{logoFile.name}</p>}
                        </div>
                    )}
                </div>

                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditing ? (
                        <>
                           <InputField name="name" label="School Name" value={school.name} onChange={handleInputChange} />
                           <InputField name="code" label="School Code" value={school.code} onChange={handleInputChange} disabled />
                           <InputField name="email" label="Email" value={school.email} onChange={handleInputChange} />
                           <InputField name="phone" label="Contact Number" value={school.phone || ''} onChange={handleInputChange} />
                           <div className="md:col-span-2">
                               <InputField name="address" label="Address" value={school.address || ''} onChange={handleInputChange} />
                           </div>
                           <InputField name="city" label="City" value={school.city || ''} onChange={handleInputChange} />
                           <InputField name="state" label="State" value={school.state || ''} onChange={handleInputChange} />
                           <InputField name="country" label="Country" value={school.country || ''} onChange={handleInputChange} />
                           <InputField name="school_type" label="School Type" value={school.school_type || ''} onChange={handleInputChange} />
                           <InputField name="board" label="Board/Curriculum" value={school.board || ''} onChange={handleInputChange} />
                           <InputField name="principal_name" label="Principal Name" value={school.principal_name || ''} onChange={handleInputChange} />
                        </>
                    ) : (
                        <>
                            <InfoDisplay label="School Name" value={school.name} />
                            <InfoDisplay label="School Code" value={school.code} />
                            <InfoDisplay label="Email" value={school.email} />
                            <InfoDisplay label="Contact Number" value={school.phone} />
                            <div className="md:col-span-2"><InfoDisplay label="Address" value={school.address} /></div>
                            <InfoDisplay label="City" value={school.city} />
                            <InfoDisplay label="State" value={school.state} />
                            <InfoDisplay label="Country" value={school.country} />
                            <InfoDisplay label="School Type" value={school.school_type} />
                            <InfoDisplay label="Board/Curriculum" value={school.board} />
                            <InfoDisplay label="Principal Name" value={school.principal_name} />
                        </>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                    <button onClick={handleCancel} className="px-5 py-2.5 text-sm font-medium text-slate-900 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:bg-green-400">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}
            
            {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
            {success && <p className="mt-4 text-center text-sm text-green-500">{success}</p>}
        </div>
    );
};