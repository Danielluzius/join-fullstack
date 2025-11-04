import { Component } from '@angular/core';

@Component({
  selector: 'app-summary',
  imports: [],
  templateUrl: './summary.html',
  styleUrl: './summary.scss'
})
export class Summary {
  todoIconSrc: string = 'assets/summary/edit-white-signup.png';
  doneIconSrc: string = 'assets/summary/done-checkmark.png';

  onTodoHover(isHovering: boolean): void {
    if (isHovering) {
      this.todoIconSrc = 'assets/summary/edit-black-signup.png';
    } else {
      this.todoIconSrc = 'assets/summary/edit-white-signup.png';
    }
  }

  onDoneHover(isHovering: boolean): void {
    if (isHovering) {
      this.doneIconSrc = 'assets/summary/done-checkmark-hover.png';
    } else {
      this.doneIconSrc = 'assets/summary/done-checkmark.png';
    }
  }
}
