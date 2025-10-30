import React, { useState, useMemo } from 'react';
import type { Student, Invoice, FeeStatus } from '../../types';
import { ArrowUturnLeftIcon, CurrencyDollarIcon, PlusIcon } from '../Icons';
import { InvoiceTable } from './InvoiceTable';
import { CreateInvoiceModal } from './CreateInvoiceModal';
import { mockStudents, mockInvoices } from '../../data/mockData';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800/80 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-4">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">{icon}</div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

export const FinancialManagementPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const financialStats = useMemo(() => {
        const totalCollected = invoices.filter(inv => inv.status === 'Paid').reduce((acc, inv) => acc + inv.totalAmount, 0);
        const totalOutstanding = invoices.filter(inv => inv.status === 'Due').reduce((acc, inv) => acc + inv.totalAmount, 0);
        const totalOverdue = invoices.filter(inv => inv.status === 'Overdue').reduce((acc, inv) => acc + inv.totalAmount, 0);
        return { totalCollected, totalOutstanding, totalOverdue };
    }, [invoices]);

    const handleSaveInvoice = (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
        const newInvoice: Invoice = {
            ...invoice,
            id: `inv${Date.now()}`,
            invoiceNumber: `INV-2024-${invoices.length + 1}`,
        };
        setInvoices(prev => [newInvoice, ...prev]);
        setIsModalOpen(false);
    };

    const handleUpdateStatus = (invoiceId: string, status: FeeStatus) => {
        setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status, paidDate: status === 'Paid' ? getTodayDateString() : undefined } : inv));
    };

    const filteredInvoices = useMemo(() => {
        if (!searchTerm) return invoices;
        const lowercasedFilter = searchTerm.toLowerCase();
        return invoices.filter(invoice => {
            const student = mockStudents.find(s => s.id === invoice.studentId);
            return (
                student?.personal_info.full_name.toLowerCase().includes(lowercasedFilter) ||
                invoice.invoiceNumber.toLowerCase().includes(lowercasedFilter)
            );
        });
    }, [invoices, searchTerm]);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <CurrencyDollarIcon className="w-10 h-10 text-blue-500" />
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Financial Management
                                </h1>
                                <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">
                                    Manage invoices, payments, and school fees.
                                </p>
                            </div>
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
                
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Collected" value={`$${financialStats.totalCollected.toLocaleString()}`} icon={<CurrencyDollarIcon className="w-6 h-6" />} />
                    <StatCard title="Total Outstanding" value={`$${financialStats.totalOutstanding.toLocaleString()}`} icon={<CurrencyDollarIcon className="w-6 h-6" />} />
                    <StatCard title="Overdue Fees" value={`$${financialStats.totalOverdue.toLocaleString()}`} icon={<CurrencyDollarIcon className="w-6 h-6" />} />
                </div>


                <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-2xl dark:border dark:border-slate-700 p-6">
                     <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <input
                            type="text"
                            placeholder="Search by student name or invoice #..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-1/3 peer bg-slate-100/50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg block p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                        />
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center gap-2 w-full md:w-auto px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Create New Invoice</span>
                        </button>
                    </div>
                    <InvoiceTable 
                        invoices={filteredInvoices}
                        students={mockStudents}
                        onUpdateStatus={handleUpdateStatus}
                    />
                </div>
            </div>

            {isModalOpen && (
                <CreateInvoiceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveInvoice}
                    students={mockStudents}
                />
            )}
        </div>
    );
};