import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import SectionHeader from '@/components/pageheader';
import Pagination from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import { Auth, BreadcrumbItem, User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Eye, Filter, Search, Trash2, UserCog, UserPlus, X } from 'lucide-react';

interface PageProps {
    auth: Auth;
    users?: {
        data: User[];
        links: any;
        meta: any;
    };
    filters?: {
        search: string;
        order: string;
    };
    [key: string]: unknown;
}

export default function Index() {
    const { users, auth, filters } = usePage<PageProps>().props;

    console.log(users);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const search = form.search.value;
        const order = form.order.value;

        router.get(
            route('backoffice.users.index'),
            { search, order },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearFilters = () => {
        router.get(
            route('backoffice.users.index'),
            {},
            {
                preserveState: false,
                preserveScroll: true,
            },
        );
    };

    const deleteUser = (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            router.delete(route('backoffice.users.destroy', user.id));
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/backoffice/users/',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <SectionHeader
                        icon={<UserCog className="text-primary-foreground h-6 w-6" />}
                        title="จัดการผู้ใช้"
                        description="จัดการบัญชีผู้ใช้ในระบบ"
                    />

                    {auth.permissions?.includes('user.create') && (
                        <Link
                            href={route('backoffice.users.create')}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium shadow-sm transition-colors duration-200 hover:shadow-md"
                        >
                            <UserPlus size={20} />
                            Add New User
                        </Link>
                    )}
                </div>

                {/* Filters Card */}
                <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
                    <form onSubmit={handleFilter} className="space-y-4">
                        <div className="flex flex-col gap-4 sm:flex-row">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform" size={18} />
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={filters?.search ?? ''}
                                    placeholder="Search by name or employee code..."
                                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border py-3 pr-4 pl-10 transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none"
                                />
                            </div>

                            {/* Sort Select */}
                            <div className="relative">
                                <Filter
                                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 transform"
                                    size={18}
                                />
                                <select
                                    name="order"
                                    defaultValue={filters?.order ?? ''}
                                    className="border-border bg-background text-foreground focus:ring-ring min-w-[200px] cursor-pointer appearance-none rounded-lg border py-3 pr-8 pl-10 transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none"
                                >
                                    <option value="">Default Order</option>
                                    <option value="name_asc">Name (A → Z)</option>
                                    <option value="name_desc">Name (Z → A)</option>
                                    <option value="code_asc">Employee Code (↑)</option>
                                    <option value="code_desc">Employee Code (↓)</option>
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium transition-colors duration-200"
                            >
                                <Filter size={16} />
                                Apply Filters
                            </button>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium transition-colors duration-200"
                            >
                                <X size={16} />
                                Clear All
                            </button>
                        </div>
                    </form>
                </div>

                {/* Users Table Card */}
                <div className="bg-card border-border overflow-hidden rounded-xl border shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-border border-b">
                                <tr>
                                    <th className="text-foreground px-6 py-4 text-left font-semibold">Employee Code</th>
                                    <th className="text-foreground px-6 py-4 text-left font-semibold">Name</th>
                                    <th className="text-foreground px-6 py-4 text-left font-semibold">Email</th>
                                    <th className="text-foreground px-6 py-4 text-left font-semibold">Display Name</th>
                                    <th className="text-foreground px-6 py-4 text-left font-semibold">Roles</th>
                                    <th className="text-foreground px-6 py-4 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-border divide-y">
                                {users?.data.map((user: User) => (
                                    <tr key={user.id} className="hover:bg-muted/30 transition-colors duration-150">
                                        <td className="px-6 py-4">
                                            <span className="bg-accent text-accent-foreground inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium">
                                                {user.employee_code ? user.employee_code : 'ไม่ระบุ'}
                                            </span>
                                        </td>
                                        <td className="text-foreground px-6 py-4 font-medium">{user.name}</td>
                                        <td className="text-muted-foreground px-6 py-4">{user.email}</td>
                                        <td className="text-foreground px-6 py-4">{user.display_name ? user.display_name : 'ไม่ระบุ'}</td>
                                        <td className="text-foreground px-6 py-4">
                                            <td className="text-foreground px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles && user.roles.length > 0 ? (
                                                        user.roles.map((role: any) => (
                                                            <span
                                                                key={role.id}
                                                                className="bg-muted text-muted-foreground inline-block rounded-full px-3 py-0.5 text-xs font-medium"
                                                            >
                                                                {role.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="bg-muted text-muted-foreground inline-block rounded-full px-3 py-0.5 text-xs font-medium">
                                                            ไม่ระบุ
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={route('backoffice.users.show', user.id)}
                                                    className="text-secondary hover:text-secondary-foreground hover:bg-secondary/20 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150"
                                                >
                                                    <Eye size={14} className="stroke-current" />
                                                    Show
                                                </Link>
                                                {auth.permissions?.includes('user.edit') && (
                                                    <Link
                                                        href={route('backoffice.users.edit', user.id)}
                                                        className="text-primary hover:text-primary/80 hover:bg-primary/10 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150"
                                                    >
                                                        <Edit size={14} />
                                                        Edit
                                                    </Link>
                                                )}
                                                {auth.permissions?.includes('user.delete') && (
                                                    <ConfirmDeleteDialog
                                                        onConfirm={() => router.delete(route('backoffice.users.destroy', user.id))}
                                                        title={`Delete ${user.name}?`}
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
                {users && users.data.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination links={users.links} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
