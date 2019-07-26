import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreloadpageComponent } from './preloadpage.component';

describe('PreloadpageComponent', () => {
  let component: PreloadpageComponent;
  let fixture: ComponentFixture<PreloadpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreloadpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreloadpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
