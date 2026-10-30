import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-workflow-view',
  standalone: true,
  imports: [CommonModule, MaterialExampleModule, ReactiveFormsModule, SharedModule],
  templateUrl: './workflow-view.component.html',
  styleUrl: './workflow-view.component.scss'
})
export class WorkflowViewComponent {

}
