import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStaff } from './dashboard-staff';

describe('DashboardStaff', () => {
  let component: DashboardStaff;
  let fixture: ComponentFixture<DashboardStaff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStaff],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardStaff);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
