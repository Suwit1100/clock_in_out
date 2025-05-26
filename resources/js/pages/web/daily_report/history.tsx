import MainLayout from '@/layouts/client-layout';
import { usePage } from '@inertiajs/react';
import { PageProps } from '../types/global';

interface AttendanceRecord {
    id: number;
    date: string;
    clock_in_time: string | null;
    clock_out_time: string | null;
    status: string | null;
}

export default function AttendanceHistory() {
    const { props } = usePage<PageProps & { attendances: { data: AttendanceRecord[] } }>();

    const attendances = props.attendances.data;

    return (
        <MainLayout>
            <div className="mx-auto max-w-5xl py-10">
                <h2 className="mb-4 text-2xl font-bold">ประวัติการลงเวลา</h2>

                {attendances.length === 0 ? (
                    <p className="text-muted-foreground">ยังไม่มีข้อมูลการลงเวลา</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="border-border w-full table-auto border text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-2 text-left">วันที่</th>
                                    <th className="px-4 py-2 text-left">เวลาเข้า</th>
                                    <th className="px-4 py-2 text-left">เวลาออก</th>
                                    <th className="px-4 py-2 text-left">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.map((a) => (
                                    <tr key={a.id} className="border-t">
                                        <td className="px-4 py-2">{new Date(a.date).toLocaleDateString('th-TH')}</td>
                                        <td className="px-4 py-2">{a.clock_in_time ? new Date(a.clock_in_time).toLocaleTimeString('th-TH') : '-'}</td>
                                        <td className="px-4 py-2">
                                            {a.clock_out_time ? new Date(a.clock_out_time).toLocaleTimeString('th-TH') : '-'}
                                        </td>
                                        <td className="px-4 py-2 capitalize">{a.status ?? '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
