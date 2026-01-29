import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubtaskManagerComponent } from './subtask-manager';

describe('SubtaskManagerComponent', () => {
  let component: SubtaskManagerComponent;
  let fixture: ComponentFixture<SubtaskManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubtaskManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
