import React, { useState, useMemo } from 'react';
import type { Invoice, Student, FeeStatus } from '../../types';
import { UserCircleIcon, ChevronUpIcon, ChevronDownIcon, CheckCircleIcon, DocumentTextIcon } from '../Icons';

type SortKey = 'studentName' | 'invoiceNumber' | 'dueDate' | 'status' | 'totalAmount';
type SortDirection = 'asc' | 'desc';

interface CombinedInvoice extends Invoice {
    studentName: string;
}

const getStatusClass = (status: FeeStatus) => {
    switch (status) {
        case 'Paid':
            return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'Due':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'Overdue':
            return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        default:
            return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
};

const SortableHeader: React.FC<{
    label: string;
    sortKey: SortKey;
    requestSort: (key: SortKey) => void;
    sortConfig: { key: SortKey; direction: SortDirection };
}> = ({ label, sortKey, requestSort, sortConfig }) => {
    const isActive = sortConfig.key === sortKey;
    const directionIcon = sortConfig.direction === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />;

    return (
        <th scope="col" className="px-6 py-3">
            <button onClick={() => requestSort(sortKey)} className="group flex items-center gap-1.5">
                {label}
                {isActive ? directionIcon : <span className="opacity-0 group-hover:opacity-50"><ChevronUpIcon className="h-4 w-4" /></span>}
            </button>
        </th>
    );
}

export const InvoiceTable: React.FC<{ 
    invoices: Invoice[]; 
    students: Student[]; 
    onUpdateStatus: (invoiceId: string, status: FeeStatus) => void;
}> = ({ invoices, students, onUpdateStatus }) => {
    const studentMap = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);

    const combinedInvoices: CombinedInvoice[] = useMemo(() => 
        invoices.map(inv => ({
            ...inv,
            // FIX: Changed property access from 'fullName' to 'full_name'.
            studentName: studentMap.get(inv.studentId)?.full_name || 'Unknown Student',
        })), [invoices, studentMap]);

    // Note: A more robust sorting implementation would be needed for production.
    // This is simplified for demonstration.
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'dueDate', direction: 'desc' });
     const requestSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedInvoices = useMemo(() => {
        return [...combinedInvoices].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [combinedInvoices, sortConfig]);
    

    if (invoices.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 py-8">No invoices found.</p>;
    }

    return (
        <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                    <tr>
                        <SortableHeader label="Student" sortKey="studentName" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader label="Invoice #" sortKey="invoiceNumber" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader label="Due Date" sortKey="dueDate" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader label="Amount" sortKey="totalAmount" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader label="Status" sortKey="status" requestSort={requestSort} sortConfig={sortConfig} />
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedInvoices.map((invoice) => (
                        <tr key={invoice.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{invoice.studentName}</td>
                            <td className="px-6 py-4">{invoice.invoiceNumber}</td>
                            <td className="px-6 py-4">{invoice.dueDate}</td>
                            <td className="px-6 py-4 font-semibold">${invoice.totalAmount.toLocaleString()}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(invoice.status)}`}>
                                    {invoice.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="View Invoice Details">
                                        <DocumentTextIcon className="h-5 w-5" />
                                    </button>
                                    {invoice.status !== 'Paid' && (
                                        <button onClick={() => onUpdateStatus(invoice.id, 'Paid')} className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Mark as Paid">
                                            <CheckCircleIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
