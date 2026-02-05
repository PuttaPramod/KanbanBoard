import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
  }

  cancelTodoInput() {
    this.showTodoInput = false;
    this.todoTaskTitle = '';
    this.todoTaskDueDate = '';
  }

  addTodoTask() {
    if (!this.todoTaskTitle.trim()) return;

    this.todo.push({
      id: Date.now(),
      title: this.todoTaskTitle,
      description: '',
      status: 'todo',
      dueDate: this.todoTaskDueDate || undefined
    });

    this.cancelTodoInput();
    this.saveToStorage();
  }

  /* ---------- EDIT TASK ---------- */
  startEdit(task: Task) {
    this.editingTaskId = task.id;
    this.editTitle = task.title;
    this.editDueDate = task.dueDate || '';
  }

  cancelEdit() {
    this.editingTaskId = null;
    this.editTitle = '';
    this.editDueDate = '';
  }

  saveEdit(task: Task) {
    task.title = this.editTitle;
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
    this.lastDeletedTask = task;
    this.lastDeletedStatus = status;
    this.showUndo = true;

    this.getListByStatus(status)
      .splice(this.getListByStatus(status).findIndex(t => t.id === task.id), 1);

    this.saveToStorage();

    setTimeout(() => (this.showUndo = false), 5000);
  }

  undoDelete() {
    if (!this.lastDeletedTask || !this.lastDeletedStatus) return;

    this.getListByStatus(this.lastDeletedStatus)
      .push(this.lastDeletedTask);

    this.lastDeletedTask = null;
    this.lastDeletedStatus = null;
    this.showUndo = false;

    this.saveToStorage();
  }

  /* ---------- DRAG & DROP ---------- */
  drop(event: CdkDragDrop<Task[]>, newStatus: Task['status']) {

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const task = event.container.data[event.currentIndex];
      task.status = newStatus;

      if (newStatus === 'done') {
        task.completedDate = new Date().toISOString();
      }

      if (newStatus === 'delivered') {
        task.deliveredDate = new Date().toISOString();
      }
    }

    this.saveToStorage();
  }

  /* ---------- HELPERS ---------- */
  private getListByStatus(status: Task['status']): Task[] {
    switch (status) {
      case 'todo': return this.todo;
      case 'inprogress': return this.inprogress;
      case 'done': return this.done;
      case 'delivered': return this.delivered;
    }
  }

  /* ---------- LOCAL STORAGE ---------- */
  saveToStorage() {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem(
      'kanban_tasks',
      JSON.stringify({
        todo: this.todo,
        inprogress: this.inprogress,
        done: this.done,
        delivered: this.delivered
      })
    );
  }

  loadFromStorage() {
    if (!isPlatformBrowser(this.platformId)) return;

    const data = localStorage.getItem('kanban_tasks');

    if (data) {
      const parsed = JSON.parse(data);
      this.todo = parsed.todo || [];
      this.inprogress = parsed.inprogress || [];
      this.done = parsed.done || [];
      this.delivered = parsed.delivered || [];
    }
  }

  
  
}
