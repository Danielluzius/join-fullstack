import { Timestamp } from '@angular/fire/firestore';

/**
 * Represents a task on the board.
 *
 * @property id - (Optional) Unique identifier for the task.
 * @property title - The title of the task.
 * @property description - The detailed description of the task.
 * @property dueDate - The due date as a Firestore Timestamp.
 * @property priority - The priority level: 'urgent', 'medium', or 'low'.
 * @property category - The category this task belongs to.
 * @property status - The current status: 'todo', 'inprogress', 'awaitfeedback', or 'done'.
 * @property assignedTo - Array of contact IDs assigned to this task.
 * @property subtasks - Array of subtasks belonging to this task.
 * @property createdAt - Timestamp when the task was created.
 * @property updatedAt - (Optional) Timestamp of the last update.
 * @property order - (Optional) Order index for sorting.
 */
export interface Task {
  id?: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  priority: 'urgent' | 'medium' | 'low';
  category: string;
  status: 'todo' | 'inprogress' | 'awaitfeedback' | 'done';
  assignedTo: string[];
  subtasks: Subtask[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  order?: number;
}

/**
 * Represents a subtask belonging to a task.
 *
 * @property id - Unique identifier for the subtask.
 * @property title - The title of the subtask.
 * @property completed - Whether the subtask is completed.
 */
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}
