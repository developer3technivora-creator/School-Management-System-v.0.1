import React, { useState, useEffect } from 'react';
import type { Student } from '../../types';
import { UserCircleIcon } from '../Icons';

interface AddEditStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (student: Student) => void;
    student: Student | null;
    students: Student[];
}

// FIX: Create a flat interface for the form data to simplify state management.
interface StudentFormData {
    student_id: string;
    full_name: string;
    date_of_birth: string;
    grade: string;
    enrollment_status: 'Enrolled' | 'Withdrawn' | 'Graduated' | 'Pending';
    gender: 'Male' | 'Female' | 'Other' | '';
    address: string;
    parent_guardian_name: string;
    parent_guardian_phone: string;
    parent_guardian_email: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
}


// FIX: Corrected property names from camelCase to snake_case.
const initialFormState: StudentFormData = {
    student_id: '',
    full_name: '',
    date_of_birth: '',
    grade: '',
    enrollment_status: 'Enrolled',
    // FIX: Changed initial gender to an empty string, which is a valid type. 'Prefer not to say' was invalid.
    gender: '',
    address: '',
    parent_guardian_name: '',
    parent_guardian_phone: '',
    parent_guardian_email: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
};

export const AddEditStudentModal: React.FC<AddEditStudentModalProps> = ({ isOpen, onClose, onSave, student, students }) => {
    // FIX: Use the flat StudentFormData interface for the form state.
    const [formData, setFormData] = useState<StudentFormData>(initialFormState);
    // FIX: Errors should correspond to the flat form data structure.
    const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    
    useEffect(() => {
        if (student) {
            // FIX: Flatten the nested student object into the form state.
            setFormData({
                student_id: student.student_id,
                full_name: student.personal_info.full_name,
                date_of_birth: student.personal_info.date_of_birth,
                gender: student.personal_info.gender,
                address: student.personal_info.address,
                grade: student.academic_info.grade,
                enrollment_status: student.academic_info.enrollment_status,
                parent_guardian_name: student.contact_info.parent_guardian.name,
                parent_guardian_phone: student.contact_info.parent_guardian.phone,
                parent_guardian_email: student.contact_info.parent_guardian.email,
                emergency_contact_name: student.contact_info.emergency_contact.name,
                emergency_contact_phone: student.contact_info.emergency_contact.phone
            });
            setPhotoPreview(student.photo_url || null);
        } else {
            const generateNextStudentId = () => {
                const currentYear = new Date().getFullYear();
                const yearPrefix = `S-${currentYear}`;

                const maxSeq = students
                    // FIX: Changed property access from 'studentId' to 'student_id'.
                    .filter(s => s.student_id.startsWith(yearPrefix))
                    // FIX: Changed property access from 'studentId' to 'student_id'.
                    .map(s => parseInt(s.student_id.substring(6), 10))
                    .filter(num => !isNaN(num))
                    .reduce((max, current) => Math.max(max, current), 0);
                
                const nextSeq = maxSeq + 1;
                const paddedSeq = String(nextSeq).padStart(4, '0');

                return `${yearPrefix}${paddedSeq}`;
            };
            
            setFormData({
                ...initialFormState,
                // FIX: Changed property name from 'studentId' to 'student_id'.
                student_id: generateNextStudentId(),
            });
            setPhotoPreview(null);
        }
    }, [student, isOpen, students]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof StudentFormData, string>> = {};
        // FIX: Changed property access from camelCase to snake_case.
        if (!formData.full_name.trim()) newErrors.full_name = "Full Name is required.";
        // FIX: Changed property access from camelCase to snake_case.
        if (!formData.student_id.trim()) newErrors.student_id = "Student ID is required.";
        // FIX: Changed property access from camelCase to snake_case.
        if (!formData.date_of_birth) newErrors.date_of_birth = "Date of Birth is required.";
        if (!formData.grade.trim()) newErrors.grade = "Grade is required.";
        // FIX: Changed property access from camelCase to snake_case.
        if (!formData.parent_guardian_name.trim()) newErrors.parent_guardian_name = "Parent/Guardian Name is required.";
        // FIX: Changed property access from camelCase to snake_case.
        if (!formData.parent_guardian_phone.match(/^\d{10,15}$/)) newErrors.parent_guardian_phone = "Enter a valid phone number.";
        // FIX: Changed property access from camelCase to snake_case.
        if (!formData.parent_guardian_email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.parent_guardian_email = "Enter a valid email.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            // FIX: Un-flatten the form data into a nested Student object before saving.
            const studentToSave: Student = {
                id: student?.id || '', // Keep existing id or let parent handle new id
                photo_url: photoPreview || undefined,
                student_id: formData.student_id,
                personal_info: {
                    full_name: formData.full_name,
                    date_of_birth: formData.date_of_birth,
                    gender: formData.gender,
                    address: formData.address
                },
                academic_info: {
                    grade: formData.grade,
                    enrollment_status: formData.enrollment_status,
                },
                contact_info: {
                    parent_guardian: {
                        name: formData.parent_guardian_name,
                        phone: formData.parent_guardian_phone,
                        email: formData.parent_guardian_email,
                    },
                    emergency_contact: {
                        name: formData.emergency_contact_name,
                        phone: formData.emergency_contact_phone,
                    }
                }
            };
            onSave(studentToSave);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" aria-modal="true" role="dialog">
            <div className="relative w-full max-w-3xl max-h-[90vh] p-4">
                <div className="relative bg-white rounded-2xl shadow dark:bg-slate-800">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-slate-600">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                            {student ? 'Edit Student Profile' : 'Add New Student'}
                        </h3>
                        <button type="button" onClick={onClose} className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-slate-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-4 md:p-5 overflow-y-auto max-h-[calc(90vh-140px)]">
                        <div className="grid gap-6 mb-4 grid-cols-1 md:grid-cols-2">
                             <div className="md:col-span-2 flex flex-col items-center gap-4">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-2 border-slate-300 dark:border-slate-600" />
                                ) : (
                                    <UserCircleIcon className="w-24 h-24 text-slate-300 dark:text-slate-600" />
                                )}
                                <div>
                                    <label htmlFor="photo-upload" className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900 px-4 py-2 rounded-lg transition-colors">
                                        {photoPreview ? 'Change Photo' : 'Upload Photo'}
                                    </label>
                                    <input id="photo-upload" type="file" className="hidden" onChange={handlePhotoChange} accept="image/png, image/jpeg" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-600 pb-2">Personal Information</h4>
                            </div>
                            {/* FIX: Changed property access and names from camelCase to snake_case. */}
                            <InputField name="full_name" label="Full Name" value={formData.full_name} onChange={handleChange} error={errors.full_name} />
                            {/* FIX: Changed property access and names from camelCase to snake_case. */}
                            <InputField name="student_id" label="Student ID" value={formData.student_id} onChange={handleChange} error={errors.student_id} disabled={!!student} />
                            {/* FIX: Changed property access and names from camelCase to snake_case. */}
                            <InputField name="date_of_birth" label="Date of Birth" type="date" value={formData.date_of_birth} onChange={handleChange} error={errors.date_of_birth} />
                            {/* FIX: Replaced the generic SelectField with a custom select to handle 'Prefer not to say' mapping to an empty string value, which is a valid type for gender. */}
                            <div>
                                <label htmlFor="gender" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">Gender</label>
                                <select
                                    name="gender"
                                    id="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="">Prefer not to say</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                               <InputField name="address" label="Address" value={formData.address} onChange={handleChange} />
                            </div>
                            
                            <div className="md:col-span-2 mt-4">
                                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-600 pb-2">Academic Information</h4>
                            </div>
                            <InputField name="grade" label="Grade" value={formData.grade} onChange={handleChange} error={errors.grade} />
                            {/* FIX: Changed property access and names from camelCase to snake_case. */}
                            <SelectField name="enrollment_status" label="Enrollment Status" value={formData.enrollment_status} onChange={handleChange} options={['Enrolled', 'Withdrawn', 'Graduated', 'Pending']} />

                            <div className="md:col-span-2 mt-4">
                                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-600 pb-2">Contact Information</h4>
                            </div>
                            {/* FIX: Changed property access and names from camelCase to snake_case. */}
                            <InputField name="parent_guardian_name" label="Parent/Guardian Name" value={formData.parent_guardian_name} onChange={handleChange} error={errors.parent_guardian_name} />
                            {/* FIX: Changed property access and names from camelCase to snake_case. */}
                            <InputField name="parent_guardian_phone" label="Parent/Guardian Phone" type="tel" value={formData.parent_guardian_phone} onChange={handleChange} error={errors.parent_guardian_phone} />
                            {/* FIX: Changed property access and names from camelCase to snake_case. */}
                            <InputField name="parent_guardian_email" label="Parent/Guardian Email" type="email" value={formData.parent_guardian_email} onChange={handleChange} error={errors.parent_guardian_email} />
                             <div className="md:col-span-2">
                                {/* FIX: Changed property access and names from camelCase to snake_case. */}
                                <InputField name="emergency_contact_name" label="Emergency Contact Name" value={formData.emergency_contact_name} onChange={handleChange} />
                            </div>
                            {/* FIX: Changed property access and names from camelCase to snake_case. */}
                            <InputField name="emergency_contact_phone" label="Emergency Contact Phone" type="tel" value={formData.emergency_contact_phone} onChange={handleChange} />

                        </div>
                        <div className="flex items-center justify-end p-4 md:p-5 border-t border-slate-200 rounded-b dark:border-slate-600 mt-4 -mx-5 -mb-5">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none bg-white rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-3">
                                {student ? 'Save Changes' : 'Create Student'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Reusable form field components
const InputField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; error?: string; disabled?: boolean; }> = ({ name, label, value, onChange, type = 'text', error, disabled = false }) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">{label}</label>
        <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 disabled:opacity-70 disabled:bg-slate-200 dark:disabled:bg-slate-700/50`}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

const SelectField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }> = ({ name, label, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">{label}</label>
        <select
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);
