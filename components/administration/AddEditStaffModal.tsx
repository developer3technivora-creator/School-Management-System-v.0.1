import React, { useState, useEffect } from 'react';
import type { StaffMember, StaffRole, EmploymentStatus } from '../../types';
import { StaffRole as StaffRoleEnum, EmploymentStatus as EmploymentStatusEnum } from '../../types';

interface AddEditStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (staffMember: StaffMember) => void;
    staffMember: StaffMember | null;
}

const initialFormState: Omit<StaffMember, 'id'> = {
    staffId: '',
    fullName: '',
    role: StaffRoleEnum.Teacher,
    email: '',
    phone: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active',
};

export const AddEditStaffModal: React.FC<AddEditStaffModalProps> = ({ isOpen, onClose, onSave, staffMember }) => {
    const [formData, setFormData] = useState<Omit<StaffMember, 'id'>>(initialFormState);
    
    useEffect(() => {
        if (staffMember) {
            setFormData(staffMember);
        } else {
            setFormData(initialFormState);
        }
    }, [staffMember, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add validation here if needed
        onSave({ ...formData, id: staffMember?.id || '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] p-4">
                <div className="relative bg-white rounded-2xl shadow dark:bg-slate-800">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-slate-600">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                            {staffMember ? 'Edit Staff Member' : 'Add New Staff Member'}
                        </h3>
                        <button type="button" onClick={onClose} className="text-slate-400 bg-transparent hover:bg-slate-200 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-slate-600">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-4 md:p-5">
                        <div className="grid gap-4 mb-4 grid-cols-2">
                            <InputField name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} />
                            <InputField name="staffId" label="Staff ID" value={formData.staffId} onChange={handleChange} />
                            <InputField name="email" label="Email" type="email" value={formData.email} onChange={handleChange} />
                            <InputField name="phone" label="Phone" type="tel" value={formData.phone} onChange={handleChange} />
                            <SelectField name="role" label="Role" value={formData.role} onChange={handleChange} options={Object.values(StaffRoleEnum)} />
                            <InputField name="joiningDate" label="Joining Date" type="date" value={formData.joiningDate} onChange={handleChange} />
                             <div className="col-span-2">
                                <SelectField name="status" label="Employment Status" value={formData.status} onChange={handleChange} options={['Active', 'On Leave', 'Terminated']} />
                            </div>
                        </div>
                        <div className="flex items-center justify-end pt-4 border-t border-slate-200 dark:border-slate-600">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-900 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-3">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Reusable form fields
const InputField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; }> = ({ name, label, value, onChange, type = 'text' }) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">{label}</label>
        <input type={type} name={name} id={name} value={value} onChange={onChange} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
    </div>
);

const SelectField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }> = ({ name, label, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">{label}</label>
        <select name={name} id={name} value={value} onChange={onChange} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);
