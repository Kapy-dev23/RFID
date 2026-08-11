import { TestBed } from '@angular/core/testing';

import { Rfid } from './rfid.service';

describe('Rfid', () => {
  let service: Rfid;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Rfid);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
