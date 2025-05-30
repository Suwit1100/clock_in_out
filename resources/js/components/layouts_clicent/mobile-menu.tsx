import UserDropdown from '@/components/user-dropdown';
import MenuItems from './menu-items';

export default function MobileMenu({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user: { name: string } }) {
    return (
        <div className={`transition-all duration-300 ease-in-out md:hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}>
            <div className="border-border bg-background space-y-1 border-t px-2 pt-2 pb-3">
                <MenuItems isMobile />
                <UserDropdown name={user.name} isMobile />
            </div>
        </div>
    );
}
