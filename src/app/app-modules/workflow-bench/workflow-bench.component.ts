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
import { ActionComponent } from './component/action/action.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { SubmitToApprovalComponent } from './component/submit-to-approval/submit-to-approval.component';
import { MatDialog } from '@angular/material/dialog';
import { ErroneousRemarksComponent } from './component/erroneous-remarks/erroneous-remarks.component';


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
  selector: 'app-workflow-bench',
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
  templateUrl: './workflow-bench.component.html',
  styleUrl: './workflow-bench.component.scss',
  providers: [
    {
      provide: DateAdapter, useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class WorkflowBenchComponent {
  masterData: any[] = [];


  themeClass = AG_GRID_THEME.AG_THEME_QUARTZ;
  rowData = [
    {
      sno: 1,
      Action: "1.00.000",
      CompanySite: "MTSL-Pune",
      StagingDate: "12-Apr-2024 9:30",
      FileName: 'INV_1001.pdf',
      FileStatus:'Process',
      WorkflowStatus:'Approved',
      RPAStatus:'Pass',
      RPARemarks:'Remarks',
      DocType: "Credit Note",
      PartyName: 'NAKSHA ENTERPRISES PVT. LTD.',
      DocNo: 'Doc-13012',
      DocDate: '1-Apr-2026 9:30',
      Amount: '₹ 100,000'
    },
    {
      sno: 2,
      Action: "1.00.000",
      CompanySite: "MTSL-Chennai",
      StagingDate: "12-Apr-2024 9:30",
      FileName: 'INV_1001.pdf',
       FileStatus:'Process',
      WorkflowStatus:'Return',
      RPAStatus:'Fail',
      RPARemarks:'Remarks',
      DocType: "Debit Note",
      PartyName: 'ACKTRON SECURITY SYSTEM (P) LTD.',
      DocNo: 'Doc-13012',
      DocDate: '1-Apr-2026 9:30',
      Amount: '₹ 100,000'
    },
    {
      sno: 3,
      Action: "1.00.000",
      CompanySite: "MTSL-Gurgaon",
      StagingDate: "12-Apr-2024 9:30",
      FileName: 'INV_1001.pdf',
      FileStatus:'Process',
      WorkflowStatus:'Reject',
      RPAStatus:'Pass',
      RPARemarks:'Remarks',
      DocType: "Credit Note",
      PartyName: 'ZED INTERACTIVE PRIVATE LIMITED',
      DocNo: 'Doc-13012',
      DocDate: '1-Apr-2026 9:30',
      Amount: '₹ 100,000'
    },
    {
      sno: 4,
      Action: "1.00.000",
      CompanySite: "MTSL-Bangalore",
      StagingDate: "12-Apr-2024 9:30",
      FileName: 'INV_1001.pdf',
      FileStatus:'Process',
      WorkflowStatus:'Approved',
      RPAStatus:'Pass',
      RPARemarks:'Remarks',
      DocType: "Invoice",
      PartyName: 'DELL INTERNATIONAL SERVICES INDIA ',
      DocNo: 'Doc-13012',
      DocDate: '1-Apr-2026 9:30',
      Amount: '₹ 100,000'
    },
    {
      sno: 5,
      Action: "1.00.000",
      CompanySite: "MTSL-Chennai",
      StagingDate: "12-Apr-2024 9:30",
      FileName: 'INV_1001.pdf',
       FileStatus:'Process',
      WorkflowStatus:'Approved',
        RPAStatus:'Pass',
      RPARemarks:'Remarks',
      DocType: "Credit Note",
      PartyName: 'ACKTRON SECURITY SYSTEM (P) LTD.',
      DocNo: 'Doc-13012',
      DocDate: '1-Apr-2026 9:30',
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
      headerName: 'File Status',
      field: 'FileStatus',
      width: 100,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
       {
      headerName: 'Workflow Status',
      field: 'WorkflowStatus',
      width: 140,
      suppressMovable: true,
      resizable: false,
      sortable: true,
       headerClass: 'headercenter',
        cellStyle: { 
          textAlign: 'center',
           lineHeight: '26px'
         },
        cellRenderer: (params: any) => {
    const status = params.value;

    let badgeClass = '';

    switch (status) {
      case 'Approved':
        badgeClass = 'badge-success';
        break;
      case 'Return':
        badgeClass = 'badge-warning';
        break;
      case 'Reject':
        badgeClass = 'badge-danger';
        break;
      default:
        badgeClass = 'badge-default';
    }

    return `<span class="badge ${badgeClass}">${status}</span>`;
  }
    },
    {
      headerName: 'RPA Status',
      field: 'RPAStatus',
      width: 90,
      suppressMovable: true,
      resizable: false,
      sortable: true,
       headerClass: 'headercenter',
        cellStyle: { 
          textAlign: 'center',
           lineHeight: '26px'
         },
          cellRenderer: (params: any) => {
    const status = params.value;
  let badgeClass = '';
     let imgSrc = '';

    switch (status) {
    case 'Pass':
      badgeClass = 'badge-success';
      imgSrc = 'assets/img/done_active.svg';
      break;

    case 'Fail':
      badgeClass = 'badge-danger';
      imgSrc = 'assets/img/close.svg';
      break;

    default:
      badgeClass = 'badge-default';
      imgSrc = '';
  }
     return `
    <span class="badge_RPA ${badgeClass}">
      ${imgSrc ? `<img alt="status" src="${imgSrc}" class="rpa-icon">` : ''}
      ${status}
    </span>
  `;
  }
    },
    {
      headerName: 'RPA Remarks',
      field: 'RPARemarks',
      width: 100,
      suppressMovable: true,
      resizable: false,
      sortable: true,
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
      width: 100,
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


  constructor(public dialog: MatDialog) { }



  /**
       * @function to opens Submit To Approval Component.
       * @returns void.
      */

  onSubmittoApproval(): void {
    this.dialog.open(SubmitToApprovalComponent, {
      width: '40%',
      disableClose: true,
      panelClass: 'RpaOcrExtractionComponent'
    });
  }

   /**
       * @function to opens Move to Component.
       * @returns void.
      */

  onMoveto():void{
  this.dialog.open(ErroneousRemarksComponent, {
      width: '40%',
      disableClose: true,
      panelClass: 'RpaOcrExtractionComponent'
    });
  }


}
