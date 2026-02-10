import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Task } from '../../models/task';
import { RouterModule } from '@angular/router';

interface StoredTasks {
  todo: Task[];
  inprogress: Task[];
  done: Task[];
  delivered: Task[];
}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  // Raw arrays from storage
  todo: Task[] = [];
  inprogress: Task[] = [];
  done: Task[] = [];
  delivered: Task[] = [];

  // Metrics
  totalTasks = 0;
  todoCount = 0;
  inprogressCount = 0;
  doneCount = 0;
  deliveredCount = 0;

  overdueCount = 0;
  todayCount = 0;
  thisWeekCount = 0;
  completionRate = 0; // in %

  recentTasks: Task[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
      this.computeMetrics();
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('kanban_tasks');
      if (data) {
        const parsed = JSON.parse(data) as StoredTasks;
        this.todo = parsed.todo || [];
        this.inprogress = parsed.inprogress || [];
        this.done = parsed.done || [];
        this.delivered = parsed.delivered || [];
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      this.todo = [];
      this.inprogress = [];
      this.done = [];
      this.delivered = [];
    }
  }

  private computeMetrics(): void {
    this.todoCount = this.todo.length;
    this.inprogressCount = this.inprogress.length;
    this.doneCount = this.done.length;
    this.deliveredCount = this.delivered.length;

    this.totalTasks =
      this.todoCount + this.inprogressCount + this.doneCount + this.deliveredCount;

    // Overdue, Today, This Week (based on dueDate)
    const allTasks: Task[] = [
      ...this.todo,
      ...this.inprogress,
      ...this.done,
      ...this.delivered
    ];

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const startOfWeek = new Date(todayStart);
    startOfWeek.setDate(todayStart.getDate() - todayStart.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    this.overdueCount = 0;
    this.todayCount = 0;
    this.thisWeekCount = 0;

    allTasks.forEach(task => {
      if (!task.dueDate) return;
      const d = new Date(task.dueDate);

      if (d < todayStart) {
        this.overdueCount++;
      }
      if (d >= todayStart && d <= todayEnd) {
        this.todayCount++;
      }
      if (d >= startOfWeek && d <= endOfWeek) {
        this.thisWeekCount++;
      }
    });

    // Completion rate: done + delivered vs total
    const completedTotal = this.doneCount + this.deliveredCount;
    this.completionRate =
      this.totalTasks > 0 ? Math.round((completedTotal / this.totalTasks) * 100) : 0;

    // Recent tasks: sort by id desc (since you used Date.now() as id)
    this.recentTasks = allTasks
      .slice()
      .sort((a, b) => b.id - a.id)
      .slice(0, 6);
  }

  getStatusLabel(task: Task): string {
    switch (task.status) {
      case 'todo':
        return 'New';
      case 'inprogress':
        return 'In Progress';
      case 'done':
        return 'Completed';
      case 'delivered':
        return 'Delivered';
      default:
        return task.status;
    }
  }
}
