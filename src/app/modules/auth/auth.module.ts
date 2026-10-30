import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { CommonModule } from "@angular/common";
import { MaterialExampleModule } from "src/app/shared/angular-material/MaterialExampleModule";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthRoutingModule } from "./auth-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { GeneratePasswordComponent } from "./generate-password/generate-password.component";

@NgModule({
    imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
],
    declarations: [LoginComponent,GeneratePasswordComponent],

    exports: []
})
export class AuthModule { }