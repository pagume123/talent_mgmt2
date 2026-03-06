export type RequestStatus = 'pending' | 'approved' | 'denied';
export type RequestType = 'leave' | 'expense' | 'other';

export interface LeaveRequest {
    id: string;
    profile_id: string;
    company_id: string;
    type: RequestType;
    status: RequestStatus;
    details: {
        startDate: string;
        endDate: string;
        reason: string;
        [key: string]: any;
    };
    created_at: string;
}

export interface Perk {
    id: string;
    company_id: string;
    title: string;
    description: string;
    value: string;
    created_at: string;
}
