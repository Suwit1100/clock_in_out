import { Bell, Home, Settings, User } from 'lucide-react';

const menuItems = [
    { icon: Home, label: 'Home', href: '#home' },
    { icon: User, label: 'Profile', href: '#profile' },
    { icon: Bell, label: 'Notifications', href: '#notifications', badge: 3 },
    { icon: Settings, label: 'Settings', href: '#settings' },
    { icon: Settings, label: 'ย้อนหลัง', href: '/daily-report/history' },
];

export default function MenuItems({ isMobile }: { isMobile: boolean }) {
    return (
        <>
            {menuItems.map((item) => (
                <a
                    key={item.label}
                    href={item.href}
                    className={`hover:bg-muted relative flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        item.label === 'Home' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                    } ${isMobile ? 'text-base' : ''}`}
                >
                    <item.icon size={isMobile ? 20 : 16} />
                    <span>{item.label}</span>
                    {item.badge && (
                        <span
                            className={`bg-destructive absolute ${isMobile ? 'relative ml-auto' : '-top-1 -right-1'} flex h-5 w-5 items-center justify-center rounded-full text-xs text-white`}
                        >
                            {item.badge}
                        </span>
                    )}
                </a>
            ))}
        </>
    );
}
