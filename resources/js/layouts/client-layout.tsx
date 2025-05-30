import Footer from '@/components/layouts_clicent/footer';
import Navbar from '@/components/layouts_clicent/navbar';
import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export default function MainLayout({ children }: Props) {
    const [isDark, setIsDark] = useState(false);
    const { auth } = usePage<SharedData>().props;

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', newTheme);
    };

    return (
        <div className="bg-background text-foreground flex min-h-screen flex-col transition-colors duration-300">
            <Navbar user={auth.user} isDark={isDark} toggleTheme={toggleTheme} />
            <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8">{children}</main>
            <Footer />
        </div>
    );
}
