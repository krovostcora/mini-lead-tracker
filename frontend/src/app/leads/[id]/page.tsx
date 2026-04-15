"use client";

import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Building2, Mail, DollarSign, XCircle } from 'lucide-react';
import api from '@/api/axios';
import { Lead } from '@/types/lead';
import { getStatusStyles } from '@/utils/statusStyles';
import CreateLeadModal from "@/components/CreateLeadModal";

export default function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [lead, setLead] = useState<Lead | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [leadRes, commentsRes] = await Promise.all([
                api.get(`/leads/${id}`),
                api.get(`/leads/${id}/comments`)
            ]);
            setLead(leadRes.data);
            setComments(commentsRes.data);
        } catch (e) {
            console.error(e);
            setError("Failed to load lead details. It might have been deleted.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this lead?")) return;
        try {
            await api.delete(`/leads/${id}`);
            router.push('/');
        } catch (e) {
            alert("Failed to delete lead");
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedComment = newComment.trim();
        if (!trimmedComment || trimmedComment.length > 500) return;

        setIsSubmittingComment(true);
        try {
            const res = await api.post(`/leads/${id}/comments`, { text: trimmedComment });
            setComments([res.data, ...comments]);
            setNewComment('');
        } catch (e) {
            console.error(e);
            alert("Could not post comment. Try again.");
        } finally {
            setIsSubmittingComment(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading details...</p>
        </div>
    );

    if (error || !lead) return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <XCircle size={48} className="text-rose-500 mb-4" />
            <h1 className="text-xl font-bold text-slate-900">{error || "Lead not found"}</h1>
            <button onClick={() => router.push('/')} className="mt-4 text-brand font-bold underline">
                Return to leads list
            </button>
        </div>
    );

    return (
        <main className="min-h-screen bg-surface p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Back Button */}
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-brand transition-colors font-bold text-sm uppercase tracking-wide">
                    <ArrowLeft size={18} />
                    Back to list
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Info Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="space-y-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyles(lead.status)}`}>
                                    {lead.status}
                                </span>
                                <h1 className="text-2xl font-black text-slate-900 leading-tight">{lead.name}</h1>

                                <div className="space-y-4 pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Mail size={16} />
                                        </div>
                                        <span className="text-sm font-medium">{lead.email || 'No email'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Building2 size={16} />
                                        </div>
                                        <span className="text-sm font-medium">{lead.company || 'Private person'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <DollarSign size={16} />
                                        </div>
                                        <span className="text-sm font-black text-slate-900">{lead.value ? `$${lead.value.toLocaleString()}` : 'No value'}</span>
                                    </div>

                                    <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col gap-3">
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm shadow-sm"
                                        >
                                            Edit Lead Info
                                        </button>

                                        <button
                                            onClick={handleDelete}
                                            className="py-2 text-[10px] font-black text-rose-400 hover:text-rose-600 transition-colors uppercase tracking-[0.2em]"
                                        >
                                            Delete Lead
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section (if exists) */}
                        {lead.notes && (
                            <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100">
                                <h3 className="text-xs font-black text-amber-700 uppercase tracking-widest mb-2">Internal Notes</h3>
                                <p className="text-sm text-amber-900/80 leading-relaxed italic">"{lead.notes}"</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Comments Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="font-black text-slate-900 text-lg uppercase tracking-tight">Activity Log</h2>
                                <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase">
                                    {comments.length} comments
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                                {comments.map((comment) => (
                                    <div key={comment._id} className="flex gap-4 group">
                                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand font-black text-xs shrink-0 shadow-sm">
                                            {comment.author?.charAt(0) || 'U'}
                                        </div>
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900 text-sm">User</span>
                                                <span className="text-[10px] font-medium text-slate-400">
                                                    {new Date(comment.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm inline-block">
                                                {comment.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {comments.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                                        <p className="text-sm font-medium italic">No comments yet...</p>
                                    </div>
                                )}
                            </div>

                            {/* Comment Input */}
                            <div className="p-6 border-t border-slate-100 bg-white">
                                <form onSubmit={handleAddComment} className="space-y-3">
                                    <div className="relative">
                                        <textarea
                                            maxLength={500}
                                            placeholder="Write a follow-up note..."
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white outline-none transition-all text-sm text-slate-900 resize-none"
                                            rows={3}
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                        <div className={`absolute bottom-3 right-3 text-[10px] font-black tracking-tighter ${newComment.length >= 450 ? 'text-rose-500' : 'text-slate-300'}`}>
                                            {newComment.length}/500
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim() || newComment.length > 500 || isSubmittingComment}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-xl font-bold hover:bg-brand-dark disabled:opacity-40 transition-all shadow-md shadow-brand/10"
                                        >
                                            {isSubmittingComment ? 'Sending...' : (
                                                <>
                                                    <Send size={16} />
                                                    <span>Post Comment</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CreateLeadModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={() => {
                    api.get(`/leads/${id}`).then(res => setLead(res.data));
                }}
                initialData={lead}
            />
        </main>
    );
}