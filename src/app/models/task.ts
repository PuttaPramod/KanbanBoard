export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'inprogress' | 'done' | 'delivered';
  dueDate?: string;
  completedDate?: string;
  deliveredDate?: string;
  priority?: 'low' | 'medium' | 'high';
}
