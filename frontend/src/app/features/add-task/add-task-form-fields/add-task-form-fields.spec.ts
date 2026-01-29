import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskFormFields } from './add-task-form-fields';

describe('AddTaskFormFields', () => {
  let component: AddTaskFormFields;
  let fixture: ComponentFixture<AddTaskFormFields>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskFormFields]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskFormFields);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
