// components/alert/AlertWarning.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AlertWarningProps {
    title?: string;
    message: string;
    duration?: number; // default 5000ms (5 วินาที)
}

export default function AlertWarning({ title = 'คำเตือน', message, duration = 3000 }: AlertWarningProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timeout);
    }, [duration]);

    if (!visible) return null;

    return (
        <Alert className="border-yellow-300 bg-yellow-100 text-yellow-800 dark:border-yellow-600 dark:bg-yellow-900 dark:text-yellow-100">
            <AlertTriangleIcon className="h-5 w-5" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
