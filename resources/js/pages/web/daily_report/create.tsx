import AlertError from '@/components/alert-error';
import AlertSuccess from '@/components/alert-success';
import AlertWarning from '@/components/alert-warning';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import MainLayout from '@/layouts/client-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, FileText, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DailyReportForm, Task } from '../types/daily_report';
import { PageProps } from '../types/global';

export default function DailyReport() {
    const { props } = usePage<PageProps>();
    const [showWarning, setShowWarning] = useState(false);
    const successMessage = props.flash?.success;
    const systemError = props.errors?.message;

    const { data, setData, post, processing, errors } = useForm<Omit<DailyReportForm, 'note'>>({
        summary_text: '',
        tasks: [{ task_type: '', project_name: '' }],
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
            setTimeout(() => setShowWarning(false), 3000);
            return;
        }

        const updated = [...data.tasks];
        updated.splice(index, 1);
        setData('tasks', updated);
    };

    const handleSubmit = () => {
        post(route('daily-report.store'));
    };

    const taskOptions = ['Presale', 'Postsale', 'Aftersale', 'Development', 'Support', 'Self Study'];

    const getTaskBadgeColor = (taskType: string) => {
        const colors = {
            Presale: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            Postsale: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            Aftersale: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
            Development: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            Support: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
            'Self Study': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
        };
        return colors[taskType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <MainLayout>
            <div className="from-background via-background to-accent/5 min-h-screen bg-gradient-to-br">
                <div className="container mx-auto px-4 py-8 lg:py-12">
                    {/* Header Section */}
                    <div className="mb-8 text-center">
                        <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <CalendarDays className="text-primary h-8 w-8" />
                        </div>
                        <h1 className="text-foreground text-3xl font-bold tracking-tight lg:text-4xl">บันทึกรายงานประจำวัน</h1>
                        <p className="text-muted-foreground mt-2">กรอกข้อมูลงานที่ทำในวันนี้และสรุปผลการทำงาน</p>
                    </div>

                    {/* Alert Messages */}
                    <div className="mx-auto mb-6 max-w-4xl space-y-4">
                        {successMessage && <AlertSuccess message={successMessage} />}
                        {systemError && <AlertError message={systemError} />}
                        {showWarning && <AlertWarning message="ต้องมีรายการงานอย่างน้อย 1 รายการ" />}
                    </div>

                    {/* Main Content */}
                    <div className="mx-auto max-w-4xl">
                        <Card className="bg-card/95 overflow-hidden border-0 shadow-xl backdrop-blur-sm">
                            <CardContent className="space-y-8 p-6 lg:p-8">
                                {/* Tasks Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label className="text-lg font-semibold">
                                                รายการงาน
                                                <span className="text-destructive ml-1">*</span>
                                            </Label>
                                            <p className="text-muted-foreground mt-1 text-sm">เพิ่มรายการงานที่ทำในวันนี้</p>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {data.tasks.length} รายการ
                                        </Badge>
                                    </div>

                                    <div className="space-y-4">
                                        {data.tasks.map((task: Task, index: number) => (
                                            <Card
                                                key={index}
                                                className="border-border/50 bg-muted/30 hover:border-primary/20 border-2 transition-all hover:shadow-md"
                                            >
                                                <CardContent className="p-4">
                                                    <div className="mb-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                                                                {index + 1}
                                                            </div>
                                                            {task.task_type && (
                                                                <Badge className={getTaskBadgeColor(task.task_type)}>{task.task_type}</Badge>
                                                            )}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeTask(index)}
                                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`task-type-${index}`} className="text-sm font-medium">
                                                                ประเภทงาน
                                                            </Label>
                                                            <Select
                                                                value={task.task_type}
                                                                onValueChange={(value) => handleTaskChange(index, 'task_type', value)}
                                                            >
                                                                <SelectTrigger id={`task-type-${index}`} className="h-11">
                                                                    <SelectValue placeholder="เลือกประเภทงาน" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {taskOptions.map((option) => (
                                                                        <SelectItem key={option} value={option}>
                                                                            <div className="flex items-center gap-2">
                                                                                <div
                                                                                    className={`h-2 w-2 rounded-full ${getTaskBadgeColor(option).split(' ')[0]}`}
                                                                                />
                                                                                {option}
                                                                            </div>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {errors[`tasks.${index}.task_type`] && (
                                                                <p className="text-destructive text-sm">{errors[`tasks.${index}.task_type`]}</p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor={`project-name-${index}`} className="text-sm font-medium">
                                                                ชื่อโปรเจกต์
                                                            </Label>
                                                            <Input
                                                                id={`project-name-${index}`}
                                                                placeholder="กรอกชื่อโปรเจกต์"
                                                                value={task.project_name}
                                                                onChange={(e) => handleTaskChange(index, 'project_name', e.target.value)}
                                                                className="h-11"
                                                            />
                                                            {errors[`tasks.${index}.project_name`] && (
                                                                <p className="text-destructive text-sm">{errors[`tasks.${index}.project_name`]}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={addTask}
                                        variant="outline"
                                        className="hover:bg-primary/5 hover:border-primary/50 hover:text-primary h-12 w-full border-2 border-dashed"
                                    >
                                        <Plus className="mr-2 h-5 w-5" />
                                        เพิ่มรายการงาน
                                    </Button>
                                </div>

                                <Separator className="my-8" />

                                {/* Summary Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-primary h-5 w-5" />
                                        <Label htmlFor="summary" className="text-lg font-semibold">
                                            สรุปผลการทำงาน
                                        </Label>
                                        <Badge variant="outline" className="text-xs">
                                            ไม่บังคับ
                                        </Badge>
                                    </div>
                                    <Textarea
                                        id="summary"
                                        placeholder="เขียนสรุปสิ่งที่ทำในวันนี้ ปัญหาที่พบ หรือข้อเสนอแนะ..."
                                        value={data.summary_text}
                                        onChange={(e) => setData('summary_text', e.target.value)}
                                        rows={5}
                                        className="resize-none"
                                    />
                                    {errors.summary_text && <p className="text-destructive text-sm">{errors.summary_text}</p>}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-end">
                                    <Button asChild variant="outline" className="order-2 h-12 px-6 sm:order-1">
                                        <Link href={route('attendance.check_page')}>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            กลับ
                                        </Link>
                                    </Button>

                                    <Button
                                        onClick={handleSubmit}
                                        disabled={processing}
                                        className="bg-primary hover:bg-primary/90 order-1 h-12 px-8 sm:order-2"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="border-primary-foreground/20 border-t-primary-foreground mr-2 h-4 w-4 animate-spin rounded-full border-2" />
                                                กำลังบันทึก...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                บันทึกรายงาน
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
