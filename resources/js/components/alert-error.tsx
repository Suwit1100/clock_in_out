// components/alert/AlertError.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AlertErrorProps {
    title?: string;
    message: string;
    duration?: number; // เพิ่ม optional timeout
}

export default function AlertError({ title = 'เกิดข้อผิดพลาด', message, duration = 3000 }: AlertErrorProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timeout);
    }, [duration]);

    if (!visible) return null;

    return (
        <Alert className="border-destructive bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground border">
            <XCircleIcon className="h-5 w-5" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
