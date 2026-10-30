import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  selector: 'app-processed-document-bench',
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
  templateUrl: './processed-document-bench.component.html',
  styleUrl: './processed-document-bench.component.scss',
  providers: [
    {
      provide: DateAdapter, useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class ProcessedDocumentBenchComponent {
  masterData: any[] = [];


  themeClass = AG_GRID_THEME.AG_THEME_QUARTZ;
  rowData = [
    {
      sno: 1,
      CompanySite: "MTSL-Pune",
      StagingDate: "12-Apr-2024 9:12",
      FileName: 'CAMS_Internal Process Audit_PKC-Farmers Branch_NC_25_March_2026.pdf',
      DocType: "Invoice",
      FileStatus: "Posted to ERP",
      WorkflowStatus: "Approved",
      RPAStatus: "Pass",
      RPARemarks: "OCR Pass",
      PartyName: "NAKSHA ENTERPRISES PVT. LTD.",
      DocNo: 'Doc-50125',
      DocDate: '12-Apr-2024 9:12',
      Amount: '₹ 100000',
      EntBy: 'RPA_BOT',
      EntStamp: '01-Apr-2026 9:12',
      UpdBy: '-',
      UpdStamp: '-'
    },
     {
      sno: 2,
      CompanySite: "MTSL-Chennai",
      StagingDate: "01-Apr-26 9:12",
      FileName: '02032026_INV_001.pdf',
      DocType: "Debit Note",
      FileStatus: "Posted to ERP",
      WorkflowStatus: "Return",
      RPAStatus: "Pass",
      RPARemarks: "OCR Pass",
      PartyName: "NAKSHA ENTERPRISES PVT. LTD.",
      DocNo: 'Doc-50125',
      DocDate: '12-Apr-2024 9:12',
      Amount: '₹ 100000',
      EntBy: 'RPA_BOT',
      EntStamp: '01-Apr-2026 9:12',
      UpdBy: '-',
      UpdStamp: '-'
    },
     {
      sno: 3,
      CompanySite: "MTSL-Gurgaon",
      StagingDate: "12-Apr-2024 9:12",
      FileName: 'CAMS_Internal Process Audit_PKC-Farmers Branch_NC_25_March_2026.pdf',
      DocType: "Credit Note",
      FileStatus: "Posted to ERP",
      WorkflowStatus: "Reject",
      RPAStatus: "Fail",
      RPARemarks: "OCR Pass",
      PartyName: "NAKSHA ENTERPRISES PVT. LTD.",
      DocNo: 'Doc-50125',
      DocDate: '12-Apr-2024 9:12',
      Amount: '₹ 100000',
      EntBy: 'RPA_BOT',
      EntStamp: '01-Apr-2026 9:12',
      UpdBy: '-',
      UpdStamp: '-'
    },
     {
      sno: 4,
      CompanySite: "MTSL-Bangalore",
      StagingDate: "12-Apr-2024 9:12",
      FileName: 'CAMS_Internal Process Audit_PKC-Farmers Branch_NC_25_March_2026.pdf',
      DocType: "Credit Note",
      FileStatus: "Posted to ERP",
      WorkflowStatus: "Approved",
      RPAStatus: "Pass",
      RPARemarks: "OCR Pass",
      PartyName: "NAKSHA ENTERPRISES PVT. LTD.",
      DocNo: 'Doc-50125',
      DocDate: '12-Apr-2024 9:12',
      Amount: '₹ 100000',
      EntBy: 'RPA_BOT',
      EntStamp: '01-Apr-2026 9:12',
      UpdBy: '-',
      UpdStamp: '-'
    },
     {
      sno: 5,
      CompanySite: "MTSL-Pune",
      StagingDate: "12-Apr-2024 9:12",
      FileName: 'CAMS_Internal Process Audit_PKC-Farmers Branch_NC_25_March_2026.pdf',
      DocType: "Credit Note",
      FileStatus: "Posted to ERP",
      WorkflowStatus: "Approved",
      RPAStatus: "Fail",
      RPARemarks: "OCR Pass",
      PartyName: "NAKSHA ENTERPRISES PVT. LTD.",
      DocNo: 'Doc-50125 9:12',
      DocDate: '12-Apr-2024',
      Amount: '₹ 100000',
      EntBy: 'RPA_BOT',
      EntStamp: '01-Apr-2026 9:12',
      UpdBy: '-',
      UpdStamp: '-'
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
      width: 250,
      // flex:1,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'Doc Type',
      field: 'DocType',
      width: 140,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'File Status',
      field: 'FileStatus',
      width: 130,
      suppressMovable: true,
      resizable: false,
      sortable: true,
      //  headerClass: 'headercenter',
      // cellStyle: { textAlign: 'center' },
      //  cellRenderer: (params: any) => {
    // const value = params.value;

    // let colorClass = '';

    // if (value === 'Approved') {
    //   colorClass = 'badge-success';
    // } else if (value === 'Reject') {
    //   colorClass = 'badge-danger';
    // } else {
    //   colorClass = 'badge-warning';
    // }

    // return `<span class="badge ${colorClass}">${value}</span>`;
  // }
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
      width: 140,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'Party Name',
      field: 'PartyName',
      width: 250,
      // flex:1,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'Doc No',
      field: 'DocNo',
      width: 120,
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
    {
      headerName: 'Ent By',
      field: 'EntBy',
      width: 120,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'Ent Stamp',
      field: 'EntStamp',
      width: 120,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'Upd By',
      field: 'UpdBy',
      width: 120,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'Upd Stamp',
      field: 'UpdStamp',
      width: 120,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
  ]

  gridOptions: GridOptions = {
    pagination: true,
  paginationPageSize: 20, // default 20 rows per page
    defaultColDef: {
      suppressHeaderMenuButton: true,
      sortable: false
    }
  }
}
