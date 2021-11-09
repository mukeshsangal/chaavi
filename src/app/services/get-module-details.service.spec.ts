import { TestBed } from '@angular/core/testing';

import { GetModuleDetailsService } from './get-module-details.service';

describe('GetModuleDetailsService', () => {
  let service: GetModuleDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetModuleDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
