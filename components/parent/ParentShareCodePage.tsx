import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
        const { data, error } = await supabase.from('shareable_codes').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (error) setError('Could not load existing codes.');
        else setCodes(data || []);
    }, [user.id]);

    const fetchChildren = useCallback(async () => {
        const { data, error } = await supabase.from('child_profile').select('id, full_name').eq('user_id', user.id);
        if (error) setError('Could not load your children\'s profiles.');
        else if (data) {
            const childrenData = data.map(c => ({ id: c.id, fullName: c.full_name }));
            setChildren(childrenData);
            if (childrenData.length > 0) setSelectedChildId(childrenData[0].id);
        }
    }, [user.id]);
    
    const activeCodes = useMemo(() => {
        const now = new Date();
        return codes.filter(c => c.is_active && (!c.expires_at || new Date(c.expires_at) > now));
    }, [codes]);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([fetchChildren(), fetchCodes()]).finally(() => setIsLoading(false));
    }, [fetchChildren, fetchCodes]);

    const handleGenerateCode = async () => {
        if (!selectedChildId) { setError('Please select a child to generate a code for.'); return; }
        const existing = activeCodes.find(c => c.child_id === selectedChildId && c.type === selectedCodeType);
        if (existing && !window.confirm(`An active ${selectedCodeType} code already exists. Generate a new one? The old one will be deactivated.`)) return;

        setIsGenerating(true);
        setError(null);
        setSuccessMessage(null);

        const newCode = `EDU-${new Date().getFullYear()}-${selectedCodeType.slice(0,3).toUpperCase()}-${generateRandomString(5)}`;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);

        try {
            if (existing) await supabase.from('shareable_codes').update({ is_active: false }).eq('id', existing.id);
            const { error: insertError } = await supabase.from('shareable_codes').insert({ code: newCode, type: selectedCodeType, user_id: user.id, child_id: selectedChildId, is_active: true, expires_at: expiresAt.toISOString() });
            if (insertError) throw insertError;
            setSuccessMessage(`Successfully generated ${selectedCodeType} code!`);
            await fetchCodes();
        } catch (err: any) {
            setError(`Failed to generate code: ${err.message}.`);
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-500 rounded-xl">
                        <ShareIcon className="w-8 h-8"/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Shareable Codes</h1>
                        <p className="text-slate-500 dark:text-slate-400">Generate secure codes to share information with the school.</p>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Generate New Code</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">Codes are valid for 24 hours and can be used by the school to access specific information securely.</p>
                
                {isLoading ? <p>Loading...</p> : children.length === 0 ? (
                    <p className="text-center p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg">Please add a child to your profile to generate codes.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label htmlFor="child-select" className="block mb-2 text-sm font-medium">For Child:</label>
                            <select id="child-select" value={selectedChildId} onChange={e => setSelectedChildId(e.target.value)} className="w-full bg-slate-50 border border-slate-300 text-sm rounded-lg p-2.5 dark:bg-slate-700 dark:border-slate-600">
                                {children.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-1">
                             <label className="block mb-2 text-sm font-medium">Code Type:</label>
                            <div className="flex rounded-lg bg-slate-200 dark:bg-slate-700 p-1">
                                <button onClick={() => setSelectedCodeType('enquiry')} className={`w-full py-1.5 text-sm rounded-md ${selectedCodeType === 'enquiry' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''}`}>Enquiry</button>
                                <button onClick={() => setSelectedCodeType('admission')} className={`w-full py-1.5 text-sm rounded-md ${selectedCodeType === 'admission' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''}`}>Admission</button>
                            </div>
                        </div>
                        <button onClick={handleGenerateCode} disabled={isGenerating} className="w-full md:w-auto px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:bg-blue-400 flex items-center justify-center gap-2">
                            {isGenerating ? 'Generating...' : <><PlusIcon className="h-5 w-5" /> Generate</>}
                        </button>
                    </div>
                )}
            </div>
            
            <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Active Codes</h2>
                 <div className="space-y-3">
                    {activeCodes.length > 0 ? activeCodes.map(code => {
                        const child = children.find(c => c.id === code.child_id);
                        return (
                            <div key={code.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <div>
                                    <p className="font-mono text-xl font-bold text-slate-800 dark:text-slate-100 tracking-wider">{code.code}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        <span className={`capitalize font-semibold ${code.type === 'admission' ? 'text-blue-500' : 'text-green-500'}`}>{code.type}</span> for {child?.fullName || 'N/A'} | Expires: {new Date(code.expires_at!).toLocaleString()}
                                    </p>
                                </div>
                                <button onClick={() => copyToClipboard(code.code)} className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    {copiedCode === code.code ? <CheckBadgeIcon className="h-6 w-6 text-green-500" /> : <ClipboardDocumentIcon className="h-6 w-6 text-slate-500" />}
                                </button>
                            </div>
                        )
                    }) : (
                        <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/60 rounded-xl border border-dashed">
                           <p className="font-semibold">No Active Codes</p>
                           <p>Generate a new code to share with the school.</p>
                        </div>
                    )}
                </div>
            </div>
            {(error || successMessage) && (
                <div className="text-center text-sm font-medium">
                    {error && <p className="text-red-500">{error}</p>}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}
                </div>
            )}
        </div>
    );
};
