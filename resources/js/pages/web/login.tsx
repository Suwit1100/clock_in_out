import { Head } from '@inertiajs/react';
import { Clock, Moon, Shield, Sun, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Login() {
    const [isDark, setIsDark] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // ตรวจสอบธีมปัจจุบันเมื่อโหลด
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');

        if (storedTheme === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else if (storedTheme === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        } else {
            // fallback ใช้ system preference แล้วบันทึกไว้
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(prefersDark);
            document.documentElement.classList.toggle('dark', prefersDark);
            localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);

        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        // เพิ่ม delay เล็กน้อยเพื่อให้เห็น loading effect
        setTimeout(() => {
            window.location.href = route('auth.google.redirect');
        }, 500);
    };

    return (
        <>
            <Head title="Login" />

            {/* Background with gradient and animated blobs */}
            <div className="bg-background relative min-h-screen overflow-hidden">
                {/* Animated background blobs using theme colors */}
                <div className="absolute inset-0">
                    <div
                        className="absolute -top-20 -left-20 h-96 w-96 animate-pulse rounded-full opacity-20 blur-3xl"
                        style={{ background: 'var(--primary)' }}
                    ></div>
                    <div
                        className="absolute -right-20 -bottom-20 h-96 w-96 animate-pulse rounded-full opacity-15 blur-3xl"
                        style={{ background: 'var(--secondary)', animationDelay: '1s' }}
                    ></div>
                    <div
                        className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full opacity-10 blur-3xl"
                        style={{ background: 'var(--accent)', animationDelay: '2s' }}
                    ></div>
                </div>

                {/* Theme toggle button - positioned absolutely */}
                <div className="absolute top-6 right-6 z-50">
                    <button
                        onClick={toggleTheme}
                        className="group bg-card/80 border-border relative overflow-hidden rounded-full border p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-xl"
                        aria-label="Toggle Theme"
                    >
                        <div className="relative z-10">
                            {isDark ? (
                                <Sun size={20} className="text-primary transition-transform duration-500 group-hover:rotate-180" />
                            ) : (
                                <Moon size={20} className="text-foreground transition-transform duration-500 group-hover:-rotate-12" />
                            )}
                        </div>
                        <div
                            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            style={{ background: 'linear-gradient(to right, var(--primary), var(--accent))' }}
                        ></div>
                    </button>
                </div>

                {/* Main content */}
                <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
                    <div className="w-full max-w-md">
                        {/* Login card with glass morphism effect */}
                        <div className="group bg-card/70 border-border hover:shadow-3xl relative overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02]">
                            {/* Card shine effect */}
                            <div className="via-primary/10 absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>

                            <div className="relative space-y-8 p-10">
                                {/* Header section */}
                                <div className="space-y-6 text-center">
                                    {/* Logo with floating animation */}
                                    <div className="relative mx-auto h-24 w-24">
                                        <div
                                            className="absolute inset-0 animate-pulse rounded-full"
                                            style={{ background: 'linear-gradient(to bottom right, var(--primary), var(--secondary))' }}
                                        ></div>
                                        <div className="bg-card relative transform rounded-full p-2 shadow-lg transition-transform duration-300 hover:scale-110">
                                            <img
                                                src="/clock_logo.png"
                                                alt="Smart Attendance Logo"
                                                className="h-20 w-20 animate-bounce rounded-full object-cover"
                                                style={{ animationDuration: '3s' }}
                                            />
                                        </div>
                                        {/* Floating rings */}
                                        <div
                                            className="absolute inset-0 animate-ping rounded-full border-2"
                                            style={{ borderColor: 'var(--primary)' }}
                                        ></div>
                                        <div
                                            className="absolute inset-0 animate-pulse rounded-full border"
                                            style={{ borderColor: 'var(--secondary)', animationDelay: '1s' }}
                                        ></div>
                                    </div>

                                    {/* Title with gradient text */}
                                    <div className="space-y-3">
                                        <h1 className="text-foreground animate-fade-in text-3xl font-bold">เข้าสู่ระบบ</h1>
                                        <div
                                            className="flex items-center justify-center gap-2 text-xl font-semibold"
                                            style={{ color: 'var(--primary)' }}
                                        >
                                            <Clock size={20} className="animate-spin" style={{ animationDuration: '3s' }} />
                                            Clock in - Clock out
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-relaxed">โปรดเข้าสู่ระบบด้วยบัญชี Google ของคุณ</p>
                                    </div>
                                </div>

                                {/* Google login button with enhanced effects */}
                                <div className="space-y-6">
                                    <button
                                        onClick={handleGoogleLogin}
                                        disabled={isLoading}
                                        className="group text-destructive-foreground relative w-full transform overflow-hidden rounded-2xl px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                                        style={{
                                            background: 'var(--destructive)',
                                            ['--hover-bg' as any]: 'color-mix(in oklch, var(--destructive), black 10%)',
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.target as HTMLElement).style.background = 'var(--hover-bg)';
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.target as HTMLElement).style.background = 'var(--destructive)';
                                        }}
                                    >
                                        {/* Button background animation */}
                                        <div
                                            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                            style={{ background: 'color-mix(in oklch, var(--destructive), black 15%)' }}
                                        ></div>

                                        {/* Ripple effect */}
                                        <div className="absolute inset-0 scale-0 rounded-full bg-white/20 transition-transform duration-300 group-active:scale-100"></div>

                                        <div className="relative flex items-center justify-center gap-3">
                                            {isLoading ? (
                                                <>
                                                    <div
                                                        className="border-destructive-foreground/30 h-6 w-6 animate-spin rounded-full border-2"
                                                        style={{ borderTopColor: 'var(--destructive-foreground)' }}
                                                    ></div>
                                                    <span>กำลังเข้าสู่ระบบ...</span>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Enhanced Google Icon with hover animation */}
                                                    <div className="transition-transform duration-300 group-hover:rotate-12">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 48 48"
                                                            className="drop-shadow-sm"
                                                        >
                                                            <path
                                                                fill="#FFC107"
                                                                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                                                            ></path>
                                                            <path
                                                                fill="#FF3D00"
                                                                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                                                            ></path>
                                                            <path
                                                                fill="#4CAF50"
                                                                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                                                            ></path>
                                                            <path
                                                                fill="#1976D2"
                                                                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                                                            ></path>
                                                        </svg>
                                                    </div>
                                                    <span className="transition-all duration-300 group-hover:tracking-wide">
                                                        เข้าสู่ระบบด้วย Google
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </button>

                                    {/* Feature highlights */}
                                    <div className="grid grid-cols-3 gap-4 pt-4">
                                        <div className="group text-center">
                                            <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                                                <Shield size={20} style={{ color: 'var(--primary)' }} />
                                            </div>
                                            <p className="text-muted-foreground text-xs">ปลอดภัย</p>
                                        </div>
                                        <div className="group text-center">
                                            <div className="bg-secondary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                                                <Clock size={20} style={{ color: 'var(--secondary)' }} />
                                            </div>
                                            <p className="text-muted-foreground text-xs">รวดเร็ว</p>
                                        </div>
                                        <div className="group text-center">
                                            <div className="bg-accent/20 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                                                <Users size={20} style={{ color: 'var(--accent-foreground)' }} />
                                            </div>
                                            <p className="text-muted-foreground text-xs">เฉพาะพนักงาน</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="border-border border-t pt-4 text-center">
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        ระบบสำหรับพนักงานของบริษัทเท่านั้น
                                        <br />
                                        <span className="text-xs opacity-75">Powered by Smart Attendance System</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Additional floating elements using theme colors */}
                        <div
                            className="absolute -top-4 -left-4 h-8 w-8 animate-bounce rounded-full opacity-30"
                            style={{ background: 'var(--primary)', animationDelay: '0.5s', animationDuration: '2s' }}
                        ></div>
                        <div
                            className="absolute -top-2 -right-6 h-4 w-4 animate-bounce rounded-full opacity-20"
                            style={{ background: 'var(--secondary)', animationDelay: '1.5s', animationDuration: '2.5s' }}
                        ></div>
                        <div
                            className="absolute -bottom-6 -left-2 h-6 w-6 animate-bounce rounded-full opacity-25"
                            style={{ background: 'var(--accent)', animationDelay: '2s', animationDuration: '3s' }}
                        ></div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
            `}</style>
        </>
    );
}
