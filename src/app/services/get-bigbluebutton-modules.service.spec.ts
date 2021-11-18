import { TestBed } from '@angular/core/testing';

import { GetBigbluebuttonModulesService } from './get-bigbluebutton-modules.service';

describe('GetBigbluebuttonModulesService', () => {
  let service: GetBigbluebuttonModulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetBigbluebuttonModulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
