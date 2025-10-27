import { Timestamp } from '@angular/fire/firestore';

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
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}