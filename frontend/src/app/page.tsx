"use client";

import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Mail, Building2 } from 'lucide-react';
import api from '@/api/axios';
import { Lead } from '@/types/lead';
import CreateLeadModal from '@/components/CreateLeadModal';
import { getStatusStyles } from '@/utils/statusStyles';

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/leads');
            setLeads(response.data.items);
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    return (
        <main className="min-h-screen bg-surface p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
                        <p className="text-slate-500 text-sm font-medium">Manage your potential customers</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm shadow-brand/20"
                    >
                        <Plus size={18} />
                        <span>Add Lead</span>
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email or company..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-slate-900"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-all">
                        <Filter size={18} />
                        <span>Status</span>
                    </button>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-8 h-8 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium">Loading leads...</p>
                    </div>
                ) : (
                    <>
                        {leads.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                                <p className="text-slate-500">No leads found. Create your first one!</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Value</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                        {leads.map((lead) => (
                                            <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-900">{lead.name}</div>
                                                    <div className="text-xs text-slate-500">{lead.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 text-sm font-medium">{lead.company || '-'}</td>
                                                <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(lead.status)}`}>
                                                          {lead.status}
                                                        </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-700 font-semibold text-sm">
                                                    {lead.value ? `$${lead.value}` : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden space-y-4">
                                    {leads.map((lead) => (
                                        <div key={lead._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-lg">{lead.name}</h3>
                                                    <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                                                        <Mail size={14} />
                                                        <span>{lead.email}</span>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(lead.status)}`}>
                                                  {lead.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-slate-600 text-sm border-t border-slate-50 pt-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 size={14} />
                                                    <span className="font-medium">{lead.company || 'No company'}</span>
                                                </div>
                                                <div className="ml-auto font-bold text-slate-900">
                                                    {lead.value ? `$${lead.value}` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Modal Component */}
            <CreateLeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchLeads}
            />
        </main>
    );
}