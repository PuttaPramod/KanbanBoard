export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done' | 'delivered'; // <-- Add 'delivered'
  dueDate?: string;
  completedDate?: string;
  deliveredDate?: string;
}