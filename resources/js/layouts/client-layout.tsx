import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Bell, Home, Menu, Moon, Search, Settings, Sun, User, X } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

interface Props {
    children: ReactNode;
}

const menuItems = [
    { icon: Home, label: 'Home', href: '#home' },
    { icon: User, label: 'Profile', href: '#profile' },
    { icon: Bell, label: 'Notifications', href: '#notifications', badge: 3 },
    { icon: Settings, label: 'Settings', href: '#settings' },
    { icon: Settings, label: 'ย้อนหลัง', href: '/daily-report/history' },
];

const SearchInput = () => (
    <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="text-muted-foreground h-4 w-4" />
        </div>
        <input
            type="text"
            placeholder="Search..."
            className="border-border bg-input text-foreground placeholder-muted-foreground focus:ring-ring block w-full rounded-lg border px-10 py-2 text-sm transition-colors duration-200 focus:ring-2 focus:outline-none"
        />
    </div>
);

const UserAvatar = ({ name, isMobile = false }: { name: string; isMobile?: boolean }) => (
    <div className={`flex items-center space-x-3 ${isMobile ? 'border-border border-t px-3 py-3' : 'hidden sm:flex'}`}>
        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-medium">{name.charAt(0)}</div>
        <div>
            <div className="text-sm font-medium">{name}</div>
            <div className="text-muted-foreground text-xs">Online</div>
        </div>
    </div>
);

export default function MainLayout({ children }: Props) {
    const [isDark, setIsDark] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

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
        <div className="bg-background text-foreground flex min-h-screen flex-col transition-colors duration-300">
            {/* Navbar */}
            <nav className="border-border bg-background sticky top-0 z-50 border-b shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo & Menu */}
                        <div className="flex items-center space-x-4">
                            <h1 className="text-primary text-xl font-bold">My App</h1>
                            <div className="hidden items-baseline space-x-4 md:flex">
                                {menuItems.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className={`hover:bg-muted relative flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                            item.label === 'Home' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                                        }`}
                                    >
                                        <item.icon size={16} />
                                        <span>{item.label}</span>
                                        {item.badge && (
                                            <span className="bg-destructive absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                                                {item.badge}
                                            </span>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center space-x-4">
                            <UserAvatar name={user.name} />
                            <button
                                onClick={toggleTheme}
                                className="bg-primary text-primary-foreground rounded-lg p-2 transition hover:scale-105"
                                aria-label="Toggle theme"
                            >
                                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-muted-foreground hover:bg-muted inline-flex items-center justify-center rounded-md p-2 md:hidden"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`transition-all duration-300 ease-in-out md:hidden ${
                        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
                    }`}
                >
                    <div className="border-border bg-background space-y-1 border-t px-2 pt-2 pb-3">
                        {menuItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`hover:bg-muted relative flex items-center space-x-3 rounded-md px-3 py-2 text-base font-medium transition-colors ${
                                    item.label === 'Home' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                                }`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                                {item.badge && (
                                    <span className="bg-destructive ml-auto flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                                        {item.badge}
                                    </span>
                                )}
                            </a>
                        ))}
                        <UserAvatar name={user.name} isMobile />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8">{children}</main>

            {/* Footer */}
            <footer className="border-border bg-background mt-auto border-t py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} My App. All rights reserved.</p>
                        <div className="flex space-x-6">
                            {['Terms', 'Privacy', 'Contact'].map((label) => (
                                <a key={label} href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    {label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
