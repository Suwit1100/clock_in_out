import AlertError from '@/components/alert-error';
import AlertSuccess from '@/components/alert-success';
import AlertWarning from '@/components/alert-warning';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import MainLayout from '@/layouts/client-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { DailyReportForm, Task } from '../types/daily_report';
import { PageProps } from '../types/global';

interface Props extends PageProps {
    report: {
        id: number;
        summary_text: string;
        tasks: Task[];
    };
}

export default function EditDailyReport() {
    const { props } = usePage<Props>();
    const { report } = props;
    const [showWarning, setShowWarning] = useState(false);
    const successMessage = props.flash?.success;
    const systemError = props.errors?.message;

    const { data, setData, patch, processing, errors } = useForm<DailyReportForm>({
        summary_text: report.summary_text || '',
        tasks: report.tasks.length > 0 ? report.tasks : [{ task_type: '', project_name: '' }],
    });

    const handleTaskChange = (index: number, key: keyof Task, value: string) => {
        const updated = [...data.tasks];
        updated[index][key] = value;
        setData('tasks', updated);
    };

    const addTask = () => {
        setData('tasks', [...data.tasks, { task_type: '', project_name: '' }]);
    };

    const removeTask = (index: number) => {
        if (data.tasks.length <= 1) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 2000);
            return;
        }
        const updated = [...data.tasks];
        updated.splice(index, 1);
        setData('tasks', updated);
    };

    const handleSubmit = () => {
        patch(route('daily-report.update', report.id));
    };

    const taskOptions = ['Presale', 'Postsale', 'Aftersale', 'Development', 'Support', 'Self Study'];

    return (
        <MainLayout>
            <div className="flex flex-1 items-center justify-center py-12">
                <Card className="w-full max-w-2xl">
                    <CardContent className="space-y-6 py-6">
                        <h2 className="text-center text-xl font-semibold">แก้ไขรายงานประจำวัน</h2>

                        {successMessage && <AlertSuccess message={successMessage} />}
                        {systemError && <AlertError message={systemError} />}
                        {showWarning && <AlertWarning message="ต้องมีรายการงานอย่างน้อย 1 รายการ" />}

                        <div className="space-y-2">
                            <div className="font-medium">
                                รายการงาน <span className="text-red-600">*</span>
                            </div>
                            {data.tasks.map((task, index) => (
                                <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:space-x-2">
                                    <div className="w-full sm:w-150">
                                        <Select value={task.task_type} onValueChange={(value) => handleTaskChange(index, 'task_type', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="เลือกประเภทงาน" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {taskOptions.map((option) => (
                                                    <SelectItem key={option} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors[`tasks.${index}.task_type`] && (
                                            <div className="mt-1 text-sm text-red-500">{errors[`tasks.${index}.task_type`]}</div>
                                        )}
                                    </div>

                                    <div className="w-full">
                                        <Input
                                            placeholder="ชื่อโปรเจกต์"
                                            value={task.project_name}
                                            onChange={(e) => handleTaskChange(index, 'project_name', e.target.value)}
                                        />
                                        {errors[`tasks.${index}.project_name`] && (
                                            <div className="mt-1 text-sm text-red-500">{errors[`tasks.${index}.project_name`]}</div>
                                        )}
                                    </div>

                                    <Button type="button" variant="destructive" onClick={() => removeTask(index)} className="w-full sm:w-auto">
                                        ลบ
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" onClick={addTask}>
                                เพิ่มรายการงาน
                            </Button>
                        </div>

                        <div>
                            <Textarea
                                placeholder="สรุปสิ่งที่ทำวันนี้ (ไม่บังคับ)"
                                value={data.summary_text}
                                onChange={(e) => setData('summary_text', e.target.value)}
                            />
                            {errors.summary_text && <div className="mt-1 text-sm text-red-500">{errors.summary_text}</div>}
                        </div>

                        <div className="flex">
                            <Button onClick={handleSubmit} disabled={processing} className="me-3">
                                บันทึกรายงาน
                            </Button>

                            <Button asChild variant="secondary">
                                <Link href={route('attendance.check_page')}>กลับ</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
