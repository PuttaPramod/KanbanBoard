import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSignal = signal<Record<string, Task[]>>({
    todo: [],
    inprogress: [],
    done: [],
    delivered: []
  });

  tasks = this.tasksSignal.asReadonly();

  // Computed statistics
  totalTasks = computed(() => {
    const allTasks = Object.values(this.tasksSignal()).flat();
    return allTasks.length;
  });

  todoCount = computed(() => {
    return this.tasksSignal()['todo']?.length || 0;
  });

  inProgressCount = computed(() => {
    return this.tasksSignal()['inprogress']?.length || 0;
  });

  completedCount = computed(() => {
    const done = this.tasksSignal()['done']?.length || 0;
    const delivered = this.tasksSignal()['delivered']?.length || 0;
    return done + delivered;
  });

  recentTasks = computed(() => {
    const allTasks = Object.values(this.tasksSignal()).flat();
    // Return last 5 tasks (most recent first)
    return allTasks.slice(-5).reverse();
  });

  constructor() {
    this.loadTasksFromStorage();
  }

  private loadTasksFromStorage(): void {
    try {
      const stored = localStorage.getItem('kanban_pro_v2');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.listByStatus && typeof data.listByStatus === 'object') {
          this.tasksSignal.set(data.listByStatus);
        }
      }
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
    }
  }

  /**
   * Refresh tasks from storage
   */
  refreshTasks(): void {
    this.loadTasksFromStorage();
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Object.values(this.tasksSignal()).flat();
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: string): Task[] {
    return this.tasksSignal()[status] || [];
  }
}
