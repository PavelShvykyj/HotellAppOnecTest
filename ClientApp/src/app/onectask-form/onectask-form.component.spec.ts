import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnectaskFormComponent } from './onectask-form.component';

describe('OnectaskFormComponent', () => {
  let component: OnectaskFormComponent;
  let fixture: ComponentFixture<OnectaskFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnectaskFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnectaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
