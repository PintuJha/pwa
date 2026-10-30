import { TestBed } from '@angular/core/testing';

import { ViewDocumentPopUpService } from './view-document-pop-up.service';

describe('ViewDocumentPopUpService', () => {
  let service: ViewDocumentPopUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewDocumentPopUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
