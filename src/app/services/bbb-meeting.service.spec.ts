import { TestBed } from '@angular/core/testing';

import { BbbMeetingService } from './bbb-meeting.service';

describe('BbbMeetingService', () => {
  let service: BbbMeetingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BbbMeetingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
