import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit, OnDestroy {
  // User data
  firstName = '';
  lastName = '';
  userEmail = '';
  userInitials = '';

  // Task statistics (from computed signals)
  get totalTasks() {
    return this.taskService.totalTasks();
  }

  get todoCount() {
    return this.taskService.todoCount();
  }

  get inProgressCount() {
    return this.taskService.inProgressCount();
  }

  get completedCount() {
    return this.taskService.completedCount();
  }

  get recentTasks(): Task[] {
    return this.taskService.recentTasks();
  }

  get upcomingTasks(): Task[] {
    return this.taskService
      .getAllTasks()
      .filter((task) => !!task.dueDate && task.status !== 'done' && task.status !== 'delivered')
      .sort((a, b) => {
        const aTime = new Date((a.dueDate || '') + 'T00:00:00').getTime();
        const bTime = new Date((b.dueDate || '') + 'T00:00:00').getTime();
        return aTime - bTime;
      })
      .slice(0, 6);
  }

  private subscriptions = new Subscription();

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {
    // Watch for auth state changes
    effect(() => {
      this.initializeUserData();
    });
  }

  ngOnInit(): void {
    // Refresh tasks when component is loaded
    this.taskService.refreshTasks();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeUserData(): void {
    try {
      // Use optional chaining to safely access currentUser
      const currentUser = this.authService?.currentUser?.();
      
      if (currentUser && currentUser.email) {
        this.userEmail = currentUser.email;
        
        // Try to get stored profile data (firstName, lastName from signup)
        const profile = this.authService.getUserProfile();
        if (profile && profile.firstName) {
          this.firstName = profile.firstName;
          this.lastName = profile.lastName;
          this.userInitials = this.getUserInitials(`${profile.firstName} ${profile.lastName}`);
        } else if (currentUser.displayName && currentUser.displayName.trim()) {
          // Fallback to Firebase displayName if available
          this.parseFullName(currentUser.displayName);
        } else {
          // Extract name from email as last resort
          const emailPart = currentUser.email.split('@')[0];
          this.createNameFromEmail(emailPart);
        }
      } else {
        // Fallback for demo purposes when not logged in
        this.setDefaultUser();
      }
    } catch (error) {
      // Fallback if there's any error accessing auth service
      console.warn('Error initializing user data:', error);
      this.setDefaultUser();
    }
  }

  private createNameFromEmail(emailUsername: string): void {
    // Extract letters only and capitalize properly
    const cleaned = emailUsername.replace(/[0-9]/g, '').trim();
    
    if (cleaned.length > 0) {
      // Capitalize first letter
      this.firstName = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
      this.lastName = '';
      this.userInitials = this.firstName.charAt(0);
    } else {
      // Fallback if only numbers
      this.setDefaultUser();
    }
  }

  private parseFullName(fullName: string): void {
    const parts = fullName.trim().split(' ');
    this.firstName = parts[0] || '';
    this.lastName = parts.slice(1).join(' ') || '';
    this.userInitials = this.getUserInitials(fullName);
  }

  private setDefaultUser(): void {
    this.firstName = 'Guest';
    this.lastName = 'User';
    this.userEmail = 'guest@example.com';
    this.userInitials = 'GU';
  }

  private getUserInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  /**
   * Get status label for task
   */
  getTaskStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      todo: 'To Do',
      inprogress: 'In Progress',
      done: 'Done',
      delivered: 'Delivered'
    };
    return statusMap[status] || status;
  }

  /**
   * Get CSS class for task status
   */
  getTaskStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      todo: 'task-item-todo',
      inprogress: 'task-item-progress',
      done: 'task-item-done',
      delivered: 'task-item-done'
    };
    return statusMap[status] || 'task-item-todo';
  }

  getPriorityClass(level: string): string {
    const normalized = (level || '').toLowerCase();
    if (normalized === 'high') return 'high';
    if (normalized === 'medium') return 'medium';
    return 'low';
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
}
