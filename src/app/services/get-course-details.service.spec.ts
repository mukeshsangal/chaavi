import { TestBed } from '@angular/core/testing';

import { GetCourseDetailsService } from './get-course-details.service';

describe('GetCourseDetailsService', () => {
  let service: GetCourseDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCourseDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
