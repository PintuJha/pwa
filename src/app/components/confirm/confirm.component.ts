import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from '@angular/common';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MaterialExampleModule],
  templateUrl: 'confirm.component.html',
  styleUrl: './confirm.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ConfirmComponent {
  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
  confirm: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmComponent>) {
    if (data) {
      this.message = data.message || this.message;
      this.confirm = data.confirm || data.error || "CONFIRM";
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
