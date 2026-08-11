import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Doors } from './doors';

describe('Doors', () => {
  let component: Doors;
  let fixture: ComponentFixture<Doors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Doors],
    }).compileComponents();

    fixture = TestBed.createComponent(Doors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
