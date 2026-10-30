import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MaterialExampleModule } from "src/app/shared/angular-material/MaterialExampleModule";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ForgetPasswordComponent } from './forget-password.component';
import { ForgetRoutingModule } from './forget-routing.module';
import { SharedModule } from "../../../shared/shared.module";


@NgModule({
  declarations: [ForgetPasswordComponent],
  imports: [
    CommonModule,
    ForgetRoutingModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: []
})
export class ForgetModule { }
