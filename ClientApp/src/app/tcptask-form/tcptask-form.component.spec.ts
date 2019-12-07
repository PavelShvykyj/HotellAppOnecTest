import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcptaskFormComponent } from './tcptask-form.component';

describe('TcptaskFormComponent', () => {
  let component: TcptaskFormComponent;
  let fixture: ComponentFixture<TcptaskFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcptaskFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcptaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
