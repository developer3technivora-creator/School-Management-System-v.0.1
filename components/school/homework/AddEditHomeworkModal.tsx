import React, { useState, useEffect } from 'react';
import type { Homework } from '../../../types';
import { Subject } from '../../../types';

interface AddEditHomeworkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (homework: Homework) => void;
    homework: Homework | null;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

// FIX: Add 'teacher' property to initial state to match Homework type.
const initialFormState: Omit<Homework, 'id'> = {
    title: '',
    instructions: '',
    subject: Subject.Mathematics,
    gradeLevel: '',
    teacher: '',
    assignedDate: getTodayDateString(),
    dueDate: '',
    attachmentLink: '',
};

export const AddEditHomeworkModal: React.FC<AddEditHomeworkModalProps> = ({ isOpen, onClose, onSave, homework }) => {
    const [formData, setFormData] = useState<Omit<Homework, 'id'>>(initialFormState);
    const [errors, setErrors] = useState<Partial<Record<keyof Homework, string>>>({});
    
    useEffect(() => {
        if (homework) {
            setFormData(homework);
        } else {
            setFormData(initialFormState);
        }
    }, [homework, isOpen]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof Homework, string>> = {};
        if (!formData.title.trim()) newErrors.title = "Title is required.";
        if (!formData.gradeLevel.trim()) newErrors.gradeLevel = "Grade Level is required.";
        if (!formData.dueDate) newErrors.dueDate = "Due Date is required.";
        // FIX: Add validation for the new 'teacher' field.
        if (!formData.teacher.trim()) newErrors.teacher = "Teacher name is required.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave({
                ...formData,
                id: homework?.id || '',
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" aria-modal="true" role="dialog">
            <div className="relative w-full max-w-2xl max-h-[90vh] p-4">
                <div className="relative bg-white rounded-2xl shadow dark:bg-slate-800">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-slate-600">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                            {homework ? 'Edit Homework' : 'Create New Homework'}
                        </h3>
                        <button type="button" onClick={onClose} className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-slate-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-4 md:p-5">
                        <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <InputField name="title" label="Title" value={formData.title} onChange={handleChange} error={errors.title} />
                            </div>
                            <SelectField name="subject" label="Subject" value={formData.subject} onChange={handleChange} options={Object.values(Subject)} />
                            <InputField name="gradeLevel" label="Grade Level" value={formData.gradeLevel} onChange={handleChange} error={errors.gradeLevel} />
                            <InputField name="dueDate" label="Due Date" type="date" value={formData.dueDate} onChange={handleChange} error={errors.dueDate} />
                            <InputField name="assignedDate" label="Assigned Date" type="date" value={formData.assignedDate} onChange={handleChange} disabled />
                            {/* FIX: Add input field for 'teacher' to be included in the form. */}
                            <div className="md:col-span-2">
                                <InputField name="teacher" label="Teacher" value={formData.teacher} onChange={handleChange} error={errors.teacher} />
                            </div>
                            <div className="md:col-span-2">
                                <InputField name="attachmentLink" label="Attachment Link (Optional)" value={formData.attachmentLink || ''} onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2">
                               <TextAreaField name="instructions" label="Instructions" value={formData.instructions || ''} onChange={handleChange} rows={4}/>
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-4 md:p-5 border-t border-slate-200 rounded-b dark:border-slate-600 -mx-5 -mb-5">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-900 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-3">
                                {homework ? 'Save Changes' : 'Create Homework'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Reusable fields
const InputField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; error?: string; disabled?: boolean; }> = ({ name, label, value, onChange, type = 'text', error, disabled = false }) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">{label}</label>
        <input type={type} name={name} id={name} value={value} onChange={onChange} disabled={disabled} className={`bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:text-white disabled:opacity-60`} />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);
const SelectField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }> = ({ name, label, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">{label}</label>
        <select name={name} id={name} value={value} onChange={onChange} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:text-white">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);
const TextAreaField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = ({ name, label, value, onChange, rows = 2 }) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">{label}</label>
        <textarea name={name} id={name} value={value} onChange={onChange} rows={rows} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500"></textarea>
    </div>
);