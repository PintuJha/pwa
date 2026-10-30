import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowBenchComponent } from './workflow-bench.component';

describe('WorkflowBenchComponent', () => {
  let component: WorkflowBenchComponent;
  let fixture: ComponentFixture<WorkflowBenchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowBenchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowBenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
