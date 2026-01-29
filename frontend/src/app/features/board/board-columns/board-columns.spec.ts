import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardColumns } from './board-columns';

describe('BoardColumns', () => {
  let component: BoardColumns;
  let fixture: ComponentFixture<BoardColumns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardColumns],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardColumns);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
