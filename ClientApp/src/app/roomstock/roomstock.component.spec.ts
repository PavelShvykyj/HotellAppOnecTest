import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomstockComponent } from './roomstock.component';

describe('RoomstockComponent', () => {
  let component: RoomstockComponent;
  let fixture: ComponentFixture<RoomstockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomstockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
