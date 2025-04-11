import { TestBed } from '@angular/core/testing';

import { ShiftService } from './shifts.service';

describe('ShiftsService', () => {
  let service: ShiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
