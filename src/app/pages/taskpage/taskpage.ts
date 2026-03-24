import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Task } from '../../models/task';

const DEFAULT_COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Completed' },
  { id: 'delivered', title: 'Delivered' }
] as const;

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './taskpage.html',
  styleUrls: ['./taskpage.css']
})
export class TaskPage implements OnInit {
  pageEnter = false;
  notifications: Array<{
    id: number;
    type: 'success' | 'info' | 'warning' | 'danger';
    title: string;
    message: string;
    time: string;
  }> = [];
  private notificationSeed = 0;

  // Task lists keyed by column id (supports built-in + custom columns)
  listByStatus: Record<string, Task[]> = {
    todo: [],
    inprogress: [],
    done: [],
    delivered: []
  };

  // Modal State
  isModalOpen = false;
  editingTask: Task | null = null;
  tempTask: Partial<Task> = {};
  
  // UI State
  viewMode: 'all' | 'today' = 'all';
  showUndo = false;
  searchQuery = '';
  priorityFilter: '' | Task['priority'] = '';
  assigneeFilter = '';

  columns: { id: string; title: string }[] = [...DEFAULT_COLUMNS];

  // Add column modal
  isAddColumnModalOpen = false;
  newColumnTitle = '';

  // Edit column inline
  editingColumnId: string | null = null;
  editingColumnTitle = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
      this.replayPageEnterAnimation();
    }
  }

  private replayPageEnterAnimation(): void {
    this.pageEnter = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.pageEnter = true;
      });
    });
  }
  isExpired(dueDate?: string): boolean {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dueDate + 'T00:00:00');
    return d < today;
  }

  /** Due within the next 3 days (excluding today if not overdue) */
  isDueSoon(dueDate?: string): boolean {
    if (!dueDate || this.isExpired(dueDate)) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate + 'T00:00:00');
    const daysUntil = Math.ceil((due.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    return daysUntil >= 1 && daysUntil <= 3;
  }

  matchesFilter(task: Task): boolean {
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = (task.description ?? '').toLowerCase().includes(q);
      const matchId = task.id.toLowerCase().includes(q);
      const matchAssignee = (task.assignee ?? '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchId && !matchAssignee) return false;
    }
    if (this.priorityFilter && task.priority !== this.priorityFilter) return false;
    if (this.assigneeFilter && (task.assignee ?? '').toLowerCase() !== this.assigneeFilter.toLowerCase()) return false;
    return true;
  }

  get assigneeOptions(): string[] {
    const set = new Set<string>();
    this.columns.forEach(col => {
      this.getListByStatus(col.id).forEach(t => {
        if (t.assignee?.trim()) set.add(t.assignee.trim());
      });
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  get totalTaskCount(): number {
    return this.columns.reduce((sum, col) => sum + this.getListByStatus(col.id).length, 0);
  }

  get overdueTaskCount(): number {
    let count = 0;
    this.columns.forEach(col => {
      this.getListByStatus(col.id).forEach(t => {
        if (this.isExpired(t.dueDate)) count++;
      });
    });
    return count;
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchQuery.trim() || this.priorityFilter || this.assigneeFilter);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.priorityFilter = '';
    this.assigneeFilter = '';
    this.cdr.markForCheck();
  }

  getFilteredCount(status: string): number {
    return this.getListByStatus(status).filter(t => this.matchesFilter(t)).length;
  }

  isColumnCustom(col: { id: string }): boolean {
    return col.id.startsWith('custom-');
  }

  openAddColumnModal(): void {
    this.newColumnTitle = '';
    this.isAddColumnModalOpen = true;
  }

  closeAddColumnModal(): void {
    this.isAddColumnModalOpen = false;
    this.newColumnTitle = '';
  }

  saveNewColumn(): void {
    const title = this.newColumnTitle.trim();
    if (!title) return;
    const id = 'custom-' + Date.now();
    this.columns.push({ id, title });
    this.listByStatus[id] = [];
    this.saveToStorage();
    this.closeAddColumnModal();
    this.pushNotification('info', 'Column created', `"${title}" is ready for tasks.`);
    this.cdr.markForCheck();
  }

  startEditColumn(col: { id: string; title: string }): void {
    this.editingColumnId = col.id;
    this.editingColumnTitle = col.title;
  }

  saveEditColumn(): void {
    if (this.editingColumnId == null) return;
    const title = this.editingColumnTitle.trim();
    if (title) {
      const col = this.columns.find(c => c.id === this.editingColumnId);
      if (col) col.title = title;
      this.saveToStorage();
    }
    this.editingColumnId = null;
    this.editingColumnTitle = '';
    this.cdr.markForCheck();
  }

  cancelEditColumn(): void {
    this.editingColumnId = null;
    this.editingColumnTitle = '';
    this.cdr.markForCheck();
  }

  deleteColumn(col: { id: string; title: string }): void {
    if (!this.isColumnCustom(col)) return;
    const count = this.getListByStatus(col.id).length;
    const message = count > 0
      ? `Delete column "${col.title}" and its ${count} task(s)?`
      : `Delete column "${col.title}"?`;
    if (!confirm(message)) return;
    this.columns = this.columns.filter(c => c.id !== col.id);
    delete this.listByStatus[col.id];
    this.saveToStorage();
    this.pushNotification('danger', 'Column deleted', `"${col.title}" was removed.`);
    this.cdr.markForCheck();
  }

  onSearchChange(): void {
    this.cdr.markForCheck();
  }

  onFilterChange(): void {
    this.cdr.markForCheck();
  }

  onAssigneeFilterChange(): void {
    this.cdr.markForCheck();
  }

  /* --- MODAL LOGIC --- */
  openTaskModal(task?: Task, defaultStatus?: string) {
    if (task) {
      this.editingTask = task;
      this.tempTask = { ...task };
    } else {
      this.editingTask = null;
      this.tempTask = {
        title: '',
        description: '',
        priority: 'Medium',
        assignee: '',
        dueDate: new Date().toISOString().split('T')[0],
        status: defaultStatus ?? 'todo'
      };
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.tempTask = {};
  }

  saveTask() {
    if (!this.tempTask.title?.trim()) return;

    if (this.editingTask) {
      const previousTitle = this.editingTask.title;
      Object.assign(this.editingTask, this.tempTask);
      if (this.tempTask.description === undefined) this.editingTask.description = '';
      const label = this.editingTask.id || previousTitle || 'Task';
      this.pushNotification('warning', 'Task updated', `${label} was updated.`);
    } else {
      const newTask: Task = {
        ...(this.tempTask as Task),
        id: `TSK-${Math.floor(Math.random() * 9000) + 1000}`,
        status: (this.tempTask.status as string) ?? 'todo',
        description: this.tempTask.description ?? ''
      };
      const list = this.getListByStatus(newTask.status);
      list.unshift(newTask);
      const colLabel = this.getColumnTitle(newTask.status);
      this.pushNotification('success', 'Task added', `${newTask.id} added to ${colLabel}.`);
    }
    this.saveToStorage();
    this.closeModal();
  }

  /* --- DRAG & DROP --- */
  drop(event: CdkDragDrop<Task[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const task = event.container.data[event.currentIndex];
      const previousStatus = task.status;
      task.status = newStatus;
      
      // Auto-set dates
      if (task.status === 'done') task.completedDate = new Date().toISOString();
      if (task.status === 'delivered') task.deliveredDate = new Date().toISOString();

      const fromLabel = this.getColumnTitle(previousStatus);
      const toLabel = this.getColumnTitle(newStatus);
      this.pushNotification('info', 'Task moved', `${task.id} moved from ${fromLabel} to ${toLabel}.`);
    }
    this.saveToStorage();
  }

  /* --- HELPERS --- */
  getListByStatus(status: string): Task[] {
    return this.listByStatus[status] ?? [];
  }

  confirmRemoveTask(task: Task, status: string) {
    if (confirm(`Delete ${task.id}?`)) {
      const list = this.getListByStatus(status);
      const idx = list.findIndex(t => t.id === task.id);
      if (idx > -1) list.splice(idx, 1);
      this.saveToStorage();
      this.pushNotification('danger', 'Task deleted', `${task.id} was removed.`);
    }
  }

  trackByFn(index: number, item: Task) { return item.id; }

  private saveToStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const data = { columns: this.columns, listByStatus: this.listByStatus };
      localStorage.setItem('kanban_pro_v2', JSON.stringify(data));
    }
  }

  private loadFromStorage() {
    const v2 = localStorage.getItem('kanban_pro_v2');
    if (v2) {
      const p = JSON.parse(v2);
      if (Array.isArray(p.columns) && p.columns.length > 0) {
        this.columns = p.columns;
      }
      if (p.listByStatus && typeof p.listByStatus === 'object') {
        this.listByStatus = { ...p.listByStatus };
      }
      this.columns.forEach(c => {
        if (!(c.id in this.listByStatus)) this.listByStatus[c.id] = [];
      });
      return;
    }
    // Migrate from v1
    const v1 = localStorage.getItem('kanban_pro_v1');
    if (v1) {
      const p = JSON.parse(v1);
      this.listByStatus = {
        todo: p.todo || [],
        inprogress: p.inprogress || [],
        done: p.done || [],
        delivered: p.delivered || []
      };
      this.saveToStorage();
    }
  }

  private getColumnTitle(status: string): string {
    const col = this.columns.find(c => c.id === status);
    return col?.title || status.replace(/[-_]+/g, ' ');
  }

  private pushNotification(
    type: 'success' | 'info' | 'warning' | 'danger',
    title: string,
    message: string
  ): void {
    const id = ++this.notificationSeed;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.notifications = [{ id, type, title, message, time }, ...this.notifications].slice(0, 6);
    this.cdr.markForCheck();
    setTimeout(() => this.dismissNotification(id), 4200);
  }

  dismissNotification(id: number): void {
    this.notifications = this.notifications.filter(note => note.id !== id);
    this.cdr.markForCheck();
  }
}
