import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFormInputs } from './contact-form-inputs';

describe('ContactFormInputs', () => {
  let component: ContactFormInputs;
  let fixture: ComponentFixture<ContactFormInputs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFormInputs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactFormInputs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
