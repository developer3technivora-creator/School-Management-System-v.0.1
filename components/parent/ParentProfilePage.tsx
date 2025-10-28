import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { User, GuardianProfile, ChildProfile, ChildDocument, Student } from '../../types';
import { GuardianRelation } from '../../types';
import { supabase } from '../../services/supabase';
import { ArrowLeftOnRectangleIcon, UserGroupIcon, ChevronDownIcon, PlusIcon, TrashIcon, ArrowUpTrayIcon, PaperClipIcon, CheckBadgeIcon, XCircleIcon, AcademicCapIcon, ArrowUturnLeftIcon, PencilIcon, ArrowRightIcon } from '../Icons';

interface ParentProfilePageProps {
    user: User;
    onLogout: () => void;
    onBackToRoles: () => void;
    onBackToDashboard: () => void;
    onViewStudentPortal: (student: Student) => void;
}

const Accordion: React.FC<{ title: string; children: React.ReactNode, icon: React.ReactNode }> = ({ title, children, icon }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-t-lg"
            >
                <div className="flex items-center gap-3">
                    <span className="text-blue-500">{icon}</span>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{title}</h3>
                </div>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="p-4 bg-white dark:bg-slate-800/60 rounded-b-lg">{children}</div>}
        </div>
    );
};

const FileUpload: React.FC<{ document: ChildDocument, onFileSelect: (file: File) => void, onRemove: () => void }> = ({ document, onFileSelect, onRemove }) => {
    const isUploading = document.uploadProgress !== undefined && document.uploadProgress >= 0 && document.uploadProgress < 100;
    const isSuccess = document.url !== undefined;
    const isError = document.error !== undefined;
    
    return (
        <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    <PaperClipIcon className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold">{document.type}</span>
                    {document.name && <span className="text-slate-500 text-xs">({document.name})</span>}
                </div>
                <div className="flex items-center gap-2">
                    {!isSuccess && (
                        <label className="cursor-pointer p-1.5 text-blue-600 dark:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md">
                            <ArrowUpTrayIcon className="w-5 h-5" />
                            <input type="file" className="hidden" onChange={e => e.target.files && onFileSelect(e.target.files[0])} />
                        </label>
                    )}
                     <button type="button" onClick={onRemove} className="p-1.5 text-red-500 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            {isUploading && (
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${document.uploadProgress}%` }}></div>
                </div>
            )}
            {isSuccess && (
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs mt-1">
                    <CheckBadgeIcon className="w-4 h-4" />
                    <span>Upload successful!</span>
                </div>
            )}
            {isError && (
                 <div className="flex items-center gap-1 text-red-500 dark:text-red-400 text-xs mt-1">
                    <XCircleIcon className="w-4 h-4" />
                    <span>{document.error}</span>
                </div>
            )}
        </div>
    )
}

const FileDisplay: React.FC<{ document: ChildDocument }> = ({ document }) => (
    <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
                <PaperClipIcon className="w-4 h-4 text-slate-500" />
                <span className="font-semibold">{document.type}</span>
            </div>
            {document.url ? (
                <a href={document.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1">
                    <CheckBadgeIcon className="w-4 h-4 text-green-500"/>
                    View Document
                </a>
            ) : (
                <span className="text-slate-500 text-xs">Not Uploaded</span>
            )}
        </div>
    </div>
);

export const ParentProfilePage: React.FC<ParentProfilePageProps> = ({ user, onLogout, onBackToRoles, onBackToDashboard, onViewStudentPortal }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Editing state
    const [isEditing, setIsEditing] = useState(false);

    const emptyGuardianState = (isPrimary: boolean): GuardianProfile => ({
        id: '',
        userId: user.id,
        isPrimary,
        relation: '',
        fullName: isPrimary ? user.user_metadata?.fullName || '' : '',
        email: isPrimary ? user.email : '',
        phone: isPrimary ? user.user_metadata?.mobile || '' : '',
        address: isPrimary ? user.user_metadata?.address || '' : ''
    });

    // Working state
    const [primaryGuardian, setPrimaryGuardian] = useState<GuardianProfile>(emptyGuardianState(true));
    const [showSecondary, setShowSecondary] = useState(false);
    const [secondaryGuardian, setSecondaryGuardian] = useState<GuardianProfile>(emptyGuardianState(false));
    const [children, setChildren] = useState<ChildProfile[]>([]);

    // State for cancellation
    const [initialPrimaryGuardian, setInitialPrimaryGuardian] = useState<GuardianProfile>(emptyGuardianState(true));
    const [initialShowSecondary, setInitialShowSecondary] = useState(false);
    const [initialSecondaryGuardian, setInitialSecondaryGuardian] = useState<GuardianProfile>(emptyGuardianState(false));
    const [initialChildren, setInitialChildren] = useState<ChildProfile[]>([]);

    const handleViewPortal = (child: ChildProfile) => {
        const studentToView: Student = {
            id: child.id,
            student_id: child.admissionStatus?.studentId || 'N/A',
            full_name: child.fullName,
            date_of_birth: child.age ? new Date(new Date().setFullYear(new Date().getFullYear() - Number(child.age))).toISOString().split('T')[0] : 'N/A',
            grade: child.grade,
            enrollment_status: child.admissionStatus ? 'Enrolled' : 'Pending',
            gender: child.gender,
            address: primaryGuardian.address,
            parent_guardian_name: primaryGuardian.fullName,
            parent_guardian_phone: primaryGuardian.phone,
            parent_guardian_email: primaryGuardian.email || '',
            emergency_contact_name: showSecondary && secondaryGuardian.fullName ? secondaryGuardian.fullName : primaryGuardian.fullName,
            emergency_contact_phone: showSecondary && secondaryGuardian.phone ? secondaryGuardian.phone : primaryGuardian.phone,
            photo_url: undefined,
            admissionStatus: child.admissionStatus,
        };
        onViewStudentPortal(studentToView);
    };

    const validate = useCallback(() => {
        const newErrors: Record<string, string> = {};
    
        // Primary Guardian Validation
        if (!primaryGuardian.relation) {
            newErrors['primaryGuardian.relation'] = 'Relation is required.';
        }
    
        // Secondary Guardian Validation (if shown and has a name)
        if (showSecondary && secondaryGuardian.fullName.trim() && !secondaryGuardian.relation) {
            newErrors['secondaryGuardian.relation'] = 'Relation is required if name is provided.';
        }
    
        // Children Validation
        children.forEach((child, index) => {
            if (!child.fullName.trim()) {
                newErrors[`child.${index}.fullName`] = 'Full Name is required.';
            }
            if (child.age === '' || Number(child.age) <= 0) {
                newErrors[`child.${index}.age`] = 'A valid age is required.';
            }
            if (!child.gender) {
                newErrors[`child.${index}.gender`] = 'Gender is required.';
            }
            if (!child.grade.trim()) {
                newErrors[`child.${index}.grade`] = 'Grade is required.';
            }
        });
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [primaryGuardian.relation, secondaryGuardian.fullName, secondaryGuardian.relation, showSecondary, children]);

    useEffect(() => {
        if (isEditing) {
            validate();
        } else {
            setErrors({});
        }
    }, [validate, isEditing]);

    const handleCancel = () => {
        setPrimaryGuardian(initialPrimaryGuardian);
        setSecondaryGuardian(initialSecondaryGuardian);
        setChildren(initialChildren);
        setShowSecondary(initialShowSecondary);
        setIsEditing(false);
        setIsDirty(false);
        setErrors({});
        setSaveMessage(null);
    };

    const fetchProfileData = useCallback(async () => {
        setIsLoading(true);
        setSaveMessage(null);

        try {
            const { data: guardians, error: guardiansError } = await supabase
                .from('guardian_profile')
                .select('*')
                .eq('user_id', user.id);

            if (guardiansError) throw guardiansError;

            const primary = guardians.find(g => g.is_primary);
            const secondary = guardians.find(g => !g.is_primary);

            const pgData = {
                ...emptyGuardianState(true),
                ...(primary && {
                    id: primary.id,
                    relation: primary.relation || '',
                    fullName: primary.full_name || primaryGuardian.fullName,
                    email: primary.email || primaryGuardian.email,
                    phone: primary.phone || primaryGuardian.phone,
                    address: primary.address || primaryGuardian.address,
                })
            };
            setPrimaryGuardian(pgData);
            setInitialPrimaryGuardian(pgData);

            if (secondary) {
                const sgData = {
                    ...emptyGuardianState(false),
                    id: secondary.id,
                    relation: secondary.relation || '',
                    fullName: secondary.full_name || '',
                    email: secondary.email || '',
                    phone: secondary.phone || '',
                    address: secondary.address || '',
                };
                setShowSecondary(true);
                setInitialShowSecondary(true);
                setSecondaryGuardian(sgData);
                setInitialSecondaryGuardian(sgData);
            } else {
                 setShowSecondary(false);
                 setInitialShowSecondary(false);
                 setSecondaryGuardian(emptyGuardianState(false));
                 setInitialSecondaryGuardian(emptyGuardianState(false));
            }

            const { data: childrenData, error: childrenError } = await supabase
                .from('child_profile')
                .select('*')
                .eq('user_id', user.id);

            if (childrenError) throw childrenError;

            const admissionPromises = (childrenData || []).map(async (child) => {
                const { data: admissionData, error: admissionError } = await supabase
                    .from('school_students')
                    .select('school_id, student_unique_id, added_date')
                    .eq('student_id', child.id)
                    .maybeSingle();

                if (admissionError) {
                    console.error(`Error fetching admission status for child ${child.id}:`, admissionError);
                    return { ...child, admissionStatus: null };
                }

                if (admissionData) {
                    const { data: schoolData, error: schoolError } = await supabase
                        .from('schools')
                        .select('name')
                        .eq('id', admissionData.school_id)
                        .single();

                    if (schoolError) {
                        console.error(`Error fetching school name for school ${admissionData.school_id}:`, schoolError);
                        return { ...child, admissionStatus: null };
                    }

                    return {
                        ...child,
                        admissionStatus: {
                            schoolName: schoolData.name,
                            studentId: admissionData.student_unique_id,
                            admissionDate: admissionData.added_date,
                        }
                    };
                }
                
                return { ...child, admissionStatus: null };
            });

            const childrenWithStatus = await Promise.all(admissionPromises);

            const childrenProfiles = childrenWithStatus.map(child => ({
                id: child.id,
                guardianId: child.user_id,
                fullName: child.full_name || '',
                gender: child.gender || '',
                age: child.age === null ? '' : child.age,
                grade: child.grade || '',
                hobbies: child.hobbies || '',
                documents: (child.documents || []).map((doc: any, index: number) => ({
                    id: `${child.id}-doc-${index}`,
                    type: doc.type,
                    name: doc.name || '',
                    url: doc.url,
                    file: new File([], ''),
                })),
                admissionStatus: child.admissionStatus,
            }));

            setChildren(childrenProfiles);
            setInitialChildren(childrenProfiles);

        } catch (error: any) {
            console.error('Error fetching profile:', error);
            setSaveMessage({ type: 'error', text: `Failed to load profile: ${error.message}` });
        } finally {
            setIsLoading(false);
            setIsDirty(false);
            setIsEditing(false);
        }
    }, [user.id, user.email, user.user_metadata]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    // Effect for handling unsaved changes warning
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDirty) {
                event.preventDefault();
                event.returnValue = ''; // Required for Chrome
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty]);

    const confirmAndNavigate = (action: () => void) => {
        if (isDirty) {
            if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                action();
            }
        } else {
            action();
        }
    };

    const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setIsDirty(true);
        setPrimaryGuardian(prev => ({...prev, [e.target.name]: e.target.value }));
    }
    
    const handleSecondaryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setIsDirty(true);
        setSecondaryGuardian(prev => ({...prev, [e.target.name]: e.target.value }));
    }

    const handleChildChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setIsDirty(true);
        const newChildren = [...children];
        const { name, value } = e.target;
        (newChildren[index] as any)[name] = value;
        setChildren(newChildren);
    }
    
    const addChild = () => {
        setIsDirty(true);
        setChildren([...children, {
            id: `c${Date.now()}`,
            guardianId: user.id,
            fullName: '',
            gender: '',
            age: '',
            grade: '',
            hobbies: '',
            documents: [
                { id: `d${Date.now()}-1`, type: 'Birth Certificate', name: '', file: new File([], '') },
                { id: `d${Date.now()}-2`, type: 'ID Proof', name: '', file: new File([], '') },
                { id: `d${Date.now()}-3`, type: 'Previous Report Card', name: '', file: new File([], '') },
            ]
        }]);
    };
    
    const removeChild = (index: number) => {
        setIsDirty(true);
        setChildren(children.filter((_, i) => i !== index));
    }

    const handleFileSelect = useCallback((childIndex: number, docIndex: number, file: File) => {
        setIsDirty(true);
        const newChildren = [...children];
        const child = newChildren[childIndex];
        const doc = child.documents[docIndex];
        doc.file = file;
        doc.name = file.name;
        doc.uploadProgress = 0;
        doc.error = undefined;
        doc.url = undefined;
        setChildren(newChildren);

        const filePath = `documents/${user.id}/${child.id}/${doc.type.replace(/\s/g, '_')}-${file.name}`;

        const uploadTask = supabase.storage
            .from('documents')
            .upload(filePath, file, { cacheControl: '3600', upsert: true });
        
        const progressInterval = setInterval(() => {
            setChildren(prev => {
                const updated = [...prev];
                const currentProgress = updated[childIndex]?.documents[docIndex]?.uploadProgress ?? 0;
                if (currentProgress < 95) {
                    updated[childIndex].documents[docIndex].uploadProgress = currentProgress + 5;
                }
                return updated;
            });
        }, 200);

        uploadTask.then(result => {
            clearInterval(progressInterval);
            if (result.error) throw result.error;
            
            const { data } = supabase.storage.from('documents').getPublicUrl(result.data.path);
            
            setChildren(prev => {
                const updated = [...prev];
                const targetDoc = updated[childIndex]?.documents[docIndex];
                if (targetDoc) {
                    targetDoc.url = data.publicUrl;
                    targetDoc.uploadProgress = 100;
                }
                return updated;
            });
        }).catch(error => {
            clearInterval(progressInterval);
            setChildren(prev => {
                const updated = [...prev];
                 const targetDoc = updated[childIndex]?.documents[docIndex];
                if (targetDoc) {
                    targetDoc.error = error.message;
                    targetDoc.uploadProgress = undefined;
                }
                return updated;
            });
        });
    }, [children, user.id]);

    const removeDocument = (childIndex: number, docIndex: number) => {
        setIsDirty(true);
        const newChildren = [...children];
        const doc = newChildren[childIndex].documents[docIndex];
        doc.file = new File([], '');
        doc.name = '';
        doc.uploadProgress = undefined;
        doc.url = undefined;
        doc.error = undefined;
        setChildren(newChildren);
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        if (!validate()) {
            setSaveMessage({ type: 'error', text: 'Please fix the errors before saving.' });
            setIsSaving(false);
            return;
        }

        try {
            // Upsert Guardians, then refetch all data to get the latest state from DB
            await supabase.from('guardian_profile').upsert({
                ...(primaryGuardian.id && { id: primaryGuardian.id }),
                user_id: user.id,
                is_primary: true,
                relation: primaryGuardian.relation,
                full_name: primaryGuardian.fullName,
                email: primaryGuardian.email,
                phone: primaryGuardian.phone,
                address: primaryGuardian.address,
            }, { onConflict: 'user_id, is_primary' }).select().single().throwOnError();

            if (showSecondary && secondaryGuardian.fullName) {
                 await supabase.from('guardian_profile').upsert({
                    ...(secondaryGuardian.id && { id: secondaryGuardian.id }),
                    user_id: user.id,
                    is_primary: false,
                    relation: secondaryGuardian.relation,
                    full_name: secondaryGuardian.fullName,
                    email: secondaryGuardian.email,
                    phone: secondaryGuardian.phone,
                    address: secondaryGuardian.address,
                }, { onConflict: 'user_id, is_primary' }).select().single().throwOnError();
            } else if (!showSecondary && initialShowSecondary && initialSecondaryGuardian.id) {
                // If checkbox was unchecked and there was a secondary guardian, delete it
                await supabase.from('guardian_profile').delete().eq('id', initialSecondaryGuardian.id);
            }

            const { data: existingDbChildren } = await supabase.from('child_profile').select('id').eq('user_id', user.id);
            const existingDbIds = existingDbChildren?.map(c => c.id) || [];
            const currentUiIds = children.map(c => c.id).filter(id => !id.startsWith('c'));
            const deletedIds = existingDbIds.filter(id => !currentUiIds.includes(id));

            if (deletedIds.length > 0) await supabase.from('child_profile').delete().in('id', deletedIds);

            // Separate new children (client-side ID) from existing children (DB ID)
            const newChildren = children.filter(c => c.id.startsWith('c'));
            const existingChildrenToUpdate = children.filter(c => !c.id.startsWith('c'));

            // Insert new children, letting the database generate the ID
            if (newChildren.length > 0) {
                const childrenToInsert = newChildren.map(child => ({
                    user_id: user.id,
                    full_name: child.fullName,
                    gender: child.gender || null,
                    age: child.age === '' ? null : Number(child.age),
                    grade: child.grade || null,
                    hobbies: child.hobbies || null,
                    documents: child.documents.map(doc => ({ type: doc.type, name: doc.name, url: doc.url })).filter(doc => doc.url),
                }));
                await supabase.from('child_profile').insert(childrenToInsert).throwOnError();
            }

            // Upsert existing children, providing their ID for matching
            if (existingChildrenToUpdate.length > 0) {
                const childrenToUpdate = existingChildrenToUpdate.map(child => ({
                    id: child.id,
                    user_id: user.id,
                    full_name: child.fullName,
                    gender: child.gender || null,
                    age: child.age === '' ? null : Number(child.age),
                    grade: child.grade || null,
                    hobbies: child.hobbies || null,
                    documents: child.documents.map(doc => ({ type: doc.type, name: doc.name, url: doc.url })).filter(doc => doc.url),
                }));
                await supabase.from('child_profile').upsert(childrenToUpdate).throwOnError();
            }

            setSaveMessage({ type: 'success', text: 'Profile saved successfully!' });
            await fetchProfileData(); // Refetch data to get latest from DB and exit edit mode
        } catch (error: any) {
            setSaveMessage({ type: 'error', text: `Failed to save profile: ${error.message}` });
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <UserGroupIcon className="w-10 h-10 text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Family Profile
                            </h1>
                            <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">
                                Manage your and your children's information.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <button
                            onClick={() => confirmAndNavigate(onBackToDashboard)}
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                        >
                            <ArrowUturnLeftIcon className="h-5 w-5" />
                            <span>Dashboard</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <Accordion title="Primary Parent / Guardian Profile" icon={<UserGroupIcon className="w-6 h-6"/>}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isEditing ? (
                                <>
                                    <InputField label="Full Name" name="fullName" value={primaryGuardian.fullName} onChange={handlePrimaryChange} disabled />
                                    <InputField label="Email ID" name="email" value={primaryGuardian.email || ''} onChange={handlePrimaryChange} disabled />
                                    <InputField label="Contact Number" name="phone" value={primaryGuardian.phone || ''} onChange={handlePrimaryChange} disabled />
                                    <SelectField label="Relation" name="relation" value={primaryGuardian.relation} onChange={handlePrimaryChange} options={Object.values(GuardianRelation)} required error={errors['primaryGuardian.relation']} />
                                    <div className="md:col-span-2"><InputField label="Address" name="address" value={primaryGuardian.address} onChange={handlePrimaryChange} disabled /></div>
                                </>
                            ) : (
                                <>
                                    <InfoDisplay label="Full Name" value={primaryGuardian.fullName} />
                                    <InfoDisplay label="Email ID" value={primaryGuardian.email} />
                                    <InfoDisplay label="Contact Number" value={primaryGuardian.phone} />
                                    <InfoDisplay label="Relation" value={primaryGuardian.relation} required />
                                    <div className="md:col-span-2"><InfoDisplay label="Address" value={primaryGuardian.address} /></div>
                                </>
                            )}
                        </div>
                    </Accordion>
                    
                    <Accordion title="Secondary Parent / Guardian Profile" icon={<UserGroupIcon className="w-6 h-6"/>}>
                        {isEditing && (
                            <div className="flex items-center gap-2 mb-4">
                                <input type="checkbox" id="showSecondary" checked={showSecondary} onChange={e => { setShowSecondary(e.target.checked); setIsDirty(true); }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                                <label htmlFor="showSecondary">Add a secondary parent/guardian (Recommended)</label>
                            </div>
                        )}
                        {(isEditing && showSecondary) || (!isEditing && initialSecondaryGuardian.fullName.trim()) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {isEditing ? (
                                    <>
                                        <InputField label="Full Name" name="fullName" value={secondaryGuardian.fullName} onChange={handleSecondaryChange} />
                                        <SelectField label="Relation" name="relation" value={secondaryGuardian.relation} onChange={handleSecondaryChange} options={Object.values(GuardianRelation)} error={errors['secondaryGuardian.relation']} />
                                        <InputField label="Email ID (Optional)" name="email" value={secondaryGuardian.email || ''} onChange={handleSecondaryChange} />
                                        <InputField label="Contact Number (Optional)" name="phone" value={secondaryGuardian.phone || ''} onChange={handleSecondaryChange} />
                                        <div className="md:col-span-2"><InputField label="Address" name="address" value={secondaryGuardian.address} onChange={handleSecondaryChange} /></div>
                                    </>
                                ) : (
                                    <>
                                        <InfoDisplay label="Full Name" value={initialSecondaryGuardian.fullName} />
                                        <InfoDisplay label="Relation" value={initialSecondaryGuardian.relation} />
                                        <InfoDisplay label="Email ID" value={initialSecondaryGuardian.email} />
                                        <InfoDisplay label="Contact Number" value={initialSecondaryGuardian.phone} />
                                        <div className="md:col-span-2"><InfoDisplay label="Address" value={initialSecondaryGuardian.address} /></div>
                                    </>
                                )}
                            </div>
                        ) : (!isEditing && <p className="text-slate-500 dark:text-slate-400 text-sm">No secondary parent/guardian information provided.</p>)}
                    </Accordion>
                    
                    <Accordion title="Children Details" icon={<AcademicCapIcon className="w-6 h-6"/>}>
                        <div className="space-y-6">
                            {children.map((child, childIndex) => (
                                <div key={child.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg relative">
                                    {isEditing && <button onClick={() => removeChild(childIndex)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 dark:hover:bg-slate-700 rounded-full"><TrashIcon className="w-5 h-5"/></button>}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {isEditing ? (
                                            <>
                                                <InputField label="Full Name" name="fullName" value={child.fullName} onChange={(e) => handleChildChange(childIndex, e)} required error={errors[`child.${childIndex}.fullName`]}/>
                                                <SelectField label="Gender" name="gender" value={child.gender} onChange={(e) => handleChildChange(childIndex, e)} options={['Male', 'Female', 'Other']} required error={errors[`child.${childIndex}.gender`]} />
                                                <InputField label="Age" name="age" type="number" value={String(child.age)} onChange={(e) => handleChildChange(childIndex, e)} required error={errors[`child.${childIndex}.age`]} />
                                                <InputField label="Class/Grade" name="grade" value={child.grade} onChange={(e) => handleChildChange(childIndex, e)} required error={errors[`child.${childIndex}.grade`]}/>
                                                <div className="md:col-span-2"><InputField label="Hobbies/Interests" name="hobbies" value={child.hobbies} onChange={(e) => handleChildChange(childIndex, e)} /></div>
                                            </>
                                        ) : (
                                            <>
                                                <InfoDisplay label="Full Name" value={child.fullName} required/>
                                                <InfoDisplay label="Gender" value={child.gender} required />
                                                <InfoDisplay label="Age" value={String(child.age)} required />
                                                <InfoDisplay label="Class/Grade" value={child.grade} required/>
                                                <div className="md:col-span-2"><InfoDisplay label="Hobbies/Interests" value={child.hobbies} /></div>
                                            </>
                                        )}
                                    </div>
                                    
                                    {child.admissionStatus && !isEditing && (
                                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/50 rounded-lg">
                                            <h4 className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-200 mb-2">
                                                <AcademicCapIcon className="w-5 h-5"/>
                                                School Admission Details
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                                                <div>
                                                    <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">School Name</p>
                                                    <p className="text-blue-900 dark:text-blue-100">{child.admissionStatus.schoolName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Student ID</p>
                                                    <p className="text-blue-900 dark:text-blue-100 font-mono">{child.admissionStatus.studentId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Admission Date</p>
                                                    <p className="text-blue-900 dark:text-blue-100">{new Date(child.admissionStatus.admissionDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <h4 className="font-semibold mb-2">Required Documents</h4>
                                        <div className="space-y-2">
                                            {child.documents.map((doc, docIndex) => isEditing ? (
                                                <FileUpload key={doc.id} document={doc} onFileSelect={(file) => handleFileSelect(childIndex, docIndex, file)} onRemove={() => removeDocument(childIndex, docIndex)} />
                                            ) : (
                                                <FileDisplay key={doc.id} document={doc} />
                                            ))}
                                        </div>
                                    </div>

                                    {!isEditing && (
                                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                                            <button
                                                onClick={() => handleViewPortal(child)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                                            >
                                                View Student Portal <ArrowRightIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                             {isEditing && (
                                <button onClick={addChild} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                                    <PlusIcon className="w-5 h-5" /> Add Child
                                </button>
                            )}
                        </div>
                    </Accordion>
                </div>

                <div className="mt-8">
                    <div className="flex justify-end gap-4">
                         {isEditing ? (
                            <>
                                <button onClick={handleCancel} className="px-8 py-3 font-bold text-slate-700 dark:text-slate-200 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg shadow-lg">
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveProfile}
                                    disabled={isSaving || Object.keys(errors).length > 0}
                                    className="px-8 py-3 font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-lg disabled:bg-green-400 dark:disabled:bg-green-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Saving...</span>
                                        </>
                                    ) : (
                                        'Save Profile'
                                    )}
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="px-8 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg flex items-center justify-center gap-2"
                            >
                                <PencilIcon className="w-5 h-5" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                    {saveMessage && (
                        <div className={`mt-4 text-center text-sm font-medium ${saveMessage.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {saveMessage.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Reusable form fields
const InputField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; disabled?: boolean; required?: boolean; error?: string; }> = ({ name, label, value, onChange, type = 'text', disabled = false, required = false, error }) => (
    <div>
        <label htmlFor={name} className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">{label}{required && <span className="text-red-500">*</span>}</label>
        <input type={type} name={name} id={name} value={value} onChange={onChange} disabled={disabled} className={`bg-slate-50 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-70 disabled:bg-slate-200 dark:disabled:bg-slate-700/50 focus:outline-none focus:ring-1`} />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

const SelectField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; required?: boolean; disabled?: boolean; error?: string; }> = ({ name, label, value, onChange, options, required = false, disabled = false, error }) => (
    <div>
        <label htmlFor={name} className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">{label}{required && <span className="text-red-500">*</span>}</label>
        <select name={name} id={name} value={value} onChange={onChange} disabled={disabled} className={`bg-slate-50 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-70 disabled:bg-slate-200 dark:disabled:bg-slate-700/50 focus:outline-none focus:ring-1`}>
            <option value="">-- Select --</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

const InfoDisplay: React.FC<{ label: string; value: string | undefined | null; required?: boolean; }> = ({ label, value, required }) => (
    <div>
        <p className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">{label}{required && <span className="text-red-500">*</span>}</p>
        <div className="bg-slate-50 border border-transparent text-slate-800 dark:text-slate-200 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-800/60 min-h-[42px] flex items-center">
            {value || <span className="text-slate-400 italic">Not provided</span>}
        </div>
    </div>
);