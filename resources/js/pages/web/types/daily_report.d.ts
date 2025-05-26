export interface Task {
    task_type: string;
    project_name: string;
}

export interface DailyReportForm {
    summary_text: string;
    tasks: Task[];
    [key: string]: any;
}
