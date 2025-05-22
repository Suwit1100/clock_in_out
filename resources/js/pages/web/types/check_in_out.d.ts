export interface AttendanceForm {
    type: 'clock_in' | 'clock_out';
    branch_id: string;
    is_offsite: boolean;
    offsite_lat: string;
    offsite_lng: string;
    offsite_link: string;
    [key: string]: any;
}
