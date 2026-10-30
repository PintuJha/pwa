import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-submit-to-approval',
  standalone: true,
  imports: [CommonModule, MaterialExampleModule, ReactiveFormsModule, SharedModule],
  templateUrl: './submit-to-approval.component.html',
  styleUrl: './submit-to-approval.component.scss'
})
export class SubmitToApprovalComponent {

}
