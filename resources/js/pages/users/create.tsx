import SectionHeader from '@/components/pageheader';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import UserForm from './user-form';

interface PageProps {
    availableRoles: AvailableRoles[];
    [key: string]: unknown;
}

interface AvailableRoles {
    id: number;
    name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/backoffice/users/',
    },
    {
        title: 'Create User',
        href: '/backoffice/users/create/',
    },
];

const Create = () => {
    const { availableRoles } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="from-primary/10 to-secondary/10 absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-br blur-3xl"></div>
                <div className="from-accent/10 to-primary/10 absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr blur-3xl"></div>
            </div>

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <div className="flex flex-col space-y-4 lg:space-y-6">
                    <SectionHeader
                        icon={<UserPlus className="text-primary-foreground h-6 w-6" />}
                        title="สร้างผู้ใช้ใหม่"
                        description="เพิ่มผู้ใช้งานใหม่เข้าสู่ระบบ"
                    />

                    {/* Info Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="border-border/50 bg-card/50 rounded-xl border p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                                    <div className="bg-primary h-2 w-2 rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-foreground font-medium">ขั้นตอนที่ 1</h3>
                                    <p className="text-muted-foreground text-xs">กรอกข้อมูลพื้นฐาน</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-border/50 bg-card/50 rounded-xl border p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-secondary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                                    <div className="bg-secondary h-2 w-2 rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-foreground font-medium">ขั้นตอนที่ 2</h3>
                                    <p className="text-muted-foreground text-xs">กำหนดสิทธิ์การใช้งาน</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-border/50 bg-card/50 rounded-xl border p-4 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-3">
                                <div className="bg-accent/20 flex h-8 w-8 items-center justify-center rounded-lg">
                                    <div className="bg-accent-foreground h-2 w-2 rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-foreground font-medium">เสร็จสิ้น</h3>
                                    <p className="text-muted-foreground text-xs">พร้อมใช้งานทันที</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="flex-1">
                    <UserForm availableRoles={availableRoles} onSubmitRoute={route('backoffice.users.store')} />
                </div>
            </div>
        </AppLayout>
    );
};

export default Create;
