import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Task } from '../../models/task';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  dashboardModel: 'classic' | 'compact' | 'spotlight' = 'spotlight';
  totalTasks = 0;
  todoCount = 0;
  inprogressCount = 0;
  doneCount = 0;
  deliveredCount = 0;
  overdueCount = 0;
  todayCount = 0;
  thisWeekCount = 0;
  completionRate = 0;
  teamMembersCount = 0;
  recentTasks: Task[] = [];

  // Pie chart data
  pieChartData: Array<{ label: string; value: number; color: string }> = [];
  pieChartOptions: ChartConfiguration<'doughnut'>['options'];
  pieChartLabels: string[] = [];
  pieChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.initializePieChartOptions();
      this.loadFromStorage();
      this.loadModelFromStorage();
      this.computeMetrics();
    }
  }

  private initializePieChartOptions(): void {
    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: 12,
          titleFont: { size: 14, weight: 700 },
          bodyFont: { size: 13 },
          cornerRadius: 8,
          displayColors: true,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          yAlign: 'bottom',
          xAlign: 'center',
          callbacks: {
            title: (context: any) => {
              return context[0]?.label || '';
            },
            label: (context: any) => {
              const value = context.raw || 0;
              const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `Tasks: ${value} (${percentage}%)`;
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: false,
        duration: 800,
        easing: 'easeInOutQuart'
      }
    } as any;
  }

  setModel(model: string) {
    if (model === 'classic' || model === 'compact' || model === 'spotlight') {
      this.dashboardModel = model;
      try { localStorage.setItem('dashboard_model', model); } catch {}
    }
  }

  private loadModelFromStorage(): void {
    try {
      const m = localStorage.getItem('dashboard_model');
      if (m === 'classic' || m === 'compact' || m === 'spotlight') this.dashboardModel = m;
    } catch {}
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

    // Count unique assignees
    const uniqueAssignees = new Set<string>();
    all.forEach(task => {
      if (task.assignee && task.assignee.trim()) {
        uniqueAssignees.add(task.assignee);
      }
    });
    this.teamMembersCount = uniqueAssignees.size;

    this.recentTasks = all
      .slice()
      .sort((a, b) => (b.id || '').localeCompare(a.id || ''))
      .slice(0, 8);

    // Build pie chart data
    this.pieChartData = [
      { label: 'To Do', value: this.todoCount, color: '#3b82f6' },
      { label: 'In Progress', value: this.inprogressCount, color: '#f59e0b' },
      { label: 'Completed', value: this.doneCount, color: '#10b981' },
      { label: 'Delivered', value: this.deliveredCount, color: '#8b5cf6' }
    ].filter(item => item.value > 0);

    // Update Chart.js pie chart
    this.updatePieChart();
  }

  private updatePieChart(): void {
    this.pieChartLabels = this.pieChartData.map(item => item.label);
    const values = this.pieChartData.map(item => item.value);
    const colors = this.pieChartData.map(item => item.color);
    const borderColors = colors.map(color => color);

    this.pieChartDatasets = [
      {
        data: values,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 3,
        borderRadius: 6,
        hoverOffset: 10,
        hoverBorderWidth: 2,
        spacing: 2
      }
    ];
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

  getPieChartPercentage(value: number): number {
    const total = this.pieChartData.reduce((sum, item) => sum + item.value, 0);
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  getPieSlices() {
    const total = this.pieChartData.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return [];

    let cumulativeAngle = 0;
    return this.pieChartData.map(item => {
      const sliceAngle = (item.value / total) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + sliceAngle;
      cumulativeAngle = endAngle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const radius = 80;
      const x1 = 100 + radius * Math.cos(startRad);
      const y1 = 100 + radius * Math.sin(startRad);
      const x2 = 100 + radius * Math.cos(endRad);
      const y2 = 100 + radius * Math.sin(endRad);

      const largeArc = sliceAngle > 180 ? 1 : 0;
      const pathData = [
        `M 100 100`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      return {
        ...item,
        pathData,
        percentage: Math.round((item.value / total) * 100)
      };
    });
  }
}
