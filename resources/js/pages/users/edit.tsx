import SectionHeader from '@/components/pageheader';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AlertTriangle, Shield, UserCog } from 'lucide-react';
import UserForm from './user-form';

interface UserData {
    id: number;
    employee_code: string;
    name: string;
    email: string;
    display_name?: string;
    role_id: number | '';
    roles: { id: number; name: string }[];
}

interface AvailableRoles {
    id: number;
    name: string;
}

interface PageProps {
    user: UserData;
    availableRoles: AvailableRoles[];
    [key: string]: unknown;
}

const Edit = () => {
    const { user, availableRoles } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/backoffice/users/',
        },
        {
            title: 'Edit User',
            href: `/backoffice/${user.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />

            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="from-secondary/10 to-primary/10 absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-br blur-3xl"></div>
                <div className="from-primary/10 to-accent/10 absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr blur-3xl"></div>
            </div>

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <div className="flex flex-col space-y-4 lg:space-y-6">
                    <SectionHeader
                        icon={<UserCog className="text-primary-foreground h-6 w-6" />}
                        title="แก้ไขข้อมูลผู้ใช้"
                        description="อัปเดตข้อมูลของผู้ใช้"
                    />

                    {/* User Info Summary */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="border-border/50 bg-card/50 rounded-xl border p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="from-primary/20 to-primary/10 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br">
                                    <span className="text-primary text-sm font-bold">{user.employee_code?.substring(0, 2) || 'NA'}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-foreground font-medium">รหัสพนักงาน</h3>
                                    <p className="text-muted-foreground truncate text-xs">{user.employee_code || 'ไม่ระบุ'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-border/50 bg-card/50 rounded-xl border p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="from-secondary/20 to-secondary/10 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br">
                                    <span className="text-secondary text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-foreground font-medium">ชื่อจริง</h3>
                                    <p className="text-muted-foreground truncate text-xs">{user.name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-border/50 bg-card/50 rounded-xl border p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="from-accent/30 to-accent/20 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br">
                                    <span className="text-accent-foreground text-sm font-bold">@</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-foreground font-medium">อีเมล</h3>
                                    <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-border/50 bg-card/50 rounded-xl border p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="from-chart-4/20 to-chart-4/10 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br">
                                    <Shield className="text-chart-4 h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-foreground font-medium">บทบาท</h3>
                                    <p className="text-muted-foreground truncate text-xs">
                                        {availableRoles.find((role) => role.id === user.roles[0]?.id)?.name || 'ไม่ระบุ'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Warning Notice */}
                    <div className="border-destructive/20 bg-destructive/5 rounded-xl border p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="text-destructive mt-0.5 h-5 w-5 flex-shrink-0" />
                            <div className="flex-1 space-y-1">
                                <h3 className="text-destructive font-medium">ข้อควรระวัง</h3>
                                <p className="text-destructive/80 text-sm">
                                    การแก้ไขข้อมูลผู้ใช้อาจส่งผลต่อสิทธิ์การเข้าถึงระบบ กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึก
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="flex-1">
                    <UserForm
                        availableRoles={availableRoles}
                        user={user}
                        isEdit
                        method="put"
                        onSubmitRoute={route('backoffice.users.update', user.id)}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default Edit;
