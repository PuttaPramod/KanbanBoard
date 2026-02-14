import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Task } from '../../models/task';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  totalTasks = 0;
  todoCount = 0;
  inprogressCount = 0;
  doneCount = 0;
  deliveredCount = 0;
  overdueCount = 0;
  todayCount = 0;
  thisWeekCount = 0;
  completionRate = 0;
  recentTasks: Task[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
      this.computeMetrics();
    }
  }

  private loadFromStorage(): void {
    try {
      const v2 = localStorage.getItem('kanban_pro_v2');
      if (v2) {
        const p = JSON.parse(v2);
        const listByStatus: Record<string, Task[]> = p.listByStatus || {};
        const all: Task[] = [];
        Object.values(listByStatus).forEach((arr: unknown) => {
          if (Array.isArray(arr)) all.push(...arr);
        });
        this.recentTasks = all;
        return;
      }
      const v1 = localStorage.getItem('kanban_pro_v1');
      if (v1) {
        const p = JSON.parse(v1);
        const todo = p.todo || [];
        const inprogress = p.inprogress || [];
        const done = p.done || [];
        const delivered = p.delivered || [];
        this.recentTasks = [...todo, ...inprogress, ...done, ...delivered];
      }
    } catch {
      this.recentTasks = [];
    }
  }

  private computeMetrics(): void {
    const all = this.recentTasks;
    this.todoCount = all.filter(t => t.status === 'todo').length;
    this.inprogressCount = all.filter(t => t.status === 'inprogress').length;
    this.doneCount = all.filter(t => t.status === 'done').length;
    this.deliveredCount = all.filter(t => t.status === 'delivered').length;
    this.totalTasks = all.length;

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    const startOfWeek = new Date(todayStart);
    startOfWeek.setDate(todayStart.getDate() - todayStart.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    this.overdueCount = 0;
    this.todayCount = 0;
    this.thisWeekCount = 0;
    all.forEach(task => {
      if (!task.dueDate) return;
      const d = new Date(task.dueDate + 'T00:00:00');
      if (d < todayStart) this.overdueCount++;
      if (d >= todayStart && d <= todayEnd) this.todayCount++;
      if (d >= startOfWeek && d <= endOfWeek) this.thisWeekCount++;
    });

    const completedTotal = this.doneCount + this.deliveredCount;
    this.completionRate = this.totalTasks > 0 ? Math.round((completedTotal / this.totalTasks) * 100) : 0;

    this.recentTasks = all
      .slice()
      .sort((a, b) => (b.id || '').localeCompare(a.id || ''))
      .slice(0, 8);
  }

  getStatusLabel(task: Task): string {
    switch (task.status) {
      case 'todo': return 'To Do';
      case 'inprogress': return 'In Progress';
      case 'done': return 'Completed';
      case 'delivered': return 'Delivered';
      default: return (task.status?.startsWith('custom-') ? 'Custom' : task.status) || 'Other';
    }
  }

  getStatusClass(task: Task): string {
    switch (task.status) {
      case 'todo': return 'todo';
      case 'inprogress': return 'inprogress';
      case 'done': return 'done';
      case 'delivered': return 'delivered';
      default: return 'custom';
    }
  }
}
