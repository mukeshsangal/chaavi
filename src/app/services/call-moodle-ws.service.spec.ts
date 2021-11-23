import { TestBed } from '@angular/core/testing';

import { CallMoodleWsService } from './call-moodle-ws.service';

describe('CallMoodleWsService', () => {
  let service: CallMoodleWsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallMoodleWsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
