// -----------------------------
// External Libraries
// -----------------------------
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import * as yup from 'yup';

// -----------------------------
// Icons
// -----------------------------
import { Building2, Calendar, Clock, FileText, LogIn, LogOut, MapPin } from 'lucide-react';

// -----------------------------
// UI Components
// -----------------------------
import AlertError from '@/components/alert-error';
import AlertSuccess from '@/components/alert-success';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// -----------------------------
// Layout
// -----------------------------
import MainLayout from '@/layouts/client-layout';

// -----------------------------
// Types
// -----------------------------
import ConfirmDialog from '@/components/confirm-dialog';
import WarningDialog from '@/components/warning-dialog';
import { AttendanceForm, AttendanceRecord, Branch } from './types/check_in_out';

// -----------------------------
// Interfaces
// -----------------------------
interface ClockPageProps {
    attendance?: AttendanceRecord;
    [key: string]: any;
}

// -----------------------------
// Yup Validation Schema
// -----------------------------
const attendanceSchema = yup.object().shape({
    type: yup.string().oneOf(['clock_in', 'clock_out'], 'ประเภทไม่ถูกต้อง').required('กรุณาระบุประเภท'),
    is_offsite: yup.boolean().required('กรุณาระบุสถานที่ทำงาน'),

    offsite_link: yup
        .string()
        .url('กรุณากรอกลิงก์ที่ถูกต้อง')
        .nullable()
        .when('is_offsite', {
            is: true,
            then: (schema) => schema.required('กรุณากรอกลิงก์สถานที่ทำงานนอกสถานที่'),
            otherwise: (schema) => schema.notRequired(),
        }),

    branch_id: yup
        .string()
        .nullable()
        .when('is_offsite', {
            is: false,
            then: (schema) => schema.required('กรุณาเลือกสาขา'),
            otherwise: (schema) => schema.notRequired(),
        }),

    lat: yup
        .string()
        .nullable()
        .when('is_offsite', {
            is: false,
            then: (schema) => schema.required('พิกัด lat จำเป็นเมื่อทำงานในสถานที่'),
            otherwise: (schema) => schema.notRequired(),
        }),

    lng: yup
        .string()
        .nullable()
        .when('is_offsite', {
            is: false,
            then: (schema) => schema.required('พิกัด lng จำเป็นเมื่อทำงานในสถานที่'),
            otherwise: (schema) => schema.notRequired(),
        }),
});

// -----------------------------
// Main Component
// -----------------------------
export default function ClockInOut() {
    // ---------- Page Props ----------
    const { props } = usePage<ClockPageProps>();
    const successMessage = props.flash?.success;
    const branches = props.branches as Branch[];

    const attendance = props.attendance;

    // ---------- State ----------
    const [isOffsite, setIsOffsite] = useState(false);
    const [now, setNow] = useState<string>(new Date().toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'medium' }));

    const { data, setData, post, processing, errors } = useForm<AttendanceForm>({
        type: attendance?.clock_in_time ? 'clock_out' : 'clock_in',
        branch_id: '',
        is_offsite: false,
        lat: '',
        lng: '',
        offsite_link: '',
    });

    type ClientErrorMap = Partial<Record<keyof AttendanceForm, string>>;
    const [clientErrors, setClientErrors] = useState<ClientErrorMap>({});

    const clearClientError = (field: keyof AttendanceForm) => {
        if (clientErrors[field]) {
            setClientErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const [showEarlyDialog, setShowEarlyDialog] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState(false);
    const [showMissingReportDialog, setShowMissingReportDialog] = useState(false);

    // ---------- useEffect: Current Time Clock ----------
    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date().toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'medium' }));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // ---------- useEffect: Get User Geolocation ----------
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setData((prev) => ({
                        ...prev,
                        lat: latitude.toString(),
                        lng: longitude.toString(),
                    }));
                },
                (error) => console.error('Error getting location:', error),
                { enableHighAccuracy: true },
            );
        } else {
            console.warn('Geolocation not supported');
        }
    }, []);

    // ---------- useEffect: Update Type based on attendance ----------
    useEffect(() => {
        const isClockedIn = attendance && attendance.clock_in_time && !attendance.clock_out_time;
        setData((prev) => ({ ...prev, type: isClockedIn ? 'clock_out' : 'clock_in' }));
    }, [attendance]);

    // ---------- Form Submission ----------
    const handleSubmit = async () => {
        try {
            await attendanceSchema.validate(data, { abortEarly: false });

            const isClockingOut = data.type === 'clock_out';
            const selectedBranch = branches.find((b) => String(b.id) === data.branch_id);

            if (isClockingOut && attendance && !attendance.daily_report) {
                setShowMissingReportDialog(true);
                return;
            }

            if (isClockingOut && selectedBranch && !isOffsite) {
                const now = new Date();
                const [endHour, endMinute] = selectedBranch.work_end_time.split(':');
                const todayEndTime = new Date();
                todayEndTime.setHours(Number(endHour), Number(endMinute), 0, 0);

                if (now < todayEndTime) {
                    setShowEarlyDialog(true); // แสดง dialog
                    setPendingSubmit(true); // รอให้ user ยืนยัน
                    return;
                }
            }

            // ถ้าไม่เข้าเงื่อนไขใด ๆ ก็ส่งเลย
            post(route('attendance.clock'), {
                onSuccess: () => {
                    // success logic
                },
            });
        } catch (err: any) {
            if (err.inner) {
                const formErrors: Record<string, string> = {};
                err.inner.forEach((e: any) => {
                    if (e.path) formErrors[e.path] = e.message;
                });
                setClientErrors(formErrors);
            }
        }
    };

    const isClockedIn = attendance && attendance.clock_in_time && !attendance.clock_out_time;
    const buttonLabel = isClockedIn ? 'Clock Out' : 'Clock In';

    // ---------- JSX (Return) ----------
    return (
        <MainLayout>
            <div className="from-background via-background to-accent/5 min-h-screen bg-gradient-to-br">
                <div className="container mx-auto px-4 py-8 lg:py-12">
                    {/* Header Section with Time Display */}
                    <div className="mb-8 text-center">
                        <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <Clock className="text-primary h-8 w-8" />
                        </div>
                        <h1 className="text-foreground mb-2 text-3xl font-bold tracking-tight lg:text-4xl">ลงเวลาเข้า-ออกงาน</h1>
                        <div className="bg-card/80 inline-flex items-center gap-2 rounded-full border px-6 py-3 shadow-md backdrop-blur-sm">
                            <Calendar className="text-primary h-5 w-5" />
                            <span className="text-foreground text-lg font-medium">{now}</span>
                        </div>
                    </div>

                    {/* Alert Messages */}
                    <div className="mx-auto mb-6 max-w-2xl space-y-4">
                        {successMessage && <AlertSuccess message={successMessage} />}
                        {Object.keys(errors).length > 0 && (
                            <AlertError
                                message={Object.values(errors)
                                    .map((e) => `• ${e}`)
                                    .join('\n')}
                            />
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="mx-auto max-w-2xl">
                        <Card className="bg-card/95 overflow-hidden border-0 shadow-2xl backdrop-blur-sm">
                            <CardHeader className="">
                                <div className="text-center">
                                    {/* Status Display */}
                                    {attendance?.clock_in_time && !attendance?.clock_out_time && (
                                        <Badge className="bg-green-100 px-4 py-2 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                            <LogIn className="mr-2 h-4 w-4" />
                                            กำลังทำงาน
                                        </Badge>
                                    )}
                                    {attendance?.clock_out_time && (
                                        <Badge className="bg-blue-100 px-4 py-2 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            ทำงานเสร็จแล้ว
                                        </Badge>
                                    )}
                                    {!attendance?.clock_in_time && (
                                        <Badge variant="outline" className="px-4 py-2">
                                            <Clock className="mr-2 h-4 w-4" />
                                            ยังไม่ได้เข้างาน
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6 p-6 lg:p-8">
                                {/* Work Location Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="offsite"
                                            checked={isOffsite}
                                            onCheckedChange={(checked: boolean) => {
                                                setIsOffsite(checked);
                                                setData('is_offsite', checked);
                                            }}
                                        />
                                        <Label htmlFor="offsite" className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                                            <MapPin className="text-primary h-4 w-4" />
                                            ทำงานนอกสถานที่ (เลือก)
                                        </Label>
                                    </div>

                                    {isOffsite ? (
                                        <Card className="border-primary/20 bg-primary/5 border-2 border-dashed">
                                            <CardContent className="space-y-3 p-4">
                                                <Label htmlFor="offsite-link" className="flex items-center gap-2 text-sm font-medium">
                                                    <MapPin className="text-primary h-4 w-4" />
                                                    ตำแหน่ง (Map หรือ Google Maps Link)
                                                </Label>
                                                <Input
                                                    id="offsite-link"
                                                    type="text"
                                                    placeholder="ลิงก์ Google Maps "
                                                    value={data.offsite_link}
                                                    onChange={(e) => {
                                                        setData('offsite_link', e.target.value);
                                                        clearClientError('offsite_link');
                                                    }}
                                                    className="h-11"
                                                />

                                                {clientErrors.offsite_link && (
                                                    <p className="mt-1 text-sm text-red-500">{clientErrors.offsite_link}</p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card className="border-secondary/20 bg-secondary/5 border-2 border-dashed">
                                            <CardContent className="space-y-3 p-4">
                                                <Label htmlFor="branch-select" className="flex items-center gap-2 text-sm font-medium">
                                                    <Building2 className="text-secondary h-4 w-4" />
                                                    เลือกสาขา
                                                    <span className="text-destructive">*</span>
                                                </Label>
                                                <Select
                                                    value={data.branch_id}
                                                    onValueChange={(value) => {
                                                        setData('branch_id', value);
                                                        clearClientError('branch_id');
                                                    }}
                                                >
                                                    <SelectTrigger id="branch-select" className="h-11">
                                                        <SelectValue placeholder="-- เลือกสาขา --" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>สาขา</SelectLabel>
                                                            {branches?.map((branch) => (
                                                                <SelectItem key={branch.id} value={String(branch.id)}>
                                                                    <div className="flex items-center gap-2">
                                                                        <Building2 className="text-secondary h-4 w-4" />
                                                                        {branch.name}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>

                                                {clientErrors.branch_id && <p className="mt-1 text-sm text-red-500">{clientErrors.branch_id}</p>}
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>

                                {/* Attendance Status Section */}
                                {(attendance?.clock_in_time || attendance?.clock_out_time) && (
                                    <>
                                        <Separator />
                                        <div className="space-y-4">
                                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                                <Clock className="text-primary h-5 w-5" />
                                                สถานะการทำงานวันนี้
                                            </h3>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {attendance?.clock_in_time && (
                                                    <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-center gap-3 text-center">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                                                    <LogIn className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                                                                        เข้างานเวลา
                                                                    </p>
                                                                    <p className="text-lg font-bold text-green-900 dark:text-green-200">
                                                                        {new Date(attendance.clock_in_time).toLocaleTimeString('th-TH')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )}

                                                {attendance?.clock_out_time && (
                                                    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-center gap-3 text-center">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                                                    <LogOut className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">ออกงานเวลา</p>
                                                                    <p className="text-lg font-bold text-blue-900 dark:text-blue-200">
                                                                        {new Date(attendance.clock_out_time).toLocaleTimeString('th-TH')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-1">
                                                {attendance?.daily_report ? (
                                                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        เขียน Daily Report แล้ว
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-muted-foreground">
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        ยังไม่ได้เขียน Daily Report
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-end">
                                    {/* ปุ่มเขียนรายงาน */}
                                    {attendance?.clock_in_time && !attendance?.clock_out_time && (
                                        <Button asChild variant="outline" className="hover:bg-accent/50 h-12 w-full border-2 px-6 sm:w-auto">
                                            <Link
                                                href={
                                                    attendance.daily_report
                                                        ? route('daily-report.edit', attendance.daily_report.id)
                                                        : route('daily-report.create')
                                                }
                                            >
                                                <FileText className="mr-2 h-4 w-4" />
                                                {attendance.daily_report ? 'แก้ไข Daily Report' : 'เขียน Daily Report'}
                                            </Link>
                                        </Button>
                                    )}

                                    {/* ปุ่ม Clock In/Out */}
                                    {!attendance?.clock_out_time && (
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={processing}
                                            variant="default"
                                            className="bg-primary hover:bg-primary/90 h-12 w-full px-8 shadow-lg sm:w-auto"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="border-primary-foreground/20 border-t-primary-foreground mr-2 h-4 w-4 animate-spin rounded-full border-2" />
                                                    กำลังบันทึก...
                                                </>
                                            ) : (
                                                <>
                                                    {isClockedIn ? <LogOut className="mr-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" />}
                                                    {buttonLabel}
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={showEarlyDialog}
                message="คุณกำลังจะออกก่อนเวลาเลิกงาน คุณต้องการดำเนินการต่อหรือไม่?"
                onConfirm={() => {
                    setShowEarlyDialog(false);
                    setPendingSubmit(false);
                    post(route('attendance.clock'), {
                        onSuccess: () => {
                            // success logic
                        },
                    });
                }}
                onCancel={() => {
                    setShowEarlyDialog(false);
                    setPendingSubmit(false);
                }}
            />

            <WarningDialog
                open={showMissingReportDialog}
                message="คุณยังไม่ได้เขียน Daily Report สำหรับวันนี้ กรุณากรอกก่อนออกงาน"
                onConfirm={() => router.visit(route('daily-report.create'))}
                onCancel={() => setShowMissingReportDialog(false)}
            />
        </MainLayout>
    );
}
