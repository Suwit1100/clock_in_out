export interface FlashProps {
    success?: string | null;
    error?: string | null;
    warning_confirm?: string | null;
}

export interface User {
    id: number;
    employee_code: string | null;
    name: string;
    email: string;
    email_verified_at: string | null;
    google_id: string;
    avatar_url: string;
    display_name: string;
    created_at: string;
    updated_at: string;
}

export interface AuthProps {
    user: User | null;
}

export interface Quote {
    message: string;
    author: string;
}

export interface PageProps {
    errors: Record<string, string>;
    name: string;
    quote: Quote;
    auth: AuthProps;
    ziggy: any; // หรือกำหนด type ละเอียดกว่านี้ได้
    sidebarOpen: boolean;
    flash: FlashProps;
    dailyReportId?: number;
    canWriteReport: boolean;
    [key: string]: any;
}
