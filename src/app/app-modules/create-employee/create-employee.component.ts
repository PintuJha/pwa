import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';
import { AG_GRID_THEME } from 'src/app/shared/constants/constans';

@Component({
  selector: 'app-create-employee',
  standalone: true,
imports: [
    MaterialExampleModule,
    CommonModule,
    FormsModule,
    AgGridAngular,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.scss'
})
export class CreateEmployeeComponent {


  // id:number;
  // firsrname:string;
  // lastname:string;
  // emailid:string;


    themeClass = AG_GRID_THEME.AG_THEME_QUARTZ;
    rowData = [
      {
        sno: 1,
        FirstName: "Pintu",
        LastName: "Jha",
        EmailId: "Info@gmail.com",
      }
    ];
    // Column Definitions: Defines & controls grid columns.
    colDefs: ColDef[] = [
      {
        headerName: '#',
        width: 50,
        field: 'sno',
        headerClass: 'headercenter',
        cellStyle: { textAlign: 'center' },
        suppressMovable: true,
        resizable: false,
        sortable: false,
      },
      {
        headerName: 'First Name',
        field: 'FirstName',
        width: 180,
        flex: 1,
        suppressMovable: true,
        resizable: false,
        sortable: true,
      },
      {
        headerName: 'Last Name',
        field: 'LastName',
        width: 120,
        flex: 1,
        suppressMovable: true,
        resizable: false,
        sortable: true,
      },
      {
        headerName: 'Email Id',
        field: 'EmailId',
        width: 260,
        flex: 1,
        suppressMovable: true,
        resizable: false,
        sortable: true,
      },
    ]
  
    gridOptions: GridOptions = {
      defaultColDef: {
        suppressHeaderMenuButton: true,
        sortable: false
      },
      rowSelection: 'multiple',
      suppressRowClickSelection: true,
    }
}
