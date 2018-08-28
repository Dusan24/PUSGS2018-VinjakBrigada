import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeServiceComponent } from './change-service.component';

describe('ChangeServiceComponent', () => {
  let component: ChangeServiceComponent;
  let fixture: ComponentFixture<ChangeServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
