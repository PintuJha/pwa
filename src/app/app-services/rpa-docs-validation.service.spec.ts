import { TestBed } from '@angular/core/testing';

import { RpaDocsValidationService } from './rpa-docs-validation.service';

describe('RpaDocsValidationService', () => {
  let service: RpaDocsValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RpaDocsValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
