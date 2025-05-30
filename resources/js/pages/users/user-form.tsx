import { useForm } from '@inertiajs/react';
import { Building, Key, Mail, Shield, User, UserCircle } from 'lucide-react';
import React from 'react';

interface UserFormData {
    employee_code: string;
    name: string;
    email: string;
    display_name?: string;
    password?: string;
    role_id: number | '';
    [key: string]: any;
}

interface UserFormProps {
    user?: UserFormData;
    availableRoles: AvailableRoles[];
    isEdit?: boolean;
    onSubmitRoute: string;
    method?: 'post' | 'put';
}

interface AvailableRoles {
    id: number;
    name: string;
}

const UserForm: React.FC<UserFormProps> = ({ user, availableRoles, isEdit = false, onSubmitRoute, method = 'post' }) => {
    const { data, setData, post, put, processing, errors } = useForm<UserFormData>({
        employee_code: user?.employee_code || '',
        name: user?.name || '',
        email: user?.email || '',
        display_name: user?.display_name || '',
        password: '',
        role_id: user?.roles?.[0]?.id || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(onSubmitRoute);
        } else {
            post(onSubmitRoute);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-card border-border/50 space-y-8 rounded-2xl border p-8 shadow-xl backdrop-blur-sm">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <div className="bg-primary/10 ring-primary/5 inline-flex h-16 w-16 items-center justify-center rounded-full ring-8">
                        <User className="text-primary h-8 w-8" />
                    </div>
                    <h2 className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
                        {isEdit ? 'แก้ไขข้อมูลผู้ใช้' : 'สร้างผู้ใช้ใหม่'}
                    </h2>
                    <p className="text-muted-foreground text-sm">{isEdit ? 'อัปเดตข้อมูลผู้ใช้งาน' : 'กรอกข้อมูลเพื่อสร้างผู้ใช้งานใหม่'}</p>
                </div>

                {/* Form Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Employee Code */}
                    <div className="space-y-2">
                        <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                            <Building className="text-primary h-4 w-4" />
                            รหัสพนักงาน
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={data.employee_code}
                                onChange={(e) => setData('employee_code', e.target.value)}
                                className="border-input bg-background placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 hover:border-primary/50 w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                                placeholder="เช่น EMP001"
                            />
                            {errors.employee_code && (
                                <div className="text-destructive mt-2 flex items-center gap-1 text-xs">
                                    <div className="bg-destructive h-1 w-1 rounded-full"></div>
                                    {errors.employee_code}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                            <User className="text-primary h-4 w-4" />
                            ชื่อ-นามสกุล
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="border-input bg-background placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 hover:border-primary/50 w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                                placeholder="ชื่อจริง นามสกุล"
                            />
                            {errors.name && (
                                <div className="text-destructive mt-2 flex items-center gap-1 text-xs">
                                    <div className="bg-destructive h-1 w-1 rounded-full"></div>
                                    {errors.name}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                            <Mail className="text-primary h-4 w-4" />
                            อีเมล
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="border-input bg-background placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 hover:border-primary/50 w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                                placeholder="example@company.com"
                            />
                            {errors.email && (
                                <div className="text-destructive mt-2 flex items-center gap-1 text-xs">
                                    <div className="bg-destructive h-1 w-1 rounded-full"></div>
                                    {errors.email}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Display Name */}
                    <div className="space-y-2">
                        <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                            <UserCircle className="text-primary h-4 w-4" />
                            ชื่อเรียก
                            <span className="text-muted-foreground text-xs">(ไม่บังคับ)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={data.display_name || ''}
                                onChange={(e) => setData('display_name', e.target.value)}
                                className="border-input bg-background placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 hover:border-primary/50 w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                                placeholder="ชื่อเล่น หรือชื่อที่ต้องการให้แสดง"
                            />
                            {errors.display_name && (
                                <div className="text-destructive mt-2 flex items-center gap-1 text-xs">
                                    <div className="bg-destructive h-1 w-1 rounded-full"></div>
                                    {errors.display_name}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                        <Key className="text-primary h-4 w-4" />
                        {isEdit ? 'รหัสผ่านใหม่ (ไม่บังคับ)' : 'รหัสผ่าน'}
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            value={data.password || ''}
                            onChange={(e) => setData('password', e.target.value)}
                            className="border-input bg-background placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 hover:border-primary/50 w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                            placeholder={isEdit ? 'ใส่รหัสผ่านใหม่หากต้องการเปลี่ยน' : 'สร้างรหัสผ่านสำหรับผู้ใช้'}
                        />
                        {errors.password && (
                            <div className="text-destructive mt-2 flex items-center gap-1 text-xs">
                                <div className="bg-destructive h-1 w-1 rounded-full"></div>
                                {errors.password}
                            </div>
                        )}
                    </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                    <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                        <Shield className="text-primary h-4 w-4" />
                        บทบาท
                    </label>
                    <div className="relative">
                        <select
                            value={data.role_id}
                            onChange={(e) => setData('role_id', e.target.value ? parseInt(e.target.value) : '')}
                            className="border-input bg-background focus:border-primary focus:ring-primary/20 hover:border-primary/50 w-full cursor-pointer appearance-none rounded-lg border px-4 py-3 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                        >
                            <option value="">-- เลือกบทบาท --</option>
                            {availableRoles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {/* Custom dropdown arrow */}
                        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        {errors.role_id && (
                            <div className="text-destructive mt-2 flex items-center gap-1 text-xs">
                                <div className="bg-destructive h-1 w-1 rounded-full"></div>
                                {errors.role_id}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="group from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 hover:shadow-primary/25 focus:ring-primary relative inline-flex min-w-[140px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-8 py-3 font-semibold shadow-lg transition-all duration-200 hover:shadow-xl focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <div className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2"></div>
                                <span>กำลังบันทึก...</span>
                            </>
                        ) : (
                            <>
                                <span>{isEdit ? 'อัปเดต' : 'สร้างผู้ใช้'}</span>
                                <svg
                                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;
