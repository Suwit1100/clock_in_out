import MainLayout from '@/layouts/client-layout';
import { Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Briefcase,
    Building,
    Calendar,
    CheckCircle,
    ClipboardList,
    Clock,
    ExternalLink,
    MapPin,
    User,
    XCircle,
} from 'lucide-react';
import { PageProps } from '../types/global';

interface DailyReportTask {
    task_type: string;
    project_name: string;
}

interface AttendanceDetail {
    id: number;
    date: string;
    clock_in_time: string | null;
    clock_out_time: string | null;
    clock_in_status: 'early' | 'on_time' | 'late' | null;
    clock_out_status: 'early' | 'on_time' | 'late' | null;
    clock_in_location_lat: string | null;
    clock_in_location_lng: string | null;
    clock_out_location_lat: string | null;
    clock_out_location_lng: string | null;
    offsite_gmap_link_in: string | null;
    offsite_gmap_link_out: string | null;
    branch_in?: { name: string } | null;
    branch_out?: { name: string } | null;
    user: { name: string };
    daily_report?: {
        summary_text: string;
        tasks: DailyReportTask[];
    } | null;
}

const StatusBadge = ({ status, type }: { status: string | null; type: 'in' | 'out' }) => {
    if (!status) return <span className="text-muted-foreground">-</span>;

    const getStatusConfig = (status: string, type: 'in' | 'out') => {
        switch (status) {
            case 'early':
                return {
                    icon: CheckCircle,
                    text: type === 'in' ? 'มาเร็ว' : 'ออกก่อนเวลา',
                    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800',
                };
            case 'on_time':
                return {
                    icon: CheckCircle,
                    text: 'ตรงเวลา',
                    className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800',
                };
            case 'late':
                return {
                    icon: AlertCircle,
                    text: type === 'in' ? 'มาสาย' : 'ออกช้า',
                    className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800',
                };
            default:
                return {
                    icon: XCircle,
                    text: '-',
                    className: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-300 dark:border-gray-800',
                };
        }
    };

    const config = getStatusConfig(status, type);
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${config.className}`}>
            <Icon className="h-3 w-3" />
            {config.text}
        </span>
    );
};

const InfoCard = ({ title, icon: Icon, children, className = '' }: { title: string; icon: any; children: React.ReactNode; className?: string }) => (
    <div className={`bg-card border-border rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}>
        <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon className="text-primary h-5 w-5" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">{title}</h3>
        </div>
        {children}
    </div>
);

const LocationLink = ({ lat, lng, gmapLink, label }: { lat: string | null; lng: string | null; gmapLink: string | null; label: string }) => {
    if (gmapLink) {
        return (
            <a
                href={gmapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 inline-flex items-center gap-2 font-medium transition-colors duration-200"
            >
                <MapPin className="h-4 w-4" />
                ลิงก์นอกสถานที่
                <ExternalLink className="h-3 w-3" />
            </a>
        );
    }

    if (lat && lng) {
        return (
            <a
                href={`https://maps.google.com/?q=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 inline-flex items-center gap-2 font-medium transition-colors duration-200"
            >
                <MapPin className="h-4 w-4" />
                แสดงพิกัด ({lat}, {lng})
                <ExternalLink className="h-3 w-3" />
            </a>
        );
    }

    return <span className="text-muted-foreground">ไม่มีข้อมูลตำแหน่ง</span>;
};

export default function Show() {
    const { attendance } = usePage<PageProps & { attendance: AttendanceDetail }>().props;

    const formatTime = (timeString: string | null) => {
        if (!timeString) return '-';
        return new Date(timeString).toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        });
    };

    return (
        <MainLayout>
            <div className="from-background via-background to-accent/5 min-h-screen bg-gradient-to-br">
                <div className="container mx-auto max-w-6xl px-4 py-8 lg:py-12">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="text-center">
                            <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                <ClipboardList className="text-primary h-8 w-8" />
                            </div>
                            <h1 className="text-foreground mb-2 text-3xl font-bold tracking-tight lg:text-4xl">รายละเอียดการเข้างาน</h1>
                            <p className="text-muted-foreground text-lg">ข้อมูลการลงเวลาประจำวัน</p>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid gap-6 lg:gap-8">
                        {/* Employee Info */}
                        <InfoCard title="ข้อมูลพนักงาน" icon={User}>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="text-muted-foreground h-5 w-5" />
                                    <div>
                                        <p className="text-muted-foreground text-sm">ชื่อพนักงาน</p>
                                        <p className="text-foreground text-lg font-semibold">{attendance.user.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-muted-foreground h-5 w-5" />
                                    <div>
                                        <p className="text-muted-foreground text-sm">วันที่</p>
                                        <p className="text-foreground text-lg font-semibold">{formatDate(attendance.date)}</p>
                                    </div>
                                </div>
                            </div>
                        </InfoCard>

                        {/* Clock In/Out Grid */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Clock In */}
                            <InfoCard title="เวลาเข้างาน" icon={Clock} className="border-l-4 border-l-green-500">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-muted-foreground h-5 w-5" />
                                        <div>
                                            <p className="text-muted-foreground text-sm">เวลา</p>
                                            <p className="text-foreground font-mono text-xl font-bold">{formatTime(attendance.clock_in_time)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Building className="text-muted-foreground h-5 w-5" />
                                        <div>
                                            <p className="text-muted-foreground text-sm">สาขา</p>
                                            <p className="text-foreground font-semibold">{attendance.branch_in?.name || 'ไม่ระบุสาขา'}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground mb-2 text-sm">สถานะ</p>
                                        <StatusBadge status={attendance.clock_in_status} type="in" />
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground mb-2 text-sm">ตำแหน่ง</p>
                                        <LocationLink
                                            lat={attendance.clock_in_location_lat}
                                            lng={attendance.clock_in_location_lng}
                                            gmapLink={attendance.offsite_gmap_link_in}
                                            label="เข้างาน"
                                        />
                                    </div>
                                </div>
                            </InfoCard>

                            {/* Clock Out */}
                            <InfoCard title="เวลาออกงาน" icon={Clock} className="border-l-4 border-l-red-500">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-muted-foreground h-5 w-5" />
                                        <div>
                                            <p className="text-muted-foreground text-sm">เวลา</p>
                                            <p className="text-foreground font-mono text-xl font-bold">{formatTime(attendance.clock_out_time)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Building className="text-muted-foreground h-5 w-5" />
                                        <div>
                                            <p className="text-muted-foreground text-sm">สาขา</p>
                                            <p className="text-foreground font-semibold">{attendance.branch_out?.name || 'ไม่ระบุสาขา'}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground mb-2 text-sm">สถานะ</p>
                                        <StatusBadge status={attendance.clock_out_status} type="out" />
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground mb-2 text-sm">ตำแหน่ง</p>
                                        <LocationLink
                                            lat={attendance.clock_out_location_lat}
                                            lng={attendance.clock_out_location_lng}
                                            gmapLink={attendance.offsite_gmap_link_out}
                                            label="ออกงาน"
                                        />
                                    </div>
                                </div>
                            </InfoCard>
                        </div>

                        {/* Daily Report */}
                        <InfoCard title="สรุปรายวัน" icon={Briefcase} className="border-l-primary border-l-4">
                            {attendance.daily_report ? (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-muted-foreground mb-2 text-sm">สรุปการทำงาน</p>
                                        <div className="bg-muted/50 border-border/50 rounded-lg border p-4">
                                            <p className="text-foreground leading-relaxed">
                                                {attendance.daily_report?.summary_text?.trim() ? attendance.daily_report.summary_text : 'ไม่ได้ระบุ'}
                                            </p>
                                        </div>
                                    </div>

                                    {attendance.daily_report.tasks && attendance.daily_report.tasks.length > 0 && (
                                        <div>
                                            <p className="text-muted-foreground mb-3 text-sm">งานที่ทำ</p>
                                            <div className="grid gap-3">
                                                {attendance.daily_report.tasks.map((task: DailyReportTask, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="bg-accent/20 border-accent/30 hover:bg-accent/30 rounded-lg border p-4 transition-colors duration-200"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="bg-primary/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                                                                <span className="text-primary text-xs font-bold">{index + 1}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-foreground mb-1 font-semibold">{task.task_type}</p>
                                                                <p className="text-muted-foreground">{task.project_name}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <div className="bg-muted/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                        <ClipboardList className="text-muted-foreground h-8 w-8" />
                                    </div>
                                    <p className="text-muted-foreground">ไม่มีรายงานประจำวัน</p>
                                    <p className="text-muted-foreground mt-1 text-sm">ยังไม่ได้บันทึกสรุปการทำงานประจำวันนี้</p>
                                </div>
                            )}
                        </InfoCard>
                    </div>

                    {/* Back Button */}
                    <div className="mt-8 text-center">
                        <Link
                            href={route('history.index')}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            กลับไปประวัติการลงเวลา
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
