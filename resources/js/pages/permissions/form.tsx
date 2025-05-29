import type { Permission } from '@/types/permission';
import { useForm, usePage } from '@inertiajs/react';
import React from 'react';

interface PageProps {
    permission?: Permission;
    [key: string]: any;
}

interface FormData {
    name: string;
    [key: string]: any;
}

export default function Form() {
    // ดึง permission จาก props (ถ้าแก้ไขก็จะมี object ตัวนั้นมา)
    const { permission } = usePage<PageProps>().props;

    const isEdit = Boolean(permission?.id);

    // กำหนดค่าเริ่มต้นให้ useForm
    const { data, setData, post, put, processing, errors } = useForm<FormData>({
        name: permission?.name || '',
    });

    // handle submit
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            put(route('backoffice.permissions.update', permission!.id));
        } else {
            post(route('backoffice.permissions.store'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Permission Name Input */}
            <div className="space-y-3">
                <label htmlFor="name" className="text-foreground block text-sm font-medium">
                    ชื่อ Permission <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="text-muted-foreground h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                    </div>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="เช่น users.create, posts.edit"
                        required
                        className={`bg-background text-foreground placeholder-muted-foreground focus:border-ring focus:ring-ring/20 block w-full rounded-lg border py-3 pr-4 pl-10 transition-all duration-200 focus:ring-2 focus:outline-none ${
                            errors.name
                                ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                                : 'border-border hover:border-muted-foreground/50'
                        } `}
                    />
                </div>
                {errors.name && (
                    <div className="text-destructive flex items-center gap-2 text-sm">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {errors.name}
                    </div>
                )}
            </div>

            {/* Helper Text */}
            <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex gap-3">
                    <div className="bg-primary/20 dark:bg-primary/30 flex h-5 w-5 items-center justify-center rounded-full">
                        <svg className="text-primary h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <p className="text-foreground text-sm font-medium">คำแนะนำการตั้งชื่อ Permission</p>
                        <ul className="text-muted-foreground space-y-1 text-sm">
                            <li>
                                • ใช้รูปแบบ: <code className="bg-muted rounded px-1 py-0.5 text-xs">resource.action</code>
                            </li>
                            <li>
                                • ตัวอย่าง: <code className="bg-muted rounded px-1 py-0.5 text-xs">users.create</code>,{' '}
                                <code className="bg-muted rounded px-1 py-0.5 text-xs">posts.edit</code>
                            </li>
                            <li>• ใช้ตัวพิมพ์เล็กและขีดล่าง (_) หรือจุด (.) เท่านั้น</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="border-border flex items-center gap-4 border-t pt-6">
                <button
                    type="submit"
                    disabled={processing}
                    className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                        processing
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring shadow-lg hover:shadow-xl'
                    } `}
                >
                    {processing ? (
                        <>
                            <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            กำลังประมวลผล...
                        </>
                    ) : (
                        <>
                            {isEdit ? (
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                    />
                                </svg>
                            ) : (
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            )}
                            {isEdit ? 'อัปเดต Permission' : 'สร้าง Permission'}
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="border-border bg-background text-foreground hover:bg-muted focus:ring-ring inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    ยกเลิก
                </button>
            </div>
        </form>
    );
}
