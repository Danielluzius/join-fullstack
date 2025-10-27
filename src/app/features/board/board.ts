import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardColumns } from './board-columns/board-columns';
import { BoardTasksService } from '../../core/services/board-tasks-service';
import { Task } from '../../core/interfaces/board-tasks-interface';

@Component({
  selector: 'app-board',
  imports: [CommonModule, BoardColumns],
  templateUrl: './board.html',
  styleUrl: './board.scss',
  standalone: true,
})
export class Board implements OnInit {
  private taskService = inject(BoardTasksService);

  isLoading = true;

  // Columns-Struktur für BoardColumns Component
  columns = [
    {
      id: 'todo',
      title: 'To do',
      tasks: [] as Task[],
    },
    {
      id: 'inprogress',
      title: 'In progress',
      tasks: [] as Task[],
    },
    {
      id: 'awaitfeedback',
      title: 'Await feedback',
      tasks: [] as Task[],
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [] as Task[],
    },
  ];

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.taskService.getTasksByStatus().subscribe({
      next: (tasks) => {
        // Tasks in columns-Struktur einfügen
        this.columns[0].tasks = tasks.todo;
        this.columns[1].tasks = tasks.inprogress;
        this.columns[2].tasks = tasks.awaitfeedback;
        this.columns[3].tasks = tasks.done;
        this.isLoading = false;
        console.log('Tasks loaded:', tasks);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading = false;
      },
    });
  }
}
