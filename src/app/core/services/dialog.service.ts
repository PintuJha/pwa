import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialogRef: MatDialogRef<any> | null = null;
  private preventCloseCallback = false;

  constructor(private dialog: MatDialog) {}

  public openDialog(component: any, config?: any): MatDialogRef<any> {
    // Close the previous dialog if it's open
    if (this.dialogRef) {
      this.preventCloseCallback = true;
      this.dialogRef.close('skip');
    }

    // Open the new dialog and save the reference
    this.dialogRef = this.dialog.open(component, config);

    // Reset the reference when the dialog is closed
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'skip' && !this.preventCloseCallback) {
        // Only trigger the callback if preventCloseCallback is false
        this.onDialogClosed(result);
      }
      this.preventCloseCallback = false;
      this.dialogRef = null;
    });

    return this.dialogRef;
  }

  private onDialogClosed(result: any) {
  }
}
