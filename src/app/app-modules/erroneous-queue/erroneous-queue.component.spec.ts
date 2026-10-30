import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErroneousQueueComponent } from './erroneous-queue.component';

describe('ErroneousQueueComponent', () => {
  let component: ErroneousQueueComponent;
  let fixture: ComponentFixture<ErroneousQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErroneousQueueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErroneousQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
