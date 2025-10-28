import React, { useState, useEffect } from 'react';
import type { Course } from '../../../types';
import { Subject } from '../../../types';

interface AddEditCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (course: Course) => void;
    course: Course | null;
}

const initialFormState: Omit<Course, 'id'> = {
    courseName: '',
    courseCode: '',
    gradeLevel: '',
    subject: Subject.Mathematics,
    description: '',
};

export const AddEditCourseModal: React.FC<AddEditCourseModalProps> = ({ isOpen, onClose, onSave, course }) => {
    const [formData, setFormData] = useState<Omit<Course, 'id'>>(initialFormState);
    const [errors, setErrors] = useState<Partial<Record<keyof Course, string>>>({});
    
    useEffect(() => {
        if (course) {
            setFormData(course);
        } else {
            setFormData(initialFormState);
        }
    }, [course, isOpen]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof Course, string>> = {};
        if (!formData.courseName.trim()) newErrors.courseName = "Course Name is required.";
        if (!formData.courseCode.trim()) newErrors.courseCode = "Course Code is required.";
        if (!formData.gradeLevel.trim()) newErrors.gradeLevel = "Grade Level is required.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave({
                ...formData,
                id: course?.id || '',
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
                            {course ? 'Edit Course' : 'Create New Course'}
                        </h3>
                        <button type="button" onClick={onClose} className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-slate-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-4 md:p-5">
                        <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2">
                            <InputField name="courseName" label="Course Name" value={formData.courseName} onChange={handleChange} error={errors.courseName} />
                            <InputField name="courseCode" label="Course Code" value={formData.courseCode} onChange={handleChange} error={errors.courseCode} />
                            <InputField name="gradeLevel" label="Grade Level" value={formData.gradeLevel} onChange={handleChange} error={errors.gradeLevel} />
                            <SelectField name="subject" label="Subject" value={formData.subject} onChange={handleChange} options={Object.values(Subject)} />
                            <div className="md:col-span-2">
                               <TextAreaField name="description" label="Description (Optional)" value={formData.description || ''} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-4 md:p-5 border-t border-slate-200 rounded-b dark:border-slate-600 -mx-5 -mb-5">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none bg-white rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-3">
                                {course ? 'Save Changes' : 'Create Course'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const InputField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; }> = ({ name, label, value, onChange, error }) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">{label}</label>
        <input
            type="text"
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className={`bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
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

const TextAreaField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; }> = ({ name, label, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">{label}</label>
        <textarea
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            rows={4}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        ></textarea>
    </div>
);