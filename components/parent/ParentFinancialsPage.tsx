import React, { useMemo } from 'react';
import { ArrowUturnLeftIcon, CurrencyDollarIcon } from '../Icons';
import type { Invoice, FeeStatus } from '../../types';

// Mock Data
const initialInvoices: Invoice[] = [
    { id: 'inv1', invoiceNumber: 'INV-2024-001', studentId: 'child1', status: 'Paid', items: [{id: 'i1', description: 'Annual Tuition Fee', amount: 5000}], totalAmount: 5000, issueDate: '2024-08-01', dueDate: '2024-09-01', paidDate: '2024-08-15' },
    { id: 'inv2', invoiceNumber: 'INV-2024-002', studentId: 'child2', status: 'Due', items: [{id: 'i2', description: 'Annual Tuition Fee', amount: 4800}, {id: 'i3', description: 'Lab Fee', amount: 150}], totalAmount: 4950, issueDate: '2024-08-01', dueDate: '2024-09-01' },
    { id: 'inv3', invoiceNumber: 'INV-2024-003', studentId: 'child1', status: 'Overdue', items: [{id: 'i4', description: 'Spring Semester Fee', amount: 2500}], totalAmount: 2500, issueDate: '2024-01-15', dueDate: '2024-02-15' },
];

const getStatusClass = (status: FeeStatus) => {
    switch (status) {
        case 'Paid': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'Due': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
};

export const ParentFinancialsPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {

    const totalOutstanding = useMemo(() => {
        return initialInvoices
            .filter(inv => inv.status === 'Due' || inv.status === 'Overdue')
            .reduce((acc, inv) => acc + inv.totalAmount, 0);
    }, [initialInvoices]);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <CurrencyDollarIcon className="w-10 h-10 text-blue-500" />
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                School Fees & Invoices
                            </h1>
                            <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">
                                View and manage outstanding payments and fee history.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onBackToDashboard}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                        <ArrowUturnLeftIcon className="h-5 w-5" />
                        <span>Dashboard</span>
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl dark:border dark:border-slate-700 p-6">
                    <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-500 rounded-lg">
                            <CurrencyDollarIcon className="w-8 h-8"/>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-500 dark:text-slate-400">Total Outstanding Balance</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">${totalOutstanding.toLocaleString()}</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Invoice History</h3>
                     <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Invoice #</th>
                                    <th scope="col" className="px-6 py-3">Issue Date</th>
                                    <th scope="col" className="px-6 py-3">Due Date</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {initialInvoices.map(invoice => (
                                    <tr key={invoice.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{invoice.invoiceNumber}</td>
                                        <td className="px-6 py-4">{invoice.issueDate}</td>
                                        <td className="px-6 py-4">{invoice.dueDate}</td>
                                        <td className="px-6 py-4 font-semibold">${invoice.totalAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {invoice.status !== 'Paid' ? (
                                                <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Pay Now</button>
                                            ) : (
                                                <span className="text-xs text-green-600 dark:text-green-400">Paid on {invoice.paidDate}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
