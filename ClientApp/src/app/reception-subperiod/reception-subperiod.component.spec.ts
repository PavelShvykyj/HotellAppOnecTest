import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionSubperiodComponent } from './reception-subperiod.component';

describe('ReceptionSubperiodComponent', () => {
  let component: ReceptionSubperiodComponent;
  let fixture: ComponentFixture<ReceptionSubperiodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionSubperiodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionSubperiodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
