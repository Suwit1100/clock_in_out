import AlertError from '@/components/alert-error';
import AlertSuccess from '@/components/alert-success';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import MainLayout from '@/layouts/client-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { LogIn, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AttendanceForm, AttendanceRecord } from './types/check_in_out';

interface ClockPageProps {
    attendance?: AttendanceRecord;
    [key: string]: any;
}

export default function ClockInOut() {
    const { props } = usePage<ClockPageProps>();
    const successMessage = props.flash?.success;
    const branches = props.branches as { id: number; name: string }[];
    const attendance = props.attendance;

    const [isOffsite, setIsOffsite] = useState(false);
    const [now, setNow] = useState<string>(new Date().toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'medium' }));

    const { data, setData, post, processing, errors } = useForm<AttendanceForm>({
        type: attendance && attendance.clock_in_time ? 'clock_out' : 'clock_in',
        branch_id: '',
        is_offsite: false,
        lat: '',
        lng: '',
        offsite_link: '',
    });

    useEffect(() => {
        // 1. ตั้งค่าเวลาให้เปลี่ยนทุกวินาที
        const timer = setInterval(() => {
            setNow(new Date().toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'medium' }));
        }, 1000);

        // 2. ดึงตำแหน่งผู้ใช้
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
                (error) => {
                    console.error('Error getting location:', error);
                },
                { enableHighAccuracy: true },
            );
        } else {
            console.warn('Geolocation not supported');
        }

        // cleanup
        return () => clearInterval(timer);
    }, []);

    // ตั้งค่า type เมื่อ attendance เปลี่ยน
    useEffect(() => {
        const isClockedIn = attendance && attendance.clock_in_time && !attendance.clock_out_time;
        setData((prev) => ({
            ...prev,
            type: isClockedIn ? 'clock_out' : 'clock_in',
        }));
    }, [attendance]);

    const handleSubmit = () => {
        post(route('attendance.clock'), {
            onSuccess: () => {
                // handle success (reload page or show message)
            },
        });
    };

    const isClockedIn = attendance && attendance.clock_in_time && !attendance.clock_out_time;

    // console.log(isClockedIn);

    const buttonLabel = isClockedIn ? 'Clock Out' : 'Clock In';

    return (
        <MainLayout>
            <div className="flex flex-1 flex-col items-center justify-center py-12">
                <div className="text-muted-foreground mb-4 text-center text-2xl">{now}</div>
                <Card className="w-full max-w-xl shadow-md">
                    <CardContent className="space-y-4 py-6">
                        <h2 className="text-center text-xl font-semibold">ลงเวลาเข้า-ออกงาน</h2>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="offsite"
                                checked={isOffsite}
                                onCheckedChange={(checked: boolean) => {
                                    setIsOffsite(checked);
                                    setData('is_offsite', checked);
                                }}
                            />
                            <label htmlFor="offsite" className="text-sm">
                                ทำงานนอกสถานที่ (เลือก)
                            </label>
                        </div>

                        {isOffsite ? (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">ตำแหน่ง (Map หรือ Google Maps Link)</label>
                                <input
                                    type="text"
                                    className="w-full rounded border px-3 py-2"
                                    placeholder="ลิงก์ Google Maps หรือพิกัด"
                                    value={data.offsite_link}
                                    onChange={(e) => setData('offsite_link', e.target.value)}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">
                                    เลือกสาขา <span className="ms-1 text-red-500">*</span>
                                </label>
                                <Select value={data.branch_id} onValueChange={(value) => setData('branch_id', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="-- เลือกสาขา --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>สาขา</SelectLabel>
                                            {branches?.map((branch) => (
                                                <SelectItem key={branch.id} value={String(branch.id)}>
                                                    {branch.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/*  แสดงเวลาเข้างานและออกงาน */}
                        {attendance?.clock_in_time && (
                            <div className="flex items-center justify-center space-x-2 text-center text-sm text-green-700">
                                <LogIn className="h-4 w-4 text-green-700" />
                                <span>วันนี้เข้างานเวลา: {new Date(attendance.clock_in_time).toLocaleTimeString('th-TH')}</span>
                            </div>
                        )}

                        {attendance?.clock_out_time && (
                            <div className="flex items-center justify-center space-x-2 text-center text-sm text-blue-700">
                                <LogOut className="h-4 w-4 text-blue-700" />
                                <span>วันนี้ออกงานเวลา: {new Date(attendance.clock_out_time).toLocaleTimeString('th-TH')}</span>
                            </div>
                        )}

                        <div className="flex flex-col justify-end gap-2 pt-4 sm:flex-row">
                            {/* ปุ่มเขียนรายงาน */}
                            {attendance?.clock_in_time && !attendance?.clock_out_time && (
                                <Button asChild variant="secondary" className="w-full sm:w-auto">
                                    <Link href={route('daily-report.create')}>เขียน Daily Report</Link>
                                </Button>
                            )}

                            {/* ปุ่ม Clock In/Out */}
                            {!attendance?.clock_out_time && (
                                <Button onClick={handleSubmit} disabled={processing} variant="default" className="w-full sm:w-auto">
                                    {buttonLabel}
                                </Button>
                            )}
                        </div>

                        {successMessage && <AlertSuccess message={successMessage} />}

                        {Object.keys(errors).length > 0 && (
                            <AlertError
                                message={Object.values(errors)
                                    .map((e) => `• ${e}`)
                                    .join('\n')}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
