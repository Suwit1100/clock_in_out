export interface AttendanceForm {
    type: 'clock_in' | 'clock_out';
    branch_id: string;
    is_offsite: boolean;
    lat: string;
    lng: string;
    offsite_link: string;
    [key: string]: any;
}

export interface AttendanceRecord {
    id: number;
    user_id: number;
    date: string;
    branch_id: number;
    is_offsite: boolean;
    offsite_latitude: string | null;
    offsite_longitude: string | null;
    offsite_gmap_link: string | null;
    clock_in_time: string | null;
    clock_in_location_lat: string | null;
    clock_in_location_lng: string | null;
    clock_out_time: string | null;
    clock_out_location_lat: string | null;
    clock_out_location_lng: string | null;
    status: string | null;
}
