import { Link, usePage } from '@inertiajs/react';
import { FileText, Home, LucideIcon } from 'lucide-react';

type MenuItem = {
    icon: LucideIcon;
    label: string;
    href: string;
    badge?: number;
};

export default function MenuItems({ isMobile }: { isMobile: boolean }) {
    const { props } = usePage();
    const dailyReportId = props.dailyReportId as number | null;
    const { url } = usePage();

    const menuItems: MenuItem[] = [
        { icon: Home, label: 'Home', href: '/check-in-out' },
        // { icon: User, label: 'Profile', href: '#profile' },
        // { icon: Bell, label: 'Notifications', href: '#notifications', badge: 3 },
        // { icon: Settings, label: 'Settings', href: '#settings' },
        {
            icon: FileText,
            label: 'Daily',
            href: dailyReportId ? `/attendance/daily-report/${dailyReportId}/edit` : '/attendance/daily-report/create',
        },
        { icon: FileText, label: 'Report', href: '/attendance/history' },
    ];

    return (
        <>
            {menuItems.map((item: MenuItem) => {
                const isActive = url.startsWith(item.href); // เช็ก active path

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`hover:bg-muted relative flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
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
                    </Link>
                );
            })}
        </>
    );
}
