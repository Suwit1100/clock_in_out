import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangleIcon } from 'lucide-react';

interface AlertWarningProps {
    title?: string;
    message: string;
}

export default function AlertWarning({ title = 'คำเตือน', message }: AlertWarningProps) {
    return (
        <Alert className="border-yellow-300 bg-yellow-100 text-yellow-800 dark:border-yellow-600 dark:bg-yellow-900 dark:text-yellow-100">
            <AlertTriangleIcon className="h-5 w-5" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
