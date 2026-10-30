import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';
import { SharedModule } from 'src/app/shared/shared.module';




export interface PeriodicElement1 {
  sno: number;
   ItemDescriptiton: string;
  Qty: number;
  Rate: number;
  Amount: string;
  Action: string;
  Status: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {sno: 1, ItemDescriptiton: 'Product A', Qty: 10, Rate:100, Amount:'1000', Action:'', Status:''},
  
];


export interface PeriodicElement {
  FieldName: string;
  InvoiceValue: string;
  Status: string;
  Comments: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    FieldName: 'Invoice Number', 
    InvoiceValue: '312456',  
    Status: 'Matched', 
    Comments: 'RPA testing completed, bot working as expected.',
  },
   {
    FieldName: 'PO Number', 
    InvoiceValue: '12345',
    Status: 'Matched', 
    Comments: 'Not Matched',
  },
   {
    FieldName: 'Currency', 
    InvoiceValue: 'INR', 
    Status: 'Not Matched', 
    Comments: 'Not Matched',
  },
   {
    FieldName: 'Document Date', 
    InvoiceValue: '7-Mar-1997', 
    Status: 'Not Matched', 
    Comments: 'Matched',
  },
];
@Component({
  selector: 'app-view-document',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MaterialExampleModule, ReactiveFormsModule, SharedModule],
  templateUrl: './view-document.component.html',
  styleUrl: './view-document.component.scss'
})
export class ViewDocumentComponent {

 
@ViewChild(MatAccordion) accordion!: MatAccordion;

   private _liveAnnouncer = inject(LiveAnnouncer);
  
    displayedColumns: string[] = ['FieldName', 'InvoiceValue', 'Status', 'Comments'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
  

      displayedColumns1: string[] = ['sno', 'ItemDescriptiton', 'Qty', 'Rate', 'Amount', 'Action', 'Status'];
   dataSource1 = ELEMENT_DATA1;


    @ViewChild(MatSort) sort!: MatSort;
  
    ngAfterViewInit() {
      this.accordion.openAll();
      this.dataSource.sort = this.sort;
    }
  
    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
      // This example uses English messages. If your application supports
      // multiple language, you would internationalize these strings.
      // Furthermore, you can customize the message to add additional
      // details about the values being sorted.
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }



// ===========Dummy Json Create by pintu====================
    
panels = [
  {
    title: 'Invoice vs PO Validation',
    status: 'Matched',
    statusIcon: 'done_active.svg',
    titleIcon: 'invoice.svg',
    expanded: true
  },
  {
    title: 'Invoice vs PO Vs GRN Validation',
    status: 'Not Matched',
    statusIcon: 'close.svg',
    titleIcon: 'invoice.svg',
    expanded: true
  },
  {
    title: 'Invoice vs PO Vs Invoice History Validation',
    status: 'Matched',
    statusIcon: 'done_active.svg',
    titleIcon: 'invoice.svg',
    expanded: true
  },
  {
    title: 'GSTIN Validation',
    status: 'Review Pending',
    statusIcon: 'pending.svg',
    titleIcon: 'invoice.svg',
    expanded: true
  },
  {
    title: 'E Invoice Validation',
    status: 'Matched',
    statusIcon: 'done_active.svg',
    titleIcon: 'invoice.svg',
    expanded: true
  },
  {
    title: 'QR Validation',
    status: 'Matched',
    statusIcon: 'done_active.svg',
    titleIcon: 'invoice.svg',
    expanded: true
  },
  {
    title: 'MSME Validation',
    status: 'Not Matched',
    statusIcon: 'close.svg',
    titleIcon: 'invoice.svg',
    expanded: true
  },
  {
    title: 'Tax Validation',
    status: 'Matched',
    statusIcon: 'done_active.svg',
    titleIcon: 'invoice.svg',
    expanded: true
  },
  {
    title: 'Vendor Master Validation',
    status: 'Matched',
    statusIcon: 'done_active.svg',
    titleIcon: 'invoice.svg',
    expanded: true
  }
];

}
