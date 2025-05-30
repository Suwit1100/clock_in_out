import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import Form from './form';

export default function CreatePermission() {
    return (
        <AppLayout>
            <Head title="สร้าง Permission ใหม่" />
            <div className="bg-background min-h-screen p-4 transition-colors duration-300">
                <div className="mx-auto max-w-2xl space-y-6">
                    {/* Header Card */}
                    <div className="bg-card overflow-hidden rounded-lg shadow-lg transition-all duration-300">
                        <div className="from-primary/10 via-primary/5 to-secondary/10 dark:from-primary/20 dark:via-primary/10 dark:to-secondary/20 bg-gradient-to-r px-8 py-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/20 dark:bg-primary/30 flex h-12 w-12 items-center justify-center rounded-full">
                                    <svg className="text-primary h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-foreground text-2xl font-bold">สร้าง Permission ใหม่</h1>
                                    <p className="text-muted-foreground">เพิ่มสิทธิ์การใช้งานใหม่สำหรับระบบ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-card overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                        <div className="border-border bg-muted/30 border-b px-8 py-4">
                            <h2 className="text-foreground text-lg font-semibold">รายละเอียด Permission</h2>
                        </div>
                        <div className="p-8">
                            <Form />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
