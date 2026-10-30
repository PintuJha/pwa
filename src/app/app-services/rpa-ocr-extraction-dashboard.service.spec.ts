import { TestBed } from '@angular/core/testing';

import { RpaOcrExtractionDashboardService } from './rpa-ocr-extraction-dashboard.service';

describe('RpaOcrExtractionDashboardService', () => {
  let service: RpaOcrExtractionDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RpaOcrExtractionDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
