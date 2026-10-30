import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { LOCAL_SESSION_STORAGE } from 'src/app/shared/constants/constans';
import { CommonModule } from '@angular/common';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';

@Component({
  selector: 'app-single-action-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MaterialExampleModule],
  templateUrl: './single-action-dialog.component.html',
  styleUrl: './single-action-dialog.component.scss'
})
export class SingleActionDialogComponent implements OnInit{

  constructor(public dialogRef: MatDialogRef<SingleActionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { title: string; content: string; buttonText: string }
   ) {}

  ngOnInit(): void {
  }

  onClose(): void {
    localStorage.setItem(LOCAL_SESSION_STORAGE.LOGOUTSESSION, 'true');
    localStorage.setItem(LOCAL_SESSION_STORAGE.CLOSE_SINGLE_ACTION_DIALOG, 'true');
    this.dialogRef.close('confirmed');
  }

}
