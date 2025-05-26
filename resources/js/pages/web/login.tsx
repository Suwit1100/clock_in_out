import { Head } from '@inertiajs/react';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Login() {
    const [isDark, setIsDark] = useState(false);

    // ตรวจสอบธีมปัจจุบันเมื่อโหลด
    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
        document.documentElement.classList.toggle('dark', prefersDark);
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        document.documentElement.classList.toggle('dark', newTheme);
    };

    return (
        <>
            <Head title="Login" />
            <div className="bg-background flex min-h-screen items-center justify-center px-4">
                <div className="bg-card border-border w-full max-w-md space-y-6 rounded-2xl border p-10 shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div />
                        {/* Toggle Theme */}
                        <button
                            onClick={toggleTheme}
                            className="bg-muted text-muted-foreground rounded-full p-2 transition hover:scale-105"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>

                    <div className="text-center">
                        <img src="/clock_logo.png" alt="Smart Attendance Logo" className="mx-auto h-20 w-20 rounded-full shadow" />
                        <h1 className="text-foreground mt-4 text-2xl font-bold">เข้าสู่ระบบ Clock in - Clock out</h1>
                        <p className="text-muted-foreground mt-1 text-sm">โปรดเข้าสู่ระบบด้วยบัญชี Google ของคุณ</p>
                    </div>

                    <button
                        onClick={() => (window.location.href = route('auth.google.redirect'))}
                        className="group bg-destructive hover:bg-destructive/90 focus:ring-destructive relative flex w-full items-center justify-center gap-3 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-md transition duration-200 focus:ring-4 focus:outline-none"
                    >
                        {/* Google Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
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
                        เข้าสู่ระบบด้วย Google
                    </button>

                    <p className="text-muted-foreground text-center text-xs">ระบบสำหรับพนักงานของบริษัทเท่านั้น</p>
                </div>
            </div>
        </>
    );
}
