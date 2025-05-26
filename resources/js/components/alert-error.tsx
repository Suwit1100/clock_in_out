// components/alert/AlertError.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircleIcon } from 'lucide-react';

interface AlertErrorProps {
    title?: string;
    message: string;
}

export default function AlertError({ title = 'เกิดข้อผิดพลาด', message }: AlertErrorProps) {
    return (
        <Alert className="border-destructive bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground border">
            <XCircleIcon className="h-5 w-5" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
