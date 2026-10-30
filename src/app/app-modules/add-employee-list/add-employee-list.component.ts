import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';
import { AuthRoutingModule } from "src/app/modules/auth/auth-routing.module";
import { RouterLink } from '@angular/router';
import { employeeListDTO } from 'src/app/app-models/employee-list-dto';
import { EmployeeListService } from 'src/app/core/services/employee-list.service';

@Component({
  selector: 'app-add-employee-list',
  standalone: true,
  imports: [
    MaterialExampleModule,
    CommonModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    AuthRoutingModule
  ],
  templateUrl: './add-employee-list.component.html',
  styleUrl: './add-employee-list.component.scss'
})
export class AddEmployeeListComponent implements OnInit {

  employee: employeeListDTO = new employeeListDTO();

  constructor(private employeeListService: EmployeeListService) { }

  ngOnInit(): void {}

  saveEmployee() {
    this.employeeListService.createEmployee(this.employee).subscribe(data => {
      console.log(data);
    },
      error => console.log(error));
  }


  onSubmit() {
    this.saveEmployee();
  }


}
