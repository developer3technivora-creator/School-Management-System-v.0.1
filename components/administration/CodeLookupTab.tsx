import React, { useState } from 'react';
import { supabase } from '../../services/supabase';
import type { CodeLookupResult, School } from '../../types';
import { MagnifyingGlassIcon, UserCircleIcon, AcademicCapIcon, ShareIcon, CheckBadgeIcon } from '../Icons';

const InfoDisplay: React.FC<{ label: string; value: string | number | undefined | null; }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-semibold text-slate-800 dark:text-slate-100">{value || 'N/A'}</p>
    </div>
);

interface CodeLookupTabProps {
    school: School;
}

export const CodeLookupTab: React.FC<CodeLookupTabProps> = ({ school }) => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CodeLookupResult | null>(null);

    const [isAdmitting, setIsAdmitting] = useState(false);
    const [admissionSuccess, setAdmissionSuccess] = useState<string | null>(null);

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);
        setAdmissionSuccess(null);

        try {
            const { data: codeData, error: codeError } = await supabase
                .from('shareable_codes')
                .select('*')
                .eq('code', code.trim().toUpperCase())
                .eq('is_active', true)
                .single();

            if (codeError || !codeData) {
                throw new Error('Code not found, is inactive, or has expired.');
            }
            
            // Check if student is already admitted to THIS school
            const { data: existingAdmission } = await supabase
                .from('school_students')
                .select('id')
                .eq('school_id', school.id)
                .eq('student_id', codeData.child_id)
                .single();

            if (existingAdmission) {
                throw new Error('This student has already been admitted to your school.');
            }

            const { data: parentData, error: parentError } = await supabase
                .from('guardian_profile')
                .select('*')
                .eq('user_id', codeData.user_id)
                .eq('is_primary', true)
                .single();

            if (parentError || !parentData) {
                throw new Error('Could not find associated parent profile.');
            }
            
            const { data: childData, error: childError } = await supabase
                .from('child_profile')
                .select('*')
                .eq('id', codeData.child_id)
                .single();

            if (childError || !childData) {
                throw new Error('Could not find associated child profile.');
            }

            setResult({
                parent: {
                    full_name: parentData.full_name,
                    email: parentData.email,
                    phone: parentData.phone,
                    address: parentData.address,
                    relation: parentData.relation,
                },
                child: {
                    full_name: childData.full_name,
                    grade: childData.grade,
                    age: childData.age,
                    gender: childData.gender,
                    hobbies: childData.hobbies,
                    documents: childData.documents || [],
                },
                code: codeData,
            });

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdmitStudent = async () => {
        if (!result) return;

        setIsAdmitting(true);
        setError(null);

        try {
            // Generate a school-specific unique ID
            const { count, error: countError } = await supabase
                .from('school_students')
                .select('id', { count: 'exact', head: true })
                .eq('school_id', school.id)
                .like('student_unique_id', `${school.code}-${new Date().getFullYear()}-%`);

            if (countError) throw countError;

            const nextId = (count || 0) + 1;
            const uniqueId = `${school.code}-${new Date().getFullYear()}-${String(nextId).padStart(4, '0')}`;
            
            // Insert into the school_students link table
            const { error: insertError } = await supabase.from('school_students').insert({
                school_id: school.id,
                student_id: result.code.child_id, // This is the child_profile.id
                parent_user_id: result.code.user_id,
                student_unique_id: uniqueId,
                added_date: new Date().toISOString(),
                source_code: result.code.code
            });

            if (insertError) throw insertError;
            
            // Deactivate the admission code
            const { error: updateError } = await supabase.from('shareable_codes').update({ is_active: false }).eq('id', result.code.id);
            if (updateError) console.error("Failed to deactivate code, but student was admitted:", updateError);

            setAdmissionSuccess(`Student admitted successfully! The new Student ID is: ${uniqueId}`);
            setResult(null);
            
        } catch (err: any) {
             setError(`Admission Failed: ${err.message}. Please try again.`);
        } finally {
            setIsAdmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Lookup Shareable Code</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">Enter a code provided by a parent to retrieve their enquiry or admission details.</p>
        
            {!admissionSuccess && (
                <form onSubmit={handleLookup} className="flex items-center gap-2 max-w-lg mb-8">
                    <input 
                        type="text"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        placeholder="Enter code, e.g., EDU-2024-ENQ-ABC12"
                        className="flex-grow bg-slate-50 border border-slate-300 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600"
                    />
                    <button type="submit" disabled={isLoading} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:bg-blue-400 flex items-center gap-2">
                        {isLoading ? 'Searching...' : <><MagnifyingGlassIcon className="h-5 w-5" /> Lookup</>}
                    </button>
                </form>
            )}

            {error && (
                <div className="max-w-lg p-4 text-center bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/50 rounded-lg">
                    {error}
                </div>
            )}
            
            {admissionSuccess && (
                 <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-500/50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <CheckBadgeIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                        <div>
                            <h3 className="text-lg font-bold text-green-800 dark:text-green-200">Admission Complete!</h3>
                            <p className="text-green-700 dark:text-green-300">{admissionSuccess}</p>
                        </div>
                    </div>
                </div>
            )}

            {result && (
                <div className="space-y-6 mt-6">
                    <div className={`p-4 rounded-lg ${result.code.type === 'admission' ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/50' : 'bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600'}`}>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                            {result.code.type === 'admission' ? 'Full Admission Profile' : 'Read-only Enquiry View'}
                        </h3>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <InfoDisplay label="Code" value={result.code.code} />
                            <InfoDisplay label="Type" value={result.code.type.charAt(0).toUpperCase() + result.code.type.slice(1)} />
                            <InfoDisplay label="Generated On" value={new Date(result.code.created_at).toLocaleDateString()} />
                        </div>
                    </div>
                    
                    <div className="p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                         <h3 className="flex items-center gap-3 font-bold text-xl text-slate-800 dark:text-slate-200 mb-4">
                            <UserCircleIcon className="w-6 h-6 text-blue-500" />
                            Parent/Guardian Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InfoDisplay label="Full Name" value={result.parent.full_name} />
                            <InfoDisplay label="Email" value={result.parent.email} />
                            <InfoDisplay label="Phone" value={result.parent.phone} />
                            {result.code.type === 'admission' && <InfoDisplay label="Address" value={result.parent.address} />}
                        </div>
                    </div>

                     <div className="p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                         <h3 className="flex items-center gap-3 font-bold text-xl text-slate-800 dark:text-slate-200 mb-4">
                            <AcademicCapIcon className="w-6 h-6 text-blue-500" />
                            Child Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InfoDisplay label="Full Name" value={result.child.full_name} />
                            <InfoDisplay label="Grade" value={result.child.grade} />
                            <InfoDisplay label="Age" value={result.child.age} />
                             {result.code.type === 'admission' && (
                                <>
                                    <InfoDisplay label="Gender" value={result.child.gender} />
                                    <div className="md:col-span-2"><InfoDisplay label="Hobbies/Interests" value={result.child.hobbies} /></div>
                                    <div className="md:col-span-3">
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Uploaded Documents</p>
                                        <ul className="mt-1 list-disc list-inside">
                                            {result.child.documents.map((doc, i) => (
                                                <li key={i}><a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{doc.type} ({doc.name})</a></li>
                                            ))}
                                            {result.child.documents.length === 0 && <span className="text-sm text-slate-400">No documents uploaded.</span>}
                                        </ul>
                                    </div>
                                </>
                             )}
                        </div>
                    </div>

                    {result.code.type === 'admission' && !admissionSuccess && (
                        <div className="mt-6 text-right">
                            <button onClick={handleAdmitStudent} disabled={isAdmitting} className="px-6 py-3 font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-lg disabled:bg-green-400 flex items-center justify-center gap-2 ml-auto">
                                {isAdmitting ? 'Processing Admission...' : 'Admit Student to School'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};