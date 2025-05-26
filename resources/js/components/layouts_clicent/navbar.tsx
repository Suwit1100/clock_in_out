import UserDropdown from '@/components/user-dropdown';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import MenuItems from './menu-items';
import MobileMenu from './mobile-menu';

export default function Navbar({ user, isDark, toggleTheme }: { user: { name: string }; isDark: boolean; toggleTheme: () => void }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="border-border bg-background sticky top-0 z-50 border-b shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-primary text-xl font-bold">Smart Attendance</h1>
                        <div className="hidden items-baseline space-x-4 md:flex">
                            <MenuItems isMobile={false} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <UserDropdown name={user.name} />
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
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} user={user} />
        </nav>
    );
}
