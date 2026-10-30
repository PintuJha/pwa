import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessedDocumentBenchComponent } from './processed-document-bench.component';

describe('ProcessedDocumentBenchComponent', () => {
  let component: ProcessedDocumentBenchComponent;
  let fixture: ComponentFixture<ProcessedDocumentBenchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessedDocumentBenchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessedDocumentBenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
