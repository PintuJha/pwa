import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-erroneous-remarks',
  standalone: true,
   imports: [CommonModule, MaterialExampleModule, ReactiveFormsModule, SharedModule],
  templateUrl: './erroneous-remarks.component.html',
  styleUrl: './erroneous-remarks.component.scss'
})
export class ErroneousRemarksComponent {

}
