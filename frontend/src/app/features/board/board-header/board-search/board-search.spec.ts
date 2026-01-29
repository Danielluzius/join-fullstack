import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardSearch } from './board-search';

describe('BoardSearch', () => {
  let component: BoardSearch;
  let fixture: ComponentFixture<BoardSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
