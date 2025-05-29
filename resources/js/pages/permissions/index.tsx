import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import SectionHeader from '@/components/pageheader';
import Pagination from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import { Auth } from '@/types';
import type { Permission } from '@/types/permission';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, LaptopMinimalCheck, Plus, Trash2 } from 'lucide-react';

interface Props {
    permissions: {
        data: Permission[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    auth: Auth;
    [key: string]: unknown;
}

export default function Index() {
    const { permissions, auth } = usePage<Props>().props;

    function destroy(id: number) {
        if (confirm('ลบใช่หรือไม่?')) {
            router.delete(route('backoffice.permissions.destroy', id));
        }
    }

    return (
        <AppLayout>
            <Head title="Permissions" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <SectionHeader
                        icon={<LaptopMinimalCheck className="text-primary-foreground h-6 w-6" />}
                        title="จัดการสิทธิ์"
                        description="จัดการสิทธิ์ในระบบ"
                    />

                    {auth.permissions?.includes('permission.create') && (
                        <Link
                            href={route('backoffice.permissions.create')}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium shadow-sm transition-colors duration-200 hover:shadow-md"
                        >
                            <Plus size={20} />
                            Add New Permission
                        </Link>
                    )}
                </div>

                <div className="bg-card border-border overflow-hidden rounded-xl border shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-border border-b">
                                <tr>
                                    <th className="text-foreground px-6 py-4 text-left font-semibold">ชื่อ</th>
                                    <th className="text-foreground px-6 py-4 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-border divide-y">
                                {permissions.data.map((perm) => (
                                    <tr key={perm.id} className="hover:bg-muted/30 transition-colors duration-150">
                                        <td className="text-foreground px-6 py-4 font-medium">{perm.name}</td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* <Link
                                                    href={route('backoffice.permissions.show', perm.id)}
                                                    className="text-secondary hover:text-secondary-foreground hover:bg-secondary/20 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150"
                                                >
                                                    <Eye size={14} className="stroke-current" />
                                                    Show
                                                </Link> */}
                                                {auth.permissions?.includes('user.edit') && (
                                                    <Link
                                                        href={route('backoffice.permissions.edit', perm.id)}
                                                        className="text-primary hover:text-primary/80 hover:bg-primary/10 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150"
                                                    >
                                                        <Edit size={14} />
                                                        Edit
                                                    </Link>
                                                )}
                                                {auth.permissions?.includes('user.delete') && (
                                                    <ConfirmDeleteDialog
                                                        onConfirm={() => router.delete(route('backoffice.permissions.destroy', perm.id))}
                                                        title={`Delete ${perm.name}?`}
                                                        description="This action will permanently remove the user from the system."
                                                    >
                                                        <button
                                                            type="button"
                                                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150"
                                                        >
                                                            <Trash2 size={14} />
                                                            Delete
                                                        </button>
                                                    </ConfirmDeleteDialog>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {permissions && permissions.data.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination links={permissions.links} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
