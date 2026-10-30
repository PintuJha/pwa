import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmployeeListComponent } from './update-employee-list.component';

describe('UpdateEmployeeListComponent', () => {
  let component: UpdateEmployeeListComponent;
  let fixture: ComponentFixture<UpdateEmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEmployeeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
