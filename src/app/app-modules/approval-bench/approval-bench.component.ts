import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';
import { AG_GRID_THEME } from 'src/app/shared/constants/constans';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ActionComponent } from './component/action/action.component';

export const MY_DATE_FORMATS = {
  parse: { dateInput: 'DD-MMM-YYYY' },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD-MMM-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-approval-bench',
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
  templateUrl: './approval-bench.component.html',
  styleUrl: './approval-bench.component.scss',
    providers: [
      {
        provide: DateAdapter, useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
      },
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    ],
})
export class ApprovalBenchComponent {


   masterData: any[] = [];
  
  
    themeClass = AG_GRID_THEME.AG_THEME_QUARTZ;
    rowData = [
      {
        sno: 1,
        Action: "1.00.000",
        CompanySite: "MTSL-Pune",
        StagingDate: "12-Apr-2024 10:40",
        FileName: 'INV_1001.pdf',
        DocType: "Credit Note",
        PartyName: 'NAKSHA ENTERPRISES PVT. LTD.',
        DocNo: 'Doc-13012',
        DocDate: '1-Apr-2026 10:40',
        Amount: '₹ 100,000'
      },
      {
        sno: 2,
        Action: "1.00.000",
        CompanySite: "MTSL-Chennai",
        StagingDate: "12-Apr-2024 10:40",
        FileName: 'INV_1001.pdf',
        DocType: "Debit Note",
        PartyName: 'ACKTRON SECURITY SYSTEM (P) LTD.',
        DocNo: 'Doc-13012',
        DocDate: '1-Apr-2026 10:40',
        Amount: '₹ 100,000'
      },
      {
        sno: 3,
        Action: "1.00.000",
        CompanySite: "MTSL-Gurgaon",
        StagingDate: "12-Apr-2024 10:40",
        FileName: 'INV_1001.pdf',
        DocType: "Credit Note",
        PartyName: 'ZED INTERACTIVE PRIVATE LIMITED',
        DocNo: 'Doc-13012',
        DocDate: '1-Apr-2026 10:40',
        Amount: '₹ 100,000'
      },
      {
        sno: 4,
        Action: "1.00.000",
        CompanySite: "MTSL-Bangalore",
        StagingDate: "12-Apr-2024 10:40",
        FileName: 'INV_1001.pdf',
        DocType: "Invoice",
        PartyName: 'DELL INTERNATIONAL SERVICES INDIA ',
        DocNo: 'Doc-13012',
        DocDate: '1-Apr-2026 10:40',
        Amount: '₹ 100,000'
      },
      {
        sno: 5,
        Action: "1.00.000",
        CompanySite: "MTSL-Chennai",
        StagingDate: "12-Apr-2024 10:40",
        FileName: 'INV_1001.pdf',
        DocType: "Credit Note",
        PartyName: 'ACKTRON SECURITY SYSTEM (P) LTD.',
        DocNo: 'Doc-13012',
        DocDate: '1-Apr-2026 10:40',
        Amount: '₹ 100,000'
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
        headerName: '',
        width: 35,
        field: 'checkBox',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        suppressMovable: true,
        resizable: false,
        headerClass: 'headercenter',
        cellStyle: { textAlign: 'center' }
      },
      {
        headerName: 'Action',
        width: 60,
        field: 'Action',
        headerClass: 'headercenter',
        cellStyle: { textAlign: 'center' },
        suppressMovable: true,
        resizable: false,
        sortable: false,
        cellRenderer: ActionComponent,
      },
      {
        headerName: 'Company Site',
        field: 'CompanySite',
        width: 180,
        suppressMovable: true,
        resizable: false,
        sortable: true,
      },
      {
        headerName: 'Staging Date',
        field: 'StagingDate',
        width: 120,
        suppressMovable: true,
        resizable: false,
        sortable: true,
      },
      {
        headerName: 'File Name',
        field: 'FileName',
        width: 260,
        // flex: 1,
        suppressMovable: true,
        resizable: false,
        sortable: true,
      },
      {
        headerName: 'Doc Type',
        field: 'DocType',
        width: 100,
        suppressMovable: true,
        resizable: false,
        sortable: true,
        //    headerClass: 'headercenter',
        // cellStyle: { textAlign: 'center' },
      },
      {
        headerName: 'Party Name',
        field: 'PartyName',
        width: 275,
        // flex: 1,
        suppressMovable: true,
        resizable: false,
        sortable: true,
      },
      {
        headerName: 'Doc No',
        field: 'DocNo',
        width: 90,
        suppressMovable: true,
        resizable: false,
        sortable: true,
      },
      {
        headerName: 'Doc Date',
        field: 'DocDate',
        width: 120,
        suppressMovable: true,
        resizable: false,
        sortable: true,
      },
      {
        headerName: 'Amount',
        field: 'Amount',
        width: 160,
        suppressMovable: true,
        resizable: false,
        sortable: true,
        headerClass: 'headercenter',
        cellStyle: { textAlign: 'right' },
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
