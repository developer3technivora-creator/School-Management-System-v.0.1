import React, { useState, useEffect } from 'react';
import type { Meeting } from '../../../types';
import { MeetingType } from '../../../types';

interface AddEditMeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (meeting: Omit<Meeting, 'id' | 'attendees'> & { attendees: string }) => void;
    meeting: Meeting | null;
}

const initialFormState = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: MeetingType.Staff,
    locationOrLink: '',
    attendees: '',
    agenda: '',
};

export const AddEditMeetingModal: React.FC<AddEditMeetingModalProps> = ({ isOpen, onClose, onSave, meeting }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<Partial<Record<keyof typeof initialFormState, string>>>({});
    
    useEffect(() => {
        if (meeting) {
            setFormData({
                ...meeting,
                agenda: meeting.agenda || '',
                attendees: meeting.attendees.map(a => a.name).join(', '),
            });
        } else {
            setFormData(initialFormState);
        }
    }, [meeting, isOpen]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof typeof initialFormState, string>> = {};
        if (!formData.title.trim()) newErrors.title = "Title is required.";
        if (!formData.date) newErrors.date = "Date is required.";
        if (!formData.time) newErrors.time = "Time is required.";
        if (!formData.locationOrLink.trim()) newErrors.locationOrLink = "Location or Link is required.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
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
                            {meeting ? 'Edit Meeting' : 'Schedule New Meeting'}
                        </h3>
                        <button type="button" onClick={onClose} className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-slate-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-4 md:p-5">
                        <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2">
                            <InputField name="title" label="Meeting Title" value={formData.title} onChange={handleChange} error={errors.title} />
                             <SelectField name="type" label="Meeting Type" value={formData.type} onChange={handleChange} options={Object.values(MeetingType)} />
                             <InputField name="date" label="Date" type="date" value={formData.date} onChange={handleChange} error={errors.date} />
                             <InputField name="time" label="Time" type="time" value={formData.time} onChange={handleChange} error={errors.time} />
                            <div className="md:col-span-2">
                                <InputField name="locationOrLink" label="Location / Video Link" value={formData.locationOrLink} onChange={handleChange} error={errors.locationOrLink} />
                            </div>
                            <div className="md:col-span-2">
                                <TextAreaField name="attendees" label="Attendees (comma-separated names)" value={formData.attendees} onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2">
                               <TextAreaField name="agenda" label="Agenda / Notes (Optional)" value={formData.agenda || ''} onChange={handleChange} rows={4}/>
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-4 md:p-5 border-t border-slate-200 rounded-b dark:border-slate-600 -mx-5 -mb-5">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none bg-white rounded-lg border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-3">
                                {meeting ? 'Save Changes' : 'Schedule Meeting'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Helper components
const InputField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; error?: string; }> = ({ name, label, value, onChange, type = 'text', error }) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">{label}</label>
        <input type={type} name={name} id={name} value={value} onChange={onChange} className={`bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:text-white`} />
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