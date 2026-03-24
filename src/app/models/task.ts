export interface Task {
  id: string;
  title: string;
  description?: string;
  /** Column id (built-in: todo, inprogress, done, delivered; or custom-xxx) */
  status: string;
  priority: 'Low' | 'Medium' | 'High';
  assignee: string;
  dueDate?: string;
  completedDate?: string;
  deliveredDate?: string;
}