// components/UserDropdown.tsx

import { useForm } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

interface Props {
    name: string;
    isMobile?: boolean;
}

export default function UserDropdown({ name, isMobile = false }: Props) {
    const [open, setOpen] = useState(false);
    const { post } = useForm();

    const handleLogout = () => {
        post(route('client.logout')); // <- Inertia POST
    };

    return (
        <div className={`relative ${isMobile ? 'border-border w-full border-t px-3 py-3' : 'hidden sm:block'}`}>
            <button onClick={() => setOpen(!open)} className="flex items-center space-x-3 focus:outline-none">
                <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-medium">
                    {name.charAt(0)}
                </div>
                <div className="text-left">
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-muted-foreground text-xs">Online</div>
                </div>
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div
                    className={`border-border bg-popover absolute right-0 mt-2 w-48 rounded-md border shadow-lg ${
                        isMobile ? 'relative mt-3 w-full' : ''
                    }`}
                >
                    <button
                        onClick={handleLogout}
                        className="hover:bg-muted text-muted-foreground flex w-full items-center space-x-2 px-4 py-2 text-left text-sm transition-colors"
                    >
                        <LogOut size={16} />
                        <span>ออกจากระบบ</span>
                    </button>
                </div>
            )}
        </div>
    );
}
