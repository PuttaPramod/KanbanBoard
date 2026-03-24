import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Task } from '../../models/task';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

type StatusDef = { id: string; title: string; color: string };
const BASE_STATUS_DEFS: StatusDef[] = [
  { id: 'todo', title: 'To Do', color: '#14b8a6' },
  { id: 'inprogress', title: 'In Progress', color: '#f59e0b' },
  { id: 'done', title: 'Completed', color: '#22c55e' },
  { id: 'delivered', title: 'Delivered', color: '#0ea5e9' }
];
const EXTRA_STATUS_COLORS = ['#8b5cf6', '#ef4444', '#6366f1', '#f97316', '#84cc16', '#06b6d4'];

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
  allTasks: Task[] = [];
  atRiskCount = 0;
  topAssignee = 'Unassigned';
  focusTitle = 'All systems healthy';
  focusMessage = 'No urgent risks detected.';
  priorityCounts: Record<'Low' | 'Medium' | 'High', number> = { Low: 0, Medium: 0, High: 0 };
  statusMix: Array<{ key: string; label: string; count: number; percent: number; tone: string }> = [];
  assigneeLoad: Array<{ name: string; total: number; active: number; completed: number }> = [];
  actionSignals: Array<{ title: string; value: string; tone: 'alert' | 'good' | 'info' }> = [];

  // Pie chart data
  pieChartData: Array<{ label: string; value: number; color: string }> = [];
  pieChartOptions: ChartConfiguration<'doughnut'>['options'];
  pieChartLabels: string[] = [];
  pieChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [];
  statusDefs: StatusDef[] = [...BASE_STATUS_DEFS];
  private statusTitleById: Record<string, string> = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Completed',
    delivered: 'Delivered'
  };
  private statusColorById: Record<string, string> = {
    todo: '#14b8a6',
    inprogress: '#f59e0b',
    done: '#22c55e',
    delivered: '#0ea5e9'
  };
  readonly completionRadius = 48;
  readonly completionCircumference = 2 * Math.PI * this.completionRadius;

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
      cutout: '0%',
      radius: '88%',
      rotation: -90,
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
          backgroundColor: 'rgba(8, 28, 36, 0.92)',
          padding: 12,
          titleFont: { size: 13, weight: 700 },
          bodyFont: { size: 12 },
          cornerRadius: 10,
          displayColors: true,
          borderColor: 'rgba(153, 246, 228, 0.28)',
          borderWidth: 1,
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
        animateScale: true,
        duration: 900,
        easing: 'easeOutCubic'
      }
    } as ChartConfiguration<'doughnut'>['options'];
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
        const columns: Array<{ id: string; title: string }> = Array.isArray(p.columns) ? p.columns : [];
        this.buildStatusDefinitions(columns, listByStatus);
        const all: Task[] = [];
        Object.values(listByStatus).forEach((arr: unknown) => {
          if (Array.isArray(arr)) all.push(...arr);
        });
        this.allTasks = all;
        return;
      }
      this.buildStatusDefinitions([], {});
      const v1 = localStorage.getItem('kanban_pro_v1');
      if (v1) {
        const p = JSON.parse(v1);
        const todo = p.todo || [];
        const inprogress = p.inprogress || [];
        const done = p.done || [];
        const delivered = p.delivered || [];
        this.allTasks = [...todo, ...inprogress, ...done, ...delivered];
      }
    } catch {
      this.allTasks = [];
    }
  }

  private computeMetrics(): void {
    const all = this.allTasks;
    const statusCountMap = new Map<string, number>();
    this.statusDefs.forEach(s => statusCountMap.set(s.id, 0));
    all.forEach(task => statusCountMap.set(task.status, (statusCountMap.get(task.status) || 0) + 1));
    this.todoCount = statusCountMap.get('todo') || 0;
    this.inprogressCount = statusCountMap.get('inprogress') || 0;
    this.doneCount = statusCountMap.get('done') || 0;
    this.deliveredCount = statusCountMap.get('delivered') || 0;
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

    // Risk: pending tasks due in next 48 hours
    const dueSoonLimit = new Date(todayEnd);
    dueSoonLimit.setDate(dueSoonLimit.getDate() + 2);
    this.atRiskCount = all.filter(task => {
      if (!task.dueDate) return false;
      const d = new Date(task.dueDate + 'T23:59:59');
      const isPending = task.status !== 'done' && task.status !== 'delivered';
      return isPending && d >= todayStart && d <= dueSoonLimit;
    }).length;

    const completedTotal = this.doneCount + this.deliveredCount;
    this.completionRate = this.totalTasks > 0 ? Math.round((completedTotal / this.totalTasks) * 100) : 0;

    // Count unique assignees
    const uniqueAssignees = new Set<string>();
    const assigneeCount = new Map<string, number>();
    all.forEach(task => {
      if (task.assignee && task.assignee.trim()) {
        const assignee = task.assignee.trim();
        uniqueAssignees.add(assignee);
        assigneeCount.set(assignee, (assigneeCount.get(assignee) || 0) + 1);
      }
    });
    this.teamMembersCount = uniqueAssignees.size;
    this.topAssignee = this.getTopAssignee(assigneeCount);
    this.updateFocusBanner();
    this.updatePriorityAndUpcoming();
    this.updateStatusMix(statusCountMap);
    this.updateAssigneeLoad();
    this.updateActionSignals();

    // Build pie chart data
    this.pieChartData = this.statusDefs
      .map(def => ({ label: def.title, value: statusCountMap.get(def.id) || 0, color: def.color }))
      .filter(item => item.value > 0);

    // Update Chart.js pie chart
    this.updatePieChart();
  }

  private getTopAssignee(assigneeCount: Map<string, number>): string {
    if (assigneeCount.size === 0) return 'Unassigned';
    let leader = 'Unassigned';
    let max = 0;
    assigneeCount.forEach((count, assignee) => {
      if (count > max) {
        max = count;
        leader = assignee;
      }
    });
    return leader;
  }

  private updateFocusBanner(): void {
    if (this.overdueCount > 0) {
      this.focusTitle = 'Attention needed';
      this.focusMessage = `${this.overdueCount} overdue task${this.overdueCount > 1 ? 's are' : ' is'} blocking flow.`;
      return;
    }
    if (this.atRiskCount > 0) {
      this.focusTitle = 'Due soon pressure';
      this.focusMessage = `${this.atRiskCount} pending task${this.atRiskCount > 1 ? 's are' : ' is'} due in the next 48 hours.`;
      return;
    }
    if (this.completionRate >= 70) {
      this.focusTitle = 'Strong momentum';
      this.focusMessage = `Completion is at ${this.completionRate}% with steady delivery pace.`;
      return;
    }
    this.focusTitle = 'Build momentum';
    this.focusMessage = 'Move active work to done to lift sprint velocity.';
  }

  private updatePriorityAndUpcoming(): void {
    this.priorityCounts = { Low: 0, Medium: 0, High: 0 };
    const pending = this.allTasks.filter(task => task.status !== 'done' && task.status !== 'delivered');

    pending.forEach(task => {
      if (task.priority === 'Low' || task.priority === 'Medium' || task.priority === 'High') {
        this.priorityCounts[task.priority]++;
      }
    });

  }

  private updateAssigneeLoad(): void {
    const summary = new Map<string, { total: number; active: number; completed: number }>();

    this.allTasks.forEach(task => {
      const name = task.assignee?.trim() || 'Unassigned';
      const current = summary.get(name) || { total: 0, active: 0, completed: 0 };
      current.total += 1;
      if (task.status === 'done' || task.status === 'delivered') current.completed += 1;
      else current.active += 1;
      summary.set(name, current);
    });

    this.assigneeLoad = Array.from(summary.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
      .slice(0, 4);
  }

  private updateActionSignals(): void {
    const activeWork = this.todoCount + this.inprogressCount;
    this.actionSignals = [
      {
        title: 'Active Queue',
        value: `${activeWork} task${activeWork === 1 ? '' : 's'} in motion`,
        tone: activeWork > 4 ? 'alert' : 'info'
      },
      {
        title: 'Delivery Pace',
        value: `${this.doneCount + this.deliveredCount} task${this.doneCount + this.deliveredCount === 1 ? '' : 's'} finished`,
        tone: this.completionRate >= 60 ? 'good' : 'info'
      },
      {
        title: 'Deadline Pressure',
        value: this.overdueCount > 0 ? `${this.overdueCount} overdue right now` : `${this.todayCount} due today`,
        tone: this.overdueCount > 0 ? 'alert' : 'info'
      }
    ];
  }

  private updateStatusMix(statusCountMap: Map<string, number>): void {
    const safeTotal = this.totalTasks || 1;
    this.statusMix = this.statusDefs.map(def => {
      const count = statusCountMap.get(def.id) || 0;
      return {
        key: def.id,
        label: def.title,
        count,
        percent: Math.round((count / safeTotal) * 100),
        tone: def.id
      };
    });
  }

  private buildStatusDefinitions(
    columns: Array<{ id: string; title: string }>,
    listByStatus: Record<string, Task[]>
  ): void {
    const defs = [...BASE_STATUS_DEFS];
    const seen = new Set(defs.map(d => d.id));
    const provided = Array.isArray(columns) && columns.length > 0
      ? columns
      : Object.keys(listByStatus).map(id => ({ id, title: this.formatStatusTitle(id) }));

    provided.forEach((col, idx) => {
      if (!col?.id || seen.has(col.id)) return;
      const color = this.getCustomStatusColor(col.id, idx);
      defs.push({ id: col.id, title: col.title || this.formatStatusTitle(col.id), color });
      seen.add(col.id);
    });

    provided.forEach(col => {
      const base = defs.find(d => d.id === col.id);
      if (base && col.title?.trim()) base.title = col.title.trim();
    });

    this.statusDefs = defs;
    this.statusTitleById = {};
    this.statusColorById = {};
    defs.forEach(def => {
      this.statusTitleById[def.id] = def.title;
      this.statusColorById[def.id] = def.color;
    });
  }

  private formatStatusTitle(status: string): string {
    if (!status) return 'Other';
    if (status.startsWith('custom-')) return 'Custom';
    return status
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  getDueBadge(task: Task): string {
    if (!task.dueDate) return 'No due date';
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const due = new Date(task.dueDate + 'T00:00:00');
    const diffDays = Math.round((due.getTime() - todayStart.getTime()) / (24 * 60 * 60 * 1000));
    if (diffDays < 0) return `Overdue ${Math.abs(diffDays)}d`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays}d`;
  }

  getPriorityPercent(level: 'Low' | 'Medium' | 'High'): number {
    const total = this.priorityCounts.Low + this.priorityCounts.Medium + this.priorityCounts.High;
    if (!total) return 0;
    return Math.round((this.priorityCounts[level] / total) * 100);
  }

  getPriorityClass(level: string): string {
    const normalized = (level || '').toLowerCase();
    if (normalized === 'high') return 'high';
    if (normalized === 'medium') return 'medium';
    return 'low';
  }

  getAssigneeCompletion(stats: { total: number; completed: number }): number {
    if (!stats.total) return 0;
    return Math.round((stats.completed / stats.total) * 100);
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
        borderColor: '#dfe8ed',
        borderWidth: 2,
        borderRadius: 0,
        hoverOffset: 0,
        hoverBorderWidth: 0,
        spacing: 0
      }
    ];
  }

  getCompletionOffset(): number {
    return this.completionCircumference * (1 - this.completionRate / 100);
  }

  getStatusLabel(task: Task): string {
    return this.statusTitleById[task.status] || this.formatStatusTitle(task.status);
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

  getStatusBadgeStyle(task: Task): Record<string, string> | null {
    if (task.status === 'todo' || task.status === 'inprogress' || task.status === 'done' || task.status === 'delivered') {
      return null;
    }
    const hex = this.statusColorById[task.status] || '#94a3b8';
    return {
      color: hex,
      background: this.withAlpha(hex, 0.16),
      borderColor: this.withAlpha(hex, 0.36)
    };
  }

  getStatusMixStyle(key: string): Record<string, string> {
    return { background: this.statusColorById[key] || '#94a3b8' };
  }

  private withAlpha(hex: string, alpha: number): string {
    const clean = hex.replace('#', '');
    const full = clean.length === 3
      ? clean.split('').map(c => c + c).join('')
      : clean;
    const num = Number.parseInt(full, 16);
    if (Number.isNaN(num)) return `rgba(148, 163, 184, ${alpha})`;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private getCustomStatusColor(statusId: string, seedIndex: number): string {
    let hash = 0;
    for (let i = 0; i < statusId.length; i++) hash = (hash * 31 + statusId.charCodeAt(i)) >>> 0;
    const idx = (hash + seedIndex) % EXTRA_STATUS_COLORS.length;
    return EXTRA_STATUS_COLORS[idx];
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
