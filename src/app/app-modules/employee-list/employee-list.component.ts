import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { employeeListDTO } from 'src/app/app-models/employee-list-dto';
import { EmployeeListService } from 'src/app/core/services/employee-list.service';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';
import { AG_GRID_THEME } from 'src/app/shared/constants/constans';



@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    MaterialExampleModule,
    CommonModule,
    AgGridAngular,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
  themeClass = AG_GRID_THEME.AG_THEME_QUARTZ;

  rowData: employeeListDTO[] = [];

  colDefs: ColDef[] = [
    {
      headerName: '#',
      width: 70,
      valueGetter: 'node.rowIndex + 1',
      sortable: false,
      headerClass: 'headercenter',
      cellStyle: { textAlign: 'center' },
      filter: false
    },

    {
      headerName: 'Action',
      field: 'action',
      width: 120,
      sortable: false,
      filter: false,
    },
    {
      headerName: 'First Name',
      field: 'firstName',
      width: 180,
      flex: 1,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'Last Name',
      field: 'lastName',
      width: 120,
      flex: 1,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'Email Id',
      field: 'emailId',
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
    }
  }


  constructor(private employeeListService: EmployeeListService, private router: Router) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.employeeListService.getEmployeesList().subscribe({
      next: (response: employeeListDTO[]) => {
        this.rowData = response;
      }
    });
  }


  addEmployee(): void {
    this.router.navigate(['/add-employee-list']);
  }

}
