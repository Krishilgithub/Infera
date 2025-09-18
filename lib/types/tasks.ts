export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface TaskCreate {
    meeting_id: string;
    title: string;
    description?: string;
    assignee_id?: string;
    due_date?: string;
}

export interface TaskUpdate {
    id: string;
    status: TaskStatus;
    description?: string;
}

export interface Task {
    id: string;
    meeting_id: string;
    title: string;
    description?: string;
    assignee_id?: string;
    status: TaskStatus;
    due_date?: string;
    created_at: string;
    updated_at: string;
    assignee?: {
        id: string;
        full_name: string;
        avatar_url?: string;
    };
}