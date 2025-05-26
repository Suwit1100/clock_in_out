export interface FlashProps {
    success?: string;
    error?: string;
}

export interface PageProps {
    flash?: FlashProps;
    errors?: Record<string, string>;
    [key: string]: any;
}
