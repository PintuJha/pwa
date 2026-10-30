import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';


import * as XLSX from 'xlsx-js-style';


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
  selector: 'app-erroneous-queue',
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
  templateUrl: './erroneous-queue.component.html',
  styleUrl: './erroneous-queue.component.scss',
  providers: [
    {
      provide: DateAdapter, useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class ErroneousQueueComponent {
  masterData: any[] = []; // original API data
  rowData: any[] = [];    // grid data
  http = inject(HttpClient);

  themeClass = AG_GRID_THEME.AG_THEME_QUARTZ;

  companyList: any[] = [];
  gridApi: any;

  constructor(private fb: FormBuilder) { }

  form = this.fb.group({
    companyId: [''],
    searchText: ['']
  });



  colDefs: ColDef[] = [
    {
      headerName: '#',
      width: 50,
      field: 'id',
      headerClass: 'headercenter',
      cellStyle: { textAlign: 'center' },
      suppressMovable: true,
      resizable: false,
      sortable: false,
    },
    {
      headerName: 'Department Name',
      field: 'name',
      width: 190,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'Company Name',
      field: 'company.name',
      width: 180,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'User Name',
      field: 'username',
      width: 190,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'Email',
      field: 'email',
      width: 200,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'Phone',
      field: 'phone',
      width: 200,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'Website',
      field: 'website',
      width: 200,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
    {
      headerName: 'Email',
      field: 'email',
      width: 220,
      suppressMovable: true,
      resizable: false,
      sortable: true,
    },
  ]

  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 100,
    defaultColDef: {
      suppressHeaderMenuButton: true,
      sortable: false
    }
  }
  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.http.get('https://jsonplaceholder.typicode.com/users').subscribe((res: any) => {
      this.masterData = res;      // store original data
      this.rowData = [...res];    // copy for grid
      this.buildCompanyList(res);  // extract unique companies
    })
  }


  buildCompanyList(users: any[]) {
    const uniqueCompanies = new Map();
    users.forEach(user => {
      const companyName = user.company?.name;
      if (companyName && !uniqueCompanies.has(companyName)) {
        // use company name as unique key (or create a synthetic id)
        uniqueCompanies.set(companyName, { id: companyName, name: companyName });
      }
    });
    this.companyList = Array.from(uniqueCompanies.values());
  }




  onSearch() {
    const { companyId, searchText } = this.form.value;

    let filteredData = [...this.masterData];

    // Filter by company name
    if (companyId) {
      filteredData = filteredData.filter(item => item.company?.name === companyId);
    }

    // Filter by search text (name, username, email, company name)
    if (searchText) {
      const search = searchText.toLowerCase();
      filteredData = filteredData.filter(item =>
        item.name?.toLowerCase().includes(search) ||
        item.username?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.company?.name?.toLowerCase().includes(search)
      );
    }

    this.rowData = filteredData;
  }

  onReset() {
    this.form.reset();
    this.rowData = [...this.masterData];
  }







  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  onExcelDownload() {
    const rows: any[] = [];

    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilterAndSort((node: any) => rows.push(node.data));
    } else {
      rows.push(...this.rowData);
    }

    if (rows.length === 0) {
      alert('No data to export.');
      return;
    }

    const exportCols = this.colDefs.filter(c => !!c.field && c.headerName !== '#');

    const seenHeaders = new Set<string>();
    const headerMap = exportCols.map(col => {
      let header = col.headerName || col.field!;
      if (seenHeaders.has(header)) header = `${header} (${col.field})`;
      seenHeaders.add(header);
      return { header, field: col.field! };
    });

    const exportData = rows.map(row => {
      const out: Record<string, any> = {};
      headerMap.forEach(({ header, field }) => {
        out[header] = this.getNestedValue(row, field);
      });
      return out;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    this.applyExcelStyles(worksheet, headerMap.length, exportData.length);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Erroneous Queue');
    XLSX.writeFile(workbook, `Erroneous_Queue_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  private applyExcelStyles(ws: any, colCount: number, rowCount: number) {
    const border = {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } }
    };

    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 12 },
      fill: { patternType: 'solid', fgColor: { rgb: '000000' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border
    };

    const evenRowStyle = {
      fill: { patternType: 'solid', fgColor: { rgb: 'F2F2F2' } },
      alignment: { vertical: 'center', wrapText: true },
      border
    };

    const oddRowStyle = {
      fill: { patternType: 'solid', fgColor: { rgb: 'FFFFFF' } },
      alignment: { vertical: 'center', wrapText: true },
      border
    };

    // Header row (row 0)
    for (let c = 0; c < colCount; c++) {
      const addr = XLSX.utils.encode_cell({ r: 0, c });
      if (!ws[addr]) ws[addr] = { t: 's', v: '' };
      ws[addr].s = headerStyle;
    }

    // Data rows (zebra striping)
    for (let r = 1; r <= rowCount; r++) {
      const rowStyle = r % 2 === 0 ? evenRowStyle : oddRowStyle;
      for (let c = 0; c < colCount; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (!ws[addr]) ws[addr] = { t: 's', v: '' };
        ws[addr].s = rowStyle;
      }
    }

    // Auto-fit-ish column widths based on content
    ws['!cols'] = Array.from({ length: colCount }, (_, c) => {
      let max = 10;
      for (let r = 0; r <= rowCount; r++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        const val = ws[addr]?.v;
        if (val != null) max = Math.max(max, String(val).length + 2);
      }
      return { wch: Math.min(max, 40) };
    });

    // Freeze header row + slightly taller header
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };
    ws['!rows'] = [{ hpt: 24 }];
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
  }

}
