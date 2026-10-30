import { TestBed } from '@angular/core/testing';

import { DocumentRepostoryService } from './document-repostory.service';

describe('DocumentRepostoryService', () => {
  let service: DocumentRepostoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentRepostoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
