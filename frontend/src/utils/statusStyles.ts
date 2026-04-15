import { LeadStatus } from '@/types/lead';

export const getStatusStyles = (status: LeadStatus) => {
    switch (status) {
        case LeadStatus.NEW:
            return "bg-emerald-100 text-emerald-700";
        case LeadStatus.CONTACTED:
            return "bg-amber-100 text-amber-700";
        case LeadStatus.IN_PROGRESS:
            return "bg-blue-100 text-blue-700";
        case LeadStatus.WON:
            return "bg-brand text-white";
        case LeadStatus.LOST:
            return "bg-rose-100 text-rose-700";
        default:
            return "bg-slate-100 text-slate-700";
    }
};