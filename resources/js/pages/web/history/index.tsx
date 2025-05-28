import { SingleDatePicker } from '@/components/single-datepicker';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import MainLayout from '@/layouts/client-layout';
import { Link, router, usePage } from '@inertiajs/react';
import { formatISO } from 'date-fns';
import { Building2, CalendarDays, Clock, Eye, Filter, MapPin, Minus, RotateCcw, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { PageProps } from '../types/global';

interface AttendanceRecord {
    id: number;
    date: string;
    clock_in_time: string | null;
    clock_out_time: string | null;
    clock_in_status: 'early' | 'on_time' | 'late' | null;
    clock_out_status: 'early' | 'on_time' | 'late' | null;
    offsite_gmap_link_in: string | null;
    offsite_gmap_link_out: string | null;
    clock_in_location_lat: string | null;
    clock_in_location_lng: string | null;
    clock_out_location_lat: string | null;
    clock_out_location_lng: string | null;
    branch_in?: { name: string } | null;
    branch_out?: { name: string } | null;
}

export default function AttendanceHistory() {
    const { props } = usePage<PageProps & { attendances: { data: AttendanceRecord[] }; filters?: any }>();
    const attendances = props.attendances.data;
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showDateError, setShowDateError] = useState(false);

    const handleFilter = () => {
        if (startDate && endDate && startDate > endDate) {
            setShowDateError(true);
            return;
        }

        router.get(
            route('history.index'),
            {
                start_date: startDate ? formatISO(startDate, { representation: 'date' }) : undefined,
                end_date: endDate ? formatISO(endDate, { representation: 'date' }) : undefined,
                sort: sortOrder,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const resetFilters = () => {
        setSortOrder('desc');
        setStartDate(null);
        setEndDate(null);

        router.get(
            route('history.index'),
            {},
            {
                replace: true, // ล้างประวัติ URL เดิม
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'early':
                return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
            case 'on_time':
                return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
            case 'late':
                return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
            default:
                return 'text-muted-foreground bg-muted';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'early':
                return <TrendingUp className="h-3 w-3" />;
            case 'on_time':
                return <Clock className="h-3 w-3" />;
            case 'late':
                return <TrendingDown className="h-3 w-3" />;
            default:
                return <Minus className="h-3 w-3" />;
        }
    };

    const getStatusText = (status: string, type: 'in' | 'out') => {
        if (type === 'in') {
            switch (status) {
                case 'early':
                    return 'มาเร็ว';
                case 'on_time':
                    return 'ตรงเวลา';
                case 'late':
                    return 'มาสาย';
                default:
                    return '-';
            }
        } else {
            switch (status) {
                case 'early':
                    return 'ออกก่อนเวลา';
                case 'on_time':
                    return 'ตรงเวลา';
                case 'late':
                    return 'ออกช้า';
                default:
                    return '-';
            }
        }
    };

    return (
        <MainLayout>
            <div className="from-background via-background to-accent/5 min-h-screen bg-gradient-to-br">
                <div className="container mx-auto px-4 py-8 lg:py-12">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <CalendarDays className="text-primary h-8 w-8" />
                        </div>
                        <h1 className="text-foreground text-3xl font-bold tracking-tight lg:text-4xl">ประวัติการลงเวลา</h1>
                        <p className="text-muted-foreground mt-2">ข้อมูลการลงเวลาของคุณพร้อมรายละเอียดครบถ้วน</p>
                    </div>

                    {/* Filter Section */}
                    <div className="border-border bg-card/50 mb-8 rounded-2xl border p-6 shadow-sm backdrop-blur-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <Filter className="text-primary h-5 w-5" />
                            <h2 className="text-foreground text-lg font-semibold">ตัวกรองข้อมูล</h2>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-4">
                            {/* วันที่ */}
                            <div className="lg:col-span-2">
                                <label className="text-foreground mb-3 block text-sm font-medium">เลือกช่วงวันที่</label>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <SingleDatePicker date={startDate} onChange={setStartDate} placeholder="วันที่เริ่มต้น" />
                                    <SingleDatePicker date={endDate} onChange={setEndDate} placeholder="วันที่สิ้นสุด" />
                                </div>
                            </div>

                            {/* เรียงลำดับ */}
                            <div>
                                <label className="text-foreground mb-3 block text-sm font-medium">เรียงลำดับ</label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                                    className="border-border bg-background hover:border-ring focus:border-ring focus:ring-ring/20 w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                                >
                                    <option value="desc">ล่าสุดก่อน</option>
                                    <option value="asc">เก่าสุดก่อน</option>
                                </select>
                            </div>

                            {/* ปุ่ม */}
                            <div className="flex flex-col justify-end gap-3 sm:flex-row lg:flex-col">
                                <button
                                    onClick={handleFilter}
                                    className="focus:ring-ring flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-medium text-black shadow-sm transition-all duration-200 hover:bg-yellow-500 hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                >
                                    <Filter className="h-4 w-4" />
                                    กรองข้อมูล
                                </button>
                                <button
                                    onClick={resetFilters}
                                    className="border-border bg-muted text-foreground hover:bg-muted/70 focus:ring-ring flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    รีเซ็ต
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {attendances.length === 0 ? (
                        <div className="border-border bg-card/50 rounded-2xl border p-12 text-center shadow-sm backdrop-blur-sm">
                            <CalendarDays className="text-muted-foreground/50 mx-auto mb-4 h-16 w-16" />
                            <p className="text-muted-foreground text-lg">ยังไม่มีข้อมูลการลงเวลา</p>
                        </div>
                    ) : (
                        <div className="border-border bg-card/50 overflow-hidden rounded-2xl border shadow-sm backdrop-blur-sm">
                            <ScrollArea className="w-full max-w-full">
                                <div className="min-w-[1200px]">
                                    {' '}
                                    {/* ปรับตามความกว้าง table จริง */}
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-border bg-muted/50 border-b">
                                                <th className="text-foreground min-w-[200px] px-6 py-4 text-left text-sm font-semibold">วันที่</th>
                                                <th className="text-foreground min-w-[200px] px-6 py-4 text-left text-sm font-semibold">เวลาเข้า</th>
                                                <th className="text-foreground min-w-[200px] px-6 py-4 text-left text-sm font-semibold">สาขาเข้า</th>
                                                <th className="text-foreground min-w-[200px] px-6 py-4 text-left text-sm font-semibold">สถานะเข้า</th>
                                                <th className="text-foreground min-w-[200px] px-6 py-4 text-left text-sm font-semibold">พิกัดเข้า</th>
                                                <th className="text-foreground min-w-[200px] px-6 py-4 text-left text-sm font-semibold">เวลาออก</th>
                                                <th className="text-foreground min-w-[200px] px-6 py-4 text-left text-sm font-semibold">สาขาออก</th>
                                                <th className="text-foreground min-w-[200px] px-6 py-4 text-left text-sm font-semibold">สถานะออก</th>
                                                <th className="text-foreground min-w-[200px] px-6 py-4 text-left text-sm font-semibold">พิกัดออก</th>
                                                <th className="text-foreground min-w-[200px] px-6 py-4 text-left text-sm font-semibold">
                                                    การดำเนินการ
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendances.map((a, index) => (
                                                <tr
                                                    key={a.id}
                                                    className={`border-border/50 hover:bg-muted/20 border-b transition-colors duration-200 ${
                                                        index % 2 === 0 ? 'bg-background/50' : 'bg-card/30'
                                                    }`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="text-foreground font-medium">
                                                            {new Date(a.date).toLocaleDateString('th-TH', {
                                                                weekday: 'short',
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="text-muted-foreground h-4 w-4" />
                                                            <span className="text-foreground text-sm">
                                                                {a.clock_in_time
                                                                    ? new Date(a.clock_in_time).toLocaleTimeString('th-TH', {
                                                                          hour: '2-digit',
                                                                          minute: '2-digit',
                                                                      })
                                                                    : '-'}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {a.branch_in ? (
                                                            <div className="flex items-center gap-2">
                                                                <Building2 className="text-primary h-4 w-4" />
                                                                <span className="text-foreground text-sm font-medium">{a.branch_in.name}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">-</span>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(a.clock_in_status || '')}`}
                                                        >
                                                            {getStatusIcon(a.clock_in_status || '')}
                                                            {getStatusText(a.clock_in_status || '', 'in')}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {a.offsite_gmap_link_in ? (
                                                            <a
                                                                href={a.offsite_gmap_link_in}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                            >
                                                                <MapPin className="h-3 w-3" />
                                                                นอกสถานที่
                                                            </a>
                                                        ) : a.clock_in_location_lat && a.clock_in_location_lng ? (
                                                            <a
                                                                href={`https://maps.google.com/?q=${a.clock_in_location_lat},${a.clock_in_location_lng}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                                                            >
                                                                <MapPin className="h-3 w-3" />
                                                                ดูพิกัด
                                                            </a>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">-</span>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="text-muted-foreground h-4 w-4" />
                                                            <span className="text-foreground text-sm">
                                                                {a.clock_out_time
                                                                    ? new Date(a.clock_out_time).toLocaleTimeString('th-TH', {
                                                                          hour: '2-digit',
                                                                          minute: '2-digit',
                                                                      })
                                                                    : '-'}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {a.branch_out ? (
                                                            <div className="flex items-center gap-2">
                                                                <Building2 className="text-primary h-4 w-4" />
                                                                <span className="text-foreground text-sm font-medium">{a.branch_out.name}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">-</span>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(a.clock_out_status || '')}`}
                                                        >
                                                            {getStatusIcon(a.clock_out_status || '')}
                                                            {getStatusText(a.clock_out_status || '', 'out')}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {a.offsite_gmap_link_out ? (
                                                            <a
                                                                href={a.offsite_gmap_link_out}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                            >
                                                                <MapPin className="h-3 w-3" />
                                                                นอกสถานที่
                                                            </a>
                                                        ) : a.clock_out_location_lat && a.clock_out_location_lng ? (
                                                            <a
                                                                href={`https://maps.google.com/?q=${a.clock_out_location_lat},${a.clock_out_location_lng}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                                                            >
                                                                <MapPin className="h-3 w-3" />
                                                                ดูพิกัด
                                                            </a>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">-</span>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <button className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none">
                                                            <Eye className="h-3 w-3" />
                                                            <Link href={route('history.show', a.id)}> ดูรายละเอียด {a.id}</Link>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <ScrollBar orientation="horizontal" className="!opacity-100 !transition-none" />
                            </ScrollArea>
                        </div>
                    )}
                </div>

                {/* Error Dialog */}
                <AlertDialog open={showDateError} onOpenChange={setShowDateError}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>ไม่สามารถกรองข้อมูลได้</AlertDialogTitle>
                            <AlertDialogDescription>วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด กรุณาเลือกใหม่อีกครั้ง</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setShowDateError(false)}>ตกลง</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </MainLayout>
    );
}
