import { TestBed } from '@angular/core/testing';

import { SetModuleStatusService } from './get-module-status.service';

describe('SetModuleStatusService', () => {
  let service: SetModuleStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetModuleStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
