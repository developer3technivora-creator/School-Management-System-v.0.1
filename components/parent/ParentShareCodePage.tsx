import React, { useState, useEffect, useCallback } from 'react';
import type { User, ChildForCodeSelection, ShareableCode, ShareCodeType } from '../../types';
import { supabase } from '../../services/supabase';
import { ArrowUturnLeftIcon, ShareIcon, PlusIcon, ClipboardDocumentIcon, CheckBadgeIcon } from '../Icons';

const generateRandomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const ParentShareCodePage: React.FC<{ user: User; onBackToDashboard: () => void; }> = ({ user, onBackToDashboard }) => {
    const [children, setChildren] = useState<ChildForCodeSelection[]>([]);
    const [codes, setCodes] = useState<ShareableCode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [selectedChildId, setSelectedChildId] = useState<string>('');
    const [selectedCodeType, setSelectedCodeType] = useState<ShareCodeType>('enquiry');
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const fetchCodes = useCallback(async () => {
        const { data, error } = await supabase
            .from('shareable_codes')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching codes:', error.message);
            setError('Could not load existing codes.');
        } else {
            setCodes(data || []);
        }
    }, [user.id]);

    const fetchChildren = useCallback(async () => {
        const { data, error } = await supabase
            .from('child_profile')
            .select('id, full_name')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching children:', error);
            setError('Could not load your children\'s profiles.');
        } else if (data) {
            const childrenData = data.map(c => ({ id: c.id, fullName: c.full_name }));
            setChildren(childrenData);
            if (childrenData.length > 0) {
                setSelectedChildId(childrenData[0].id);
            }
        }
    }, [user.id]);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([fetchChildren(), fetchCodes()]).finally(() => setIsLoading(false));
    }, [fetchChildren, fetchCodes]);

    const handleGenerateCode = async () => {
        if (!selectedChildId) {
            setError('Please select a child to generate a code for.');
            return;
        }

        // Check if a code of this type already exists for the child
        const existingCode = codes.find(c => c.child_id === selectedChildId && c.type === selectedCodeType);
        if (existingCode) {
             if (!window.confirm(`A ${selectedCodeType} code already exists for this child. Do you want to generate a new one? The old one will be deactivated.`)) {
                return;
            }
        }

        setIsGenerating(true);
        setError(null);
        setSuccessMessage(null);

        const year = new Date().getFullYear();
        const typeShort = selectedCodeType === 'enquiry' ? 'ENQ' : 'ADM';
        const randomPart = generateRandomString(5);
        const newCode = `EDU-${year}-${typeShort}-${randomPart}`;

        try {
            // Deactivate old codes of the same type for the same child
            if (existingCode) {
                await supabase.from('shareable_codes').update({ is_active: false }).eq('id', existingCode.id);
            }

            // Insert new code
            const { error: insertError } = await supabase
                .from('shareable_codes')
                .insert({
                    code: newCode,
                    type: selectedCodeType,
                    user_id: user.id,
                    child_id: selectedChildId,
                    is_active: true,
                });

            if (insertError) throw insertError;

            setSuccessMessage(`Successfully generated ${selectedCodeType} code!`);
            await fetchCodes();

        } catch (err: any) {
            console.error("Error generating code:", err.message);
            setError(`Failed to generate code: ${err.message}. Please try again.`);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedCode(text);
            setTimeout(() => setCopiedCode(null), 2000);
        });
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <ShareIcon className="w-10 h-10 text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Shareable Codes</h1>
                            <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">Generate secure codes to share with the school.</p>
                        </div>
                    </div>
                    <button onClick={onBackToDashboard} className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg">
                        <ArrowUturnLeftIcon className="h-5 w-5" /><span>Dashboard</span>
                    </button>
                </div>

                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Generate Code Section */}
                        <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Generate New Code</h2>
                            {children.length === 0 ? (
                                <p className="text-slate-500 dark:text-slate-400">Please add a child to your profile before generating a code.</p>
                            ) : (
                                <>
                                    <div>
                                        <label htmlFor="child-select" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">For Child:</label>
                                        <select id="child-select" value={selectedChildId} onChange={e => setSelectedChildId(e.target.value)} className="bg-slate-50 border border-slate-300 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600">
                                            {children.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                                        </select>
                                    </div>
                                     <div>
                                        <label className="block mb-2 text-sm font-medium">Code Type:</label>
                                        <div className="flex gap-2">
                                            {(['enquiry', 'admission'] as ShareCodeType[]).map(type => (
                                                <button key={type} onClick={() => setSelectedCodeType(type)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${selectedCodeType === type ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={handleGenerateCode} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:bg-blue-400">
                                        {isGenerating ? 'Generating...' : <><PlusIcon className="h-5 w-5" /> Generate Code</>}
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Existing Codes Section */}
                        <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl p-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Your Active Codes</h2>
                            <div className="space-y-3">
                                {codes.filter(c => c.is_active).length > 0 ? codes.filter(c => c.is_active).map(code => {
                                    const child = children.find(c => c.id === code.child_id);
                                    return (
                                        <div key={code.id} className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg flex justify-between items-center">
                                            <div>
                                                <p className="font-mono text-lg font-bold text-slate-800 dark:text-slate-100">{code.code}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{(code.type.charAt(0).toUpperCase() + code.type.slice(1))} for {child?.fullName || 'Unknown Child'}</p>
                                            </div>
                                            <button onClick={() => copyToClipboard(code.code)} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                                {copiedCode === code.code ? <CheckBadgeIcon className="h-5 w-5 text-green-500" /> : <ClipboardDocumentIcon className="h-5 w-5 text-slate-500" />}
                                            </button>
                                        </div>
                                    )
                                }) : <p className="text-slate-500 dark:text-slate-400 text-sm">You have no active codes.</p>}
                            </div>
                        </div>

                        {(error || successMessage) && (
                            <div className="md:col-span-2 text-center text-sm font-medium">
                                {error && <p className="text-red-500">{error}</p>}
                                {successMessage && <p className="text-green-500">{successMessage}</p>}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};