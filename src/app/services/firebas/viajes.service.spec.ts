import { TestBed } from '@angular/core/testing';

import { ViajeService } from './viajes.service';

describe('ViajesService', () => {
  let service: ViajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViajeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
