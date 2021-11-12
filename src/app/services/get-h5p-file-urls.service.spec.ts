import { TestBed } from '@angular/core/testing';

import { GetH5pFileUrlsService } from './get-h5p-file-urls.service';

describe('GetH5pFileUrlsService', () => {
  let service: GetH5pFileUrlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetH5pFileUrlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
