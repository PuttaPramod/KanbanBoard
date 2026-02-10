import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, TrackByFunction } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDropList} from '@angular/cdk/drag-drop';
import { PLATFORM_ID } from '@angular/core';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './taskpage.html',
  styleUrls: ['./taskpage.css']
})
export class TaskPage implements OnInit {
  /* ---------- UI STATE ---------- */
  showTodoInput = false;
  todoTaskTitle = '';
  todoTaskDueDate = '';
  editingTaskId: number | null = null;
  editTitle = '';
  editDueDate = '';
  showUndo = false;
  lastDeletedTask: Task | null = null;
  lastDeletedStatus: Task['status'] | null = null;

  /* ---------- TASK LISTS ---------- */
  todo: Task[] = [];
  inprogress: Task[] = [];
  done: Task[] = [];
  delivered: Task[] = [];

  /* ---------- CDK REFERENCES ---------- */
  @ViewChild('todoList', { static: false }) todoList!: CdkDropList<Task[]>;
  @ViewChild('inprogressList', { static: false }) inprogressList!: CdkDropList<Task[]>;
  @ViewChild('doneList', { static: false }) doneList!: CdkDropList<Task[]>;
  @ViewChild('deliveredList', { static: false }) deliveredList!: CdkDropList<Task[]>;
  trackByFn!: TrackByFunction<Task>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  /* ---------- LIFECYCLE ---------- */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  /* ---------- UTIL ---------- */
  isExpired(dueDate?: string): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }

  /* ---------- ADD TASK ---------- */
  openTodoInput() {
    this.showTodoInput = true;
    this.cdr.detectChanges(); // Ensure UI updates
  }

  cancelTodoInput() {
    this.showTodoInput = false;
    this.todoTaskTitle = '';
    this.todoTaskDueDate = '';
  }

  addTodoTask() {
    if (!this.todoTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: this.todoTaskTitle.trim(),
      description: '',
      status: 'todo',
      dueDate: this.todoTaskDueDate || undefined
    };

    this.todo.push(newTask);
    this.cancelTodoInput();
    this.saveToStorage();
  }

  /* ---------- EDIT TASK ---------- */
  startEdit(task: Task) {
    this.editingTaskId = task.id;
    this.editTitle = task.title;
    this.editDueDate = task.dueDate || '';
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.editingTaskId = null;
    this.editTitle = '';
    this.editDueDate = '';
  }

  saveEdit(task: Task) {
    if (!this.editTitle.trim()) return;

    task.title = this.editTitle.trim();
    task.dueDate = this.editDueDate || undefined;
    this.cancelEdit();
    this.saveToStorage();
  }

  /* ---------- DELETE + UNDO ---------- */
  confirmRemoveTask(task: Task, status: Task['status']) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.removeTask(task, status);
    }
  }

  removeTask(task: Task, status: Task['status']) {
    this.lastDeletedTask = { ...task }; // Clone to avoid reference issues
    this.lastDeletedStatus = status;
    this.showUndo = true;

    const list = this.getListByStatus(status);
    const index = list.findIndex(t => t.id === task.id);
    if (index > -1) {
      list.splice(index, 1);
    }

    this.saveToStorage();
    this.cdr.detectChanges();

    setTimeout(() => {
      this.showUndo = false;
      this.cdr.detectChanges();
    }, 5000);
  }

  undoDelete() {
    if (!this.lastDeletedTask || !this.lastDeletedStatus) return;

    const list = this.getListByStatus(this.lastDeletedStatus);
    list.push(this.lastDeletedTask);

    this.lastDeletedTask = null;
    this.lastDeletedStatus = null;
    this.showUndo = false;
    this.saveToStorage();
    this.cdr.detectChanges();
  }

  /* ---------- FIXED DRAG & DROP ---------- */
  drop(event: CdkDragDrop<Task[]>, newStatus: Task['status']): void {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data!, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data!,
      event.container.data!,
      event.previousIndex,
      event.currentIndex
    );
    
    // Update task status and timestamps
    const task = event.container.data![event.currentIndex];
    if (task) {
      task.status = newStatus;
      if (newStatus === 'done') {
        task.completedDate = new Date().toISOString().split('T')[0];
      } else if (newStatus === 'delivered') {
        task.deliveredDate = new Date().toISOString().split('T')[0];
      }
    }
  }
  this.saveToStorage();
}


  /* ---------- HELPER METHODS ---------- */
  private getListByStatus(status: Task['status']): Task[] {
    switch (status) {
      case 'todo':
        return this.todo;
      case 'inprogress':
        return this.inprogress;
      case 'done':
        return this.done;
      case 'delivered':
        return this.delivered;
      default:
        return this.todo;
    }
  }

  /* ---------- LOCAL STORAGE (SSR SAFE) ---------- */
  private saveToStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const data = {
        todo: this.todo,
        inprogress: this.inprogress,
        done: this.done,
        delivered: this.delivered
      };
      localStorage.setItem('kanban_tasks', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const data = localStorage.getItem('kanban_tasks');
      if (data) {
        const parsed = JSON.parse(data);
        this.todo = parsed.todo || [];
        this.inprogress = parsed.inprogress || [];
        this.done = parsed.done || [];
        this.delivered = parsed.delivered || [];
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      // Reset to empty arrays on error
      this.todo = [];
      this.inprogress = [];
      this.done = [];
      this.delivered = [];
    }
  }
}
