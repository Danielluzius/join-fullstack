import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriorityIcon } from './priority-icon';

describe('PriorityIcon', () => {
  let component: PriorityIcon;
  let fixture: ComponentFixture<PriorityIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityIcon],
    }).compileComponents();

    fixture = TestBed.createComponent(PriorityIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
