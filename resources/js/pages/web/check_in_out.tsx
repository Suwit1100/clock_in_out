import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/layouts/client-layout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { AttendanceForm } from './types/check_in_out';

export default function ClockInOut() {
    const [isOffsite, setIsOffsite] = useState(false);

    const { data, setData, post, processing, errors } = useForm<AttendanceForm>({
        type: 'clock_in',
        branch_id: '',
        is_offsite: false,
        offsite_lat: '',
        offsite_lng: '',
        offsite_link: '',
    });

    const handleSubmit = (type: 'clock_in' | 'clock_out') => {
        setData('type', type);
        post(route('attendance.clock'), {
            onSuccess: () => {
                // handle success
            },
        });
    };

    return (
        <MainLayout>
            <div className="flex flex-1 items-center justify-center py-12">
                <Card className="w-full max-w-xl shadow-md">
                    <CardContent className="space-y-4 py-6">
                        <h2 className="text-center text-xl font-semibold">ลงเวลาเข้า-ออกงาน</h2>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={isOffsite}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setIsOffsite(checked);
                                    setData('is_offsite', checked);
                                }}
                            />
                            <label>ทำงานนอกสถานที่</label>
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
                                <select
                                    className="w-full rounded border px-3 py-2"
                                    value={data.branch_id}
                                    onChange={(e) => setData('branch_id', e.target.value)}
                                >
                                    <option value="">-- เลือกสาขา --</option>
                                    <option value="1">สำนักงานใหญ่</option>
                                    <option value="2">สาขาเชียงใหม่</option>
                                </select>
                            </div>
                        )}

                        <div className="flex justify-center space-x-4 pt-4">
                            <Button onClick={() => handleSubmit('clock_in')} disabled={processing}>
                                Clock In
                            </Button>
                            <Button onClick={() => handleSubmit('clock_out')} disabled={processing} variant="secondary">
                                Clock Out
                            </Button>
                        </div>

                        {Object.keys(errors).length > 0 && (
                            <div className="text-sm text-red-500">
                                {Object.values(errors).map((error, i) => (
                                    <div key={i}>{error}</div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
