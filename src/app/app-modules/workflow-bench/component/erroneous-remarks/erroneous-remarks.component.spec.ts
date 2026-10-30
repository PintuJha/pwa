import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErroneousRemarksComponent } from './erroneous-remarks.component';

describe('ErroneousRemarksComponent', () => {
  let component: ErroneousRemarksComponent;
  let fixture: ComponentFixture<ErroneousRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErroneousRemarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErroneousRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
