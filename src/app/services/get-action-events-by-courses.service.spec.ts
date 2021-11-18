import { TestBed } from '@angular/core/testing';

import { GetActionEventsByCoursesService } from './get-action-events-by-courses.service';

describe('GetActionEventsByCoursesService', () => {
  let service: GetActionEventsByCoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetActionEventsByCoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
