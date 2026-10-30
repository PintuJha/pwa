import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PolicyComponent } from './policy.component';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    MaterialExampleModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
],
  declarations: [PolicyComponent]
})
export class PolicyModule { }
