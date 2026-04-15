"use client";

import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, MoreHorizontal, Mail, Building2, ChevronDown, X } from 'lucide-react';
import api from '@/api/axios';
import { Lead, LeadStatus } from '@/types/lead';
import CreateLeadModal from '@/components/CreateLeadModal';
import { getStatusStyles } from '@/utils/statusStyles';
import { useRouter } from 'next/navigation';

export default function LeadsPage() {
    const router = useRouter();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/leads', {
                params: {
                    q: searchQuery,
                    status: statusFilter || undefined,
                    page: currentPage,
                    limit: 10,
                    sort: sortBy,
                    order: sortOrder
                }
            });
            setLeads(response.data.items);
            setTotalPages(response.data.lastPage);
        } catch (err) {
            setError("Could not load leads.");
        } finally {
            setLoading(false);
        }
    }, [searchQuery, statusFilter, currentPage, sortBy, sortOrder]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchLeads();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, statusFilter, currentPage, sortBy, sortOrder, fetchLeads]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchLeads();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, statusFilter, fetchLeads]);

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
                <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">

                    {/* Search (Left side) */}
                    <div className="relative w-full xl:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-slate-900 shadow-sm"
                        />
                    </div>

                    {/* Controls Group (Right side) */}
                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">

                        {/* Filter Group */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Filter:</span>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="appearance-none bg-white border border-slate-200 pl-3 pr-8 py-2 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer min-w-[120px]"
                                >
                                    <option value="">All Status</option>
                                    {Object.values(LeadStatus).map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                            </div>
                        </div>

                        {/* Vertical Divider (Hidden on small screens) */}
                        <div className="hidden md:block w-px h-6 bg-slate-200 mx-1"></div>

                        {/* Sort Group */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Sort by:</span>
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                                <div className="relative border-r border-slate-100">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none bg-transparent pl-3 pr-8 py-2 text-sm font-bold text-slate-700 outline-none cursor-pointer min-w-[130px]"
                                    >
                                        <option value="createdAt">Date Created</option>
                                        <option value="updatedAt">Last Updated</option>
                                        <option value="name">Name</option>
                                        <option value="value">Value</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                </div>

                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors flex items-center justify-center"
                                    title={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
                                >
                                    {sortOrder === 'asc' ? (
                                        <span className="flex items-center font-black text-[10px] text-brand">ASC ↑</span>
                                    ) : (
                                        <span className="flex items-center font-black text-[10px] text-brand">DESC ↓</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="mt-8">
                    {error ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-rose-50 rounded-3xl border border-rose-100 text-center px-4">
                            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                                <X size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Connection Error</h3>
                            <p className="text-slate-500 max-w-xs mt-1 mb-6">{error}</p>
                            <button
                                onClick={fetchLeads}
                                className="px-6 py-2 bg-white border border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors shadow-sm"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-medium animate-pulse">Fetching leads...</p>
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 text-slate-400 rounded-full mb-4">
                                <Search size={32} />
                            </div>
                            <p className="text-slate-600 font-bold text-lg">No leads found</p>
                            <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search query.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Desktop Table */}
                            <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50/50 border-b border-slate-200">
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
                                        <tr
                                            key={lead._id}
                                            onClick={() => router.push(`/leads/${lead._id}`)}
                                            className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 group-hover:text-brand transition-colors">{lead.name}</div>
                                                <div className="text-xs text-slate-500">{lead.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 text-sm font-medium">{lead.company || '—'}</td>
                                            <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyles(lead.status)}`}>
                                                        {lead.status}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-900 font-bold text-sm">
                                                {lead.value ? `$${lead.value.toLocaleString()}` : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all">
                                                    <MoreHorizontal size={18} />
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
                                    <div
                                        key={lead._id}
                                        onClick={() => router.push(`/leads/${lead._id}`)}
                                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 active:scale-[0.98] transition-all"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-slate-900 text-lg leading-tight">{lead.name}</h3>
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                    <Mail size={12} />
                                                    <span>{lead.email}</span>
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusStyles(lead.status)}`}>
                                                {lead.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-600 text-sm border-t border-slate-50 pt-4">
                                            <div className="flex items-center gap-1.5">
                                                <Building2 size={14} className="text-slate-400" />
                                                <span className="font-medium truncate max-w-[150px]">{lead.company || 'Private'}</span>
                                            </div>
                                            <div className="font-black text-slate-900">
                                                {lead.value ? `$${lead.value}` : ''}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                                <p className="text-sm text-slate-500 font-semibold order-2 sm:order-1">
                                    Showing page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
                                </p>
                                <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className="flex-1 sm:flex-none px-6 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className="flex-1 sm:flex-none px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-40 transition-all shadow-sm"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Component - Now correctly placed inside the main container */}
            <CreateLeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchLeads}
            />
        </main>
    );
}