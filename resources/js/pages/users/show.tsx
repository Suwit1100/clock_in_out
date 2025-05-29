import SectionHeader from '@/components/pageheader';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { UserRound } from 'lucide-react';

interface PageProps {
    user: User & {
        roles: { id: number; name: string }[];
    };
    permissions: { id: number; name: string }[];
    roles: any;
    [key: string]: unknown;
}

interface Role {
    id: number;
    name: string;
}

export default function Show() {
    const props = usePage<PageProps>().props;
    const { user, roles, permissions } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/backoffice/users/',
        },
        {
            title: 'Show User',
            href: `/backoffice/users/${user.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <SectionHeader
                    icon={<UserRound className="text-primary-foreground h-6 w-6" />}
                    title="แสดผู้ใช้"
                    description="รายละเอียดข้อมูลของผู้ใช้"
                />
            </div>

            <div className="bg-background min-h-screen p-4 transition-colors duration-300">
                <div className="mx-auto max-w-4xl space-y-8">
                    {/* Header Card */}
                    <div className="bg-card overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                        <div className="from-primary/10 via-primary/5 to-secondary/10 dark:from-primary/20 dark:via-primary/10 dark:to-secondary/20 bg-gradient-to-r px-8 py-6">
                            <div className="flex items-center gap-6">
                                <div className="bg-primary/20 text-primary dark:bg-primary/30 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-foreground text-3xl font-bold">{user.name}</h1>
                                    <p className="text-muted-foreground text-lg">{user.display_name || 'ไม่ระบุชื่อแสดง'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Information Card */}
                    <div className="bg-card overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                        <div className="border-border bg-muted/30 border-b px-8 py-4">
                            <h2 className="text-foreground text-xl font-semibold">ข้อมูลผู้ใช้</h2>
                        </div>
                        <div className="space-y-6 p-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-muted-foreground text-sm font-medium">รหัสพนักงาน</label>
                                    <div className="bg-muted/50 text-foreground rounded-md px-4 py-3 transition-colors">
                                        {user.employee_code || <span className="text-muted-foreground italic">ไม่ระบุ</span>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-muted-foreground text-sm font-medium">ชื่อผู้ใช้</label>
                                    <div className="bg-muted/50 text-foreground rounded-md px-4 py-3 font-medium transition-colors">{user.name}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-muted-foreground text-sm font-medium">อีเมล</label>
                                    <div className="bg-muted/50 text-foreground rounded-md px-4 py-3 transition-colors">{user.email}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-muted-foreground text-sm font-medium">ชื่อแสดง</label>
                                    <div className="bg-muted/50 text-foreground rounded-md px-4 py-3 transition-colors">
                                        {user.display_name || <span className="text-muted-foreground italic">ไม่ระบุ</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Roles and Permissions Grid */}
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Roles Card */}
                        <div className="bg-card overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                            <div className="border-border from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-b bg-gradient-to-r px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/20 dark:bg-primary/30 flex h-8 w-8 items-center justify-center rounded-full">
                                        <svg className="text-primary h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-foreground text-lg font-semibold">บทบาท ({roles.length})</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                {roles.length > 0 ? (
                                    <div className="flex flex-wrap gap-3">
                                        {roles.map((role: Role) => (
                                            <span
                                                key={role.id}
                                                className="bg-primary/15 text-primary ring-primary/20 hover:bg-primary/20 hover:ring-primary/30 dark:bg-primary/25 dark:ring-primary/30 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ring-1 transition-all duration-200"
                                            >
                                                {role.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="border-muted-foreground/30 flex items-center justify-center rounded-lg border-2 border-dashed py-12">
                                        <div className="text-center">
                                            <svg
                                                className="text-muted-foreground/50 mx-auto h-12 w-12"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                            <p className="text-muted-foreground mt-2 text-sm">ไม่มีบทบาท</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Permissions Card */}
                        <div className="bg-card overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                            <div className="border-border from-secondary/10 to-secondary/5 dark:from-secondary/20 dark:to-secondary/10 border-b bg-gradient-to-r px-6 py-4">
                                <div className="flex items-center gap-3">
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
                                    <h3 className="text-foreground text-lg font-semibold">สิทธิ์การใช้งาน ({permissions.length})</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                {permissions.length > 0 ? (
                                    <div className="flex flex-wrap gap-3">
                                        {permissions.map((permission) => (
                                            <span
                                                key={permission.id}
                                                className="bg-secondary/15 text-secondary ring-secondary/20 hover:bg-secondary/20 hover:ring-secondary/30 dark:bg-secondary/25 dark:ring-secondary/30 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ring-1 transition-all duration-200"
                                            >
                                                {permission.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="border-muted-foreground/30 flex items-center justify-center rounded-lg border-2 border-dashed py-12">
                                        <div className="text-center">
                                            <svg
                                                className="text-muted-foreground/50 mx-auto h-12 w-12"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                />
                                            </svg>
                                            <p className="text-muted-foreground mt-2 text-sm">ไม่มีสิทธิ์การใช้งาน</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
