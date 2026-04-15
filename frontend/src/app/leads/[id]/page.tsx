"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Building2, Mail, DollarSign, Calendar } from 'lucide-react';
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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this lead?")) return;
        try {
            await api.delete(`/leads/${id}`);
            router.push('/');
        } catch (e) {
            alert("Failed to delete lead");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leadRes, commentsRes] = await Promise.all([
                    api.get(`/leads/${id}`),
                    api.get(`/leads/${id}/comments`)
                ]);
                setLead(leadRes.data);
                setComments(commentsRes.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await api.post(`/leads/${id}/comments`, { text: newComment });
            setComments([res.data, ...comments]);
            setNewComment('');
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading details...</div>;
    if (!lead) return <div className="p-8 text-center text-rose-500 font-bold">Lead not found</div>;

    return (
        <main className="min-h-screen bg-surface p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Back Button */}
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-brand transition-colors font-medium">
                    <ArrowLeft size={20} />
                    Back to list
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Info Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="space-y-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusStyles(lead.status)}`}>
                  {lead.status}
                </span>
                                <h1 className="text-2xl font-bold text-slate-900">{lead.name}</h1>

                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Mail size={18} className="text-slate-400" />
                                        <span className="text-sm">{lead.email || 'No email'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Building2 size={18} className="text-slate-400" />
                                        <span className="text-sm font-medium">{lead.company || 'Private person'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <DollarSign size={18} className="text-slate-400" />
                                        <span className="text-sm font-bold text-slate-900">{lead.value ? `$${lead.value}` : 'No value'}</span>
                                    </div>
                                    <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col gap-3 items-center">
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all text-sm"
                                        >
                                            Edit Lead Info
                                        </button>

                                        <button
                                            onClick={handleDelete}
                                            className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors uppercase tracking-widest"
                                        >
                                            Delete Lead
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Comments Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="font-bold text-slate-900 text-lg">Activity & Comments</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment._id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-xs shrink-0">
                                            U
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900 text-sm">User</span>
                                                <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-2xl rounded-tl-none">
                                                {comment.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {comments.length === 0 && (
                                    <div className="text-center py-10 text-slate-400 text-sm italic">No comments yet...</div>
                                )}
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                                <form onSubmit={handleAddComment} className="relative">
                                    <input
                                        placeholder="Type a comment..."
                                        className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm text-slate-900"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors">
                                        <Send size={16} />
                                    </button>
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