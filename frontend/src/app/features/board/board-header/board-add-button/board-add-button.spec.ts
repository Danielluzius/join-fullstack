import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardAddButton } from './board-add-button';

describe('BoardAddButton', () => {
  let component: BoardAddButton;
  let fixture: ComponentFixture<BoardAddButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardAddButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardAddButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
