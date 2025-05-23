import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import MainLayout from '@/layouts/client-layout';
import { useForm, usePage } from '@inertiajs/react';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
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
        const timer = setInterval(() => {
            setNow(new Date().toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'medium' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            console.warn('Geolocation not supported');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setData('lat', latitude.toString());
                setData('lng', longitude.toString());
            },
            (error) => {
                console.error('Error getting location:', error);
            },
            { enableHighAccuracy: true },
        );
    }, []);

    const handleSubmit = () => {
        post(route('attendance.clock'), {
            onSuccess: () => {
                // handle success (reload page or show message)
            },
        });
    };

    const isClockedIn = attendance && attendance.clock_in_time && !attendance.clock_out_time;
    const buttonLabel = isClockedIn ? 'Clock Out' : 'Clock In';

    return (
        <MainLayout>
            <div className="flex flex-1 items-center justify-center py-12">
                <Card className="w-full max-w-xl shadow-md">
                    <CardContent className="space-y-4 py-6">
                        <h2 className="text-center text-xl font-semibold">ลงเวลาเข้า-ออกงาน</h2>
                        <div className="text-muted-foreground text-center text-sm">{now}</div>

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
                                ทำงานนอกสถานที่
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
                                <label className="block text-sm font-medium">เลือกสาขา</label>
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

                        <div className="flex justify-center pt-4">
                            <Button onClick={handleSubmit} disabled={processing}>
                                {buttonLabel}
                            </Button>
                        </div>

                        {successMessage && (
                            <Alert className="border-green-300 bg-green-100 text-green-800">
                                <CheckCircleIcon className="h-5 w-5" />
                                <AlertTitle>สำเร็จ</AlertTitle>
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        )}

                        {Object.keys(errors).length > 0 && (
                            <Alert variant="destructive" className="border-red-300 bg-red-100 text-red-800">
                                <XCircleIcon className="h-5 w-5" />
                                <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
                                <AlertDescription>
                                    {Object.values(errors).map((error, i) => (
                                        <div key={i}>{error}</div>
                                    ))}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
