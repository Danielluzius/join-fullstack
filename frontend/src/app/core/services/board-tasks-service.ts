import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Timestamp } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, Subtask } from '../interfaces/board-tasks-interface';
import { environment } from '../../../environments/environment';

/**
 * Backend API response interface for tasks
 */
interface TaskApiResponse {
  id: string;
  title: string;
  description: string;
  due_date: string; // ISO string from backend
  priority: 'urgent' | 'medium' | 'low';
  category: string;
  status: 'todo' | 'inprogress' | 'awaitfeedback' | 'done';
  assigned_to: string[];
  subtasks: SubtaskApiResponse[];
  order?: number;
  created_at: string;
  updated_at: string;
}

interface SubtaskApiResponse {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

@Injectable({
  providedIn: 'root',
})
export class BoardTasksService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tasks/`;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor() {
    this.loadTasks();
  }

  /**
   * Loads all tasks from the backend API.
   */
  private async loadTasks(): Promise<void> {
    try {
      const tasks = await this.fetchTasksFromApi();
      this.tasksSubject.next(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.tasksSubject.next([]);
    }
  }

  /**
   * Fetches tasks from API and converts to frontend format.
   */
  private async fetchTasksFromApi(): Promise<Task[]> {
    const response = await this.http.get<TaskApiResponse[]>(this.apiUrl).toPromise();
    return (response || []).map(task => this.convertApiTaskToFrontend(task));
  }

  /**
   * Converts backend task format to frontend Task interface.
   */
  private convertApiTaskToFrontend(apiTask: TaskApiResponse): Task {
    return {
      id: apiTask.id,
      title: apiTask.title,
      description: apiTask.description,
      dueDate: Timestamp.fromDate(new Date(apiTask.due_date)),
      priority: apiTask.priority,
      category: apiTask.category,
      status: apiTask.status,
      assignedTo: apiTask.assigned_to,
      subtasks: apiTask.subtasks.map(st => ({
        id: st.id,
        title: st.title,
        completed: st.completed
      })),
      order: apiTask.order,
      createdAt: Timestamp.fromDate(new Date(apiTask.created_at)),
      updatedAt: apiTask.updated_at ? Timestamp.fromDate(new Date(apiTask.updated_at)) : undefined
    };
  }

  /**
   * Converts frontend Task to backend format.
   */
  private convertFrontendTaskToApi(task: Partial<Task>): any {
    const apiTask: any = { ...task };
    
    // Convert Timestamp to ISO string
    if (task.dueDate) {
      apiTask.due_date = task.dueDate.toDate().toISOString();
      delete apiTask.dueDate;
    }
    
    // Rename fields for backend
    if (task.assignedTo !== undefined) {
      apiTask.assigned_to = task.assignedTo;
      delete apiTask.assignedTo;
    }
    
    // Convert subtasks and add order field
    if (task.subtasks !== undefined) {
      apiTask.subtasks = task.subtasks.map((subtask, index) => ({
        title: subtask.title,
        completed: subtask.completed,
        order: index
        // Don't send 'id' for new subtasks - backend will generate them
      }));
    }
    
    // Remove frontend-only fields
    delete apiTask.createdAt;
    delete apiTask.updatedAt;
    
    return apiTask;
  }

  /**
   * Returns all tasks as an observable.
   */
  getAllTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  /**
   * Returns all tasks grouped by their status as an observable.
   */
  getTasksByStatus(): Observable<{
    todo: Task[];
    inprogress: Task[];
    awaitfeedback: Task[];
    done: Task[];
  }> {
    return this.tasks$.pipe(
      map((tasks) => ({
        todo: tasks.filter((t) => t.status === 'todo'),
        inprogress: tasks.filter((t) => t.status === 'inprogress'),
        awaitfeedback: tasks.filter((t) => t.status === 'awaitfeedback'),
        done: tasks.filter((t) => t.status === 'done'),
      }))
    );
  }

  /**
   * Creates a new task via the backend API.
   */
  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<string> {
    try {
      const apiTask = this.convertFrontendTaskToApi(task);
      const response = await this.http.post<TaskApiResponse>(this.apiUrl, apiTask).toPromise();
      
      if (response) {
        await this.loadTasks(); // Refresh tasks
        return response.id;
      }
      throw new Error('Failed to create task');
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Updates an existing task via the backend API.
   */
  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const apiUpdates = this.convertFrontendTaskToApi(updates);
      await this.http.put(`${this.apiUrl}${taskId}/`, apiUpdates).toPromise();
      await this.loadTasks(); // Refresh tasks
    } catch (error) {
      console.error('Backend update failed:', error);
      throw error;
    }
  }

  /**
   * Updates the status of a task via the backend API.
   */
  async updateTaskStatus(
    taskId: string,
    newStatus: 'todo' | 'inprogress' | 'awaitfeedback' | 'done'
  ): Promise<void> {
    try {
      await this.http.patch(`${this.apiUrl}${taskId}/update_status/`, { status: newStatus }).toPromise();
      await this.loadTasks(); // Refresh tasks
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }

  /**
   * Deletes a task via the backend API.
   */
  async deleteTask(taskId: string): Promise<void> {
    try {
      await this.http.delete(`${this.apiUrl}${taskId}/`).toPromise();
      await this.loadTasks(); // Refresh tasks
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  /**
   * Moves a task to a new status (used for drag & drop).
   */
  async moveTask(
    taskId: string,
    newStatus: 'todo' | 'inprogress' | 'awaitfeedback' | 'done'
  ): Promise<void> {
    await this.updateTaskStatus(taskId, newStatus);
  }

  /**
   * Manually refresh tasks from backend.
   */
  async refreshTasks(): Promise<void> {
    await this.loadTasks();
  }
}