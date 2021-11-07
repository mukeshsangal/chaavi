import { TestBed } from '@angular/core/testing';

import { GetUserCoursesService } from './get-user-courses.service';

describe('GetUserCoursesService', () => {
  let service: GetUserCoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetUserCoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
