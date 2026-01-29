import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFormModal } from './contact-form-modal';

describe('ContactFormModal', () => {
  let component: ContactFormModal;
  let fixture: ComponentFixture<ContactFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFormModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
