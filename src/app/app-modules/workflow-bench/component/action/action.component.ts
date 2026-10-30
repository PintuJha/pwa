import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';
import { WorkflowViewComponent } from '../workflow-view/workflow-view.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewDocumentComponent } from '../view-document/view-document.component';

@Component({
  selector: 'app-action',
  standalone: true,
  imports: [MaterialExampleModule],
  templateUrl: './action.component.html',
  styleUrl: './action.component.scss'
})
export class ActionComponent implements AgRendererComponent {
  params: any;
  agInit(params: ICellRendererParams<any, any, any>): void {
   this.params = params;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    throw new Error('Method not implemented.');
  }


  


   constructor(public dialog: MatDialog) {}
  
      /**
        * @function to opens View Document Component.
        * @returns void.
       */
    
      onWorkflowView(): void {
        this.dialog.open(ViewDocumentComponent, {
         width: '100%',
        maxWidth:'100%',
        disableClose: true,
        panelClass: 'RpaOcrExtractionComponent'
        });
      }
}
