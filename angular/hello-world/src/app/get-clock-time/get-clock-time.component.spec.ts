import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetClockTimeComponent } from './get-clock-time.component';

describe('GetClockTimeComponent', () => {
  let component: GetClockTimeComponent;
  let fixture: ComponentFixture<GetClockTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetClockTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetClockTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
