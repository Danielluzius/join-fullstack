import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAvatar } from './contact-avatar';

describe('ContactAvatar', () => {
  let component: ContactAvatar;
  let fixture: ComponentFixture<ContactAvatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactAvatar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactAvatar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
