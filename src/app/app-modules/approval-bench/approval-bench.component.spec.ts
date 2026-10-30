import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalBenchComponent } from './approval-bench.component';

describe('ApprovalBenchComponent', () => {
  let component: ApprovalBenchComponent;
  let fixture: ComponentFixture<ApprovalBenchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalBenchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalBenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
