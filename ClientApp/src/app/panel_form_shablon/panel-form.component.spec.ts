import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneCOptionsFormComponent } from './one-coptions-form.component';

describe('OneCOptionsFormComponent', () => {
  let component: OneCOptionsFormComponent;
  let fixture: ComponentFixture<OneCOptionsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneCOptionsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneCOptionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
