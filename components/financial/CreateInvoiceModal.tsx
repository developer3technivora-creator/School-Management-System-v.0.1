import React, { useState, useEffect } from 'react';
import type { Student, Invoice, InvoiceItem } from '../../types';
import { PlusIcon, TrashIcon } from '../Icons';

interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
    students: Student[];
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose, onSave, students }) => {
    const [studentId, setStudentId] = useState<string>('');
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState<Omit<InvoiceItem, 'id'>[]>([{ description: '', amount: 0 }]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStudentId(students.length > 0 ? students[0].id : '');
            setDueDate('');
            setItems([{ description: '', amount: 0 }]);
            setError('');
        }
    }, [isOpen, students]);

    const handleItemChange = (index: number, field: 'description' | 'amount', value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', amount: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const totalAmount = items.reduce((acc, item) => acc + Number(item.amount), 0);

    const handleSubmit = () => {
        if (!studentId || !dueDate || items.some(i => !i.description || i.amount <= 0)) {
            setError('Please fill all fields, and ensure all item amounts are positive.');
            return;
        }
        setError('');
        onSave({
            studentId,
            dueDate,
            items: items.map((item, index) => ({ ...item, id: `item-${Date.now()}-${index}` })),
            totalAmount,
            issueDate: getTodayDateString(),
            status: 'Due',
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] p-4">
                <div className="relative bg-white rounded-2xl shadow dark:bg-slate-800 flex flex-col">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-slate-600">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Create New Invoice</h3>
                        <button type="button" onClick={onClose} className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-slate-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="student" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">Student</label>
                                <select id="student" value={studentId} onChange={e => setStudentId(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                                    {/* FIX: Changed property access from 'fullName' to 'full_name'. */}
                                    {students.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="dueDate" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">Due Date</label>
                                <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                            </div>
                        </div>

                        <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-6">Invoice Items</h4>
                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input type="text" placeholder="Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="flex-grow bg-slate-50 border border-slate-300 text-sm rounded-lg p-2.5 dark:bg-slate-700 dark:border-slate-600" />
                                    <input type="number" placeholder="Amount" value={item.amount} onChange={e => handleItemChange(index, 'amount', Number(e.target.value))} className="w-32 bg-slate-50 border border-slate-300 text-sm rounded-lg p-2.5 dark:bg-slate-700 dark:border-slate-600" />
                                    <button onClick={() => removeItem(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-slate-700 rounded-md">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button onClick={addItem} className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-3">
                            <PlusIcon className="h-4 w-4" />
                            Add Item
                        </button>
                        
                        <div className="mt-6 pt-4 border-t dark:border-slate-600 flex justify-end items-center">
                            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">Total:</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white ml-2">${totalAmount.toLocaleString()}</span>
                        </div>
                        
                        {error && <p className="text-sm text-red-500 text-center mt-4">{error}</p>}

                    </div>
                    <div className="flex items-center justify-end p-4 border-t border-slate-200 dark:border-slate-600">
                        <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none bg-white rounded-lg border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">Cancel</button>
                        <button onClick={handleSubmit} className="ml-3 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save Invoice</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
