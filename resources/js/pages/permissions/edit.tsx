import AppLayout from '@/layouts/app-layout';
import { Permission } from '@/types/permission';
import { Head, usePage } from '@inertiajs/react';
import Form from './form';

interface Props {
    permission: Permission;
    [key: string]: any;
}

export default function EditPermission() {
    const { permission } = usePage<Props>().props;

    return (
        <AppLayout>
            <Head title={`แก้ไข Permission: ${permission.name}`} />
            <div className="bg-background min-h-screen p-4 transition-colors duration-300">
                <div className="mx-auto max-w-2xl space-y-6">
                    {/* Header Card */}
                    <div className="bg-card overflow-hidden rounded-lg shadow-lg transition-all duration-300">
                        <div className="from-secondary/10 via-secondary/5 to-primary/10 dark:from-secondary/20 dark:via-secondary/10 dark:to-primary/20 bg-gradient-to-r px-8 py-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-secondary/20 dark:bg-secondary/30 flex h-12 w-12 items-center justify-center rounded-full">
                                    <svg className="text-secondary h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-foreground text-2xl font-bold">แก้ไข Permission</h1>
                                    <p className="text-muted-foreground">
                                        แก้ไขข้อมูล: <span className="text-foreground font-medium">{permission.name}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Permission Info Card */}
                    <div className="bg-card overflow-hidden rounded-lg shadow-lg transition-all duration-300">
                        <div className="border-border bg-muted/30 border-b px-8 py-4">
                            <h2 className="text-foreground text-lg font-semibold">ข้อมูลปัจจุบัน</h2>
                        </div>
                        <div className="p-6">
                            <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-4">
                                <div className="bg-secondary/20 dark:bg-secondary/30 flex h-8 w-8 items-center justify-center rounded-full">
                                    <svg className="text-secondary h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-foreground font-medium">{permission.name}</p>
                                    <p className="text-muted-foreground text-sm">ID: {permission.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-card overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                        <div className="border-border bg-muted/30 border-b px-8 py-4">
                            <h2 className="text-foreground text-lg font-semibold">แก้ไขข้อมูล Permission</h2>
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
