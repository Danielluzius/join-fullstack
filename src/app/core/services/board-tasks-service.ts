
import { Injectable, inject } from '@angular/core';
import {Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, Timestamp} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, Subtask } from '../interfaces/board-tasks-interface';

@Injectable({
  providedIn: 'root',
})
export class BoardTasksService {
  private firestore = inject(Firestore);
  private tasksCollection = collection(this.firestore, 'tasks');

  getAllTasks(): Observable<Task[]> {
    return collectionData(this.tasksCollection, { idField: 'id' }).pipe(
        map((tasks) => tasks as Task[])
    );
  }
  
/*

- createTask(task)



- updateTask(task)



- deleteTask(id)



- moveTask(taskId, newStatus)



*/

}