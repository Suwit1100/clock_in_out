import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface ConfirmDeleteDialogProps {
    children: ReactNode; // ปุ่ม trigger ด้านนอก เช่นไอคอนลบ
    title?: string;
    description?: string;
    onConfirm: () => void;
    loading?: boolean;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
    children,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    onConfirm,
    loading = false,
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
