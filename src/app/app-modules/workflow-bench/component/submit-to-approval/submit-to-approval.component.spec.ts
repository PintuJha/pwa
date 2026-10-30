import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitToApprovalComponent } from './submit-to-approval.component';

describe('SubmitToApprovalComponent', () => {
  let component: SubmitToApprovalComponent;
  let fixture: ComponentFixture<SubmitToApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitToApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitToApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
