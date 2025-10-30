import React, { useMemo, useState } from 'react';
import { ArrowUturnLeftIcon, CurrencyDollarIcon, CheckBadgeIcon } from '../Icons';
import type { Invoice, FeeStatus } from '../../types';
import { mockInvoices } from '../../data/mockData';

const getStatusInfo = (status: FeeStatus) => {
    switch (status) {
        case 'Paid': return { textClass: 'text-green-600 dark:text-green-400', bgClass: 'bg-green-100 dark:bg-green-900/30' };
        case 'Due': return { textClass: 'text-yellow-600 dark:text-yellow-400', bgClass: 'bg-yellow-100 dark:bg-yellow-900/30' };
        case 'Overdue': return { textClass: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-100 dark:bg-red-900/30' };
        default: return { textClass: 'text-slate-600 dark:text-slate-400', bgClass: 'bg-slate-100 dark:bg-slate-700/50' };
    }
};

const InvoiceCard: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    const statusInfo = getStatusInfo(invoice.status);
    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <div className="flex items-center gap-3">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{invoice.invoiceNumber}</p>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusInfo.bgClass} ${statusInfo.textClass}`}>
                        {invoice.status}
                    </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Due: {invoice.dueDate} • Issued: {invoice.issueDate}</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <p className="text-xl font-bold text-slate-900 dark:text-white">${invoice.totalAmount.toLocaleString()}</p>
                {invoice.status !== 'Paid' ? (
                    <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm w-full sm:w-auto">Pay Now</button>
                ) : (
                    <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                        <CheckBadgeIcon className="w-5 h-5"/>
                        <span>Paid</span>
                    </div>
                )}
            </div>
        </div>
    );
};


export const ParentFinancialsPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
    const [activeTab, setActiveTab] = useState<'due' | 'paid'>('due');

    const { dueInvoices, paidInvoices, totalOutstanding } = useMemo(() => {
        const due = mockInvoices.filter(inv => inv.status === 'Due' || inv.status === 'Overdue');
        const paid = mockInvoices.filter(inv => inv.status === 'Paid');
        const outstanding = due.reduce((acc, inv) => acc + inv.totalAmount, 0);
        return { dueInvoices: due, paidInvoices: paid, totalOutstanding: outstanding };
    }, []);

    const invoicesToShow = activeTab === 'due' ? dueInvoices : paidInvoices;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-500 rounded-xl">
                        <CurrencyDollarIcon className="w-8 h-8"/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">School Fees & Invoices</h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage payments and view fee history.</p>
                    </div>
                </div>
            </div>

            <div className={`p-6 rounded-2xl shadow-lg text-white ${totalOutstanding > 0 ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-green-500 to-teal-500'}`}>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold opacity-90">Total Outstanding Balance</p>
                        <p className="text-4xl font-bold">${totalOutstanding.toLocaleString()}</p>
                    </div>
                    {totalOutstanding > 0 && (
                        <button className="px-5 py-2.5 font-semibold bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm">Pay All</button>
                    )}
                </div>
            </div>

            <div>
                <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4">
                    <button onClick={() => setActiveTab('due')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'due' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                        Due ({dueInvoices.length})
                    </button>
                    <button onClick={() => setActiveTab('paid')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'paid' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                        Payment History ({paidInvoices.length})
                    </button>
                </div>
                
                <div className="space-y-4">
                    {invoicesToShow.length > 0 ? (
                        invoicesToShow.map(invoice => <InvoiceCard key={invoice.id} invoice={invoice} />)
                    ) : (
                        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                            <p className="font-semibold">All caught up!</p>
                            <p>You have no {activeTab} invoices.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
