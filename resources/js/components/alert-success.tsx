// components/alert/AlertSuccess.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AlertSuccessProps {
    title?: string;
    message: string;
    duration?: number;
}

export default function AlertSuccess({ title = 'สำเร็จ', message, duration = 3000 }: AlertSuccessProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timeout);
    }, [duration]);

    if (!visible) return null;

    return (
        <Alert className="border border-green-300 bg-green-100 text-green-800 dark:border-green-600 dark:bg-green-900 dark:text-green-200">
            <CheckCircleIcon className="h-5 w-5" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
