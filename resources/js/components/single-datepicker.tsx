import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

export function SingleDatePicker({
    date,
    onChange,
    placeholder = 'เลือกวันที่', // ค่า default
}: {
    date: Date | null;
    onChange: (d: Date) => void;
    placeholder?: string; // <= เพิ่มตรงนี้
}) {
    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="hover:border-ring focus:border-ring w-full justify-start py-5.5 text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span className="text-muted-foreground">{placeholder}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date ?? undefined} onSelect={(d) => d && onChange(d)} initialFocus />
                </PopoverContent>
            </Popover>
        </div>
    );
}
