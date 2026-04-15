"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '@/api/axios';
import { Lead, LeadStatus } from '@/types/lead';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Lead | null;
}

export default function CreateLeadModal({ isOpen, onClose, onSuccess, initialData }: Props) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        status: LeadStatus.NEW,
        value: '' as string,
        notes: ''
    });

    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                company: initialData.company || '',
                status: initialData.status || LeadStatus.NEW,
                value: initialData.value?.toString() || '',
                notes: initialData.notes || ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                company: '',
                status: LeadStatus.NEW,
                value: '',
                notes: ''
            });
        }
        // Reset error when modal opens/closes
        setServerError(null);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null);
        try {
            const payload = {
                ...formData,
                value: formData.value === '' ? 0 : Number(formData.value)
            };

            if (initialData) {
                await api.patch(`/leads/${initialData._id}`, payload);
            } else {
                await api.post('/leads', payload);
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            const message = error.response?.data?.message;
            setServerError(Array.isArray(message) ? message[0] : message || "Something went wrong");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">
                        {initialData ? 'Edit Lead' : 'New Lead'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Name *</label>
                            <input
                                required
                                placeholder="Full name"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-slate-900"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-slate-900"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Value ($)</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-slate-900"
                                value={formData.value}
                                onChange={e => setFormData({...formData, value: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                            <select
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all bg-white text-slate-900"
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value as LeadStatus})}
                            >
                                {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Company</label>
                            <input
                                placeholder="Company name"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-slate-900"
                                value={formData.company}
                                onChange={e => setFormData({...formData, company: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Notes</label>
                        <textarea
                            placeholder="Additional information..."
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-slate-900 resize-none"
                            value={formData.notes}
                            onChange={e => setFormData({...formData, notes: e.target.value})}
                        />
                    </div>

                    {/* Server Error Message Placement */}
                    {serverError && (
                        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl animate-in fade-in slide-in-from-top-1">
                            {serverError}
                        </div>
                    )}

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl font-semibold shadow-sm shadow-brand/20 transition-all"
                        >
                            {initialData ? 'Save Changes' : 'Create Lead'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}