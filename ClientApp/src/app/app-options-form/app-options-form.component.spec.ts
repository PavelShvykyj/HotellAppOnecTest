import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppOptionsFormComponent } from './app-options-form.component';

describe('OneCOptionsFormComponent', () => {
  let component: AppOptionsFormComponent;
  let fixture: ComponentFixture<AppOptionsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppOptionsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppOptionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
