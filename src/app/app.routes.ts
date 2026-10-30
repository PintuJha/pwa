import { Routes } from '@angular/router';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { LayoutComponent } from './core/layout/layout.component';
import { authGuard } from './core/auth-guard/auth.guard';
import { ForgetPasswordComponent } from './modules/auth/forget-password/forget-password.component';
import { OktaCallbackComponent } from '@okta/okta-angular';
import { GeneratePasswordComponent } from './modules/auth/generate-password/generate-password.component';
import { PolicyComponent } from './core/policy/policy.component';
import { ProcessedDocumentBenchComponent } from './app-modules/processed-document-bench/processed-document-bench.component';
import { ErroneousQueueComponent } from './app-modules/erroneous-queue/erroneous-queue.component';
import { WorkflowBenchComponent } from './app-modules/workflow-bench/workflow-bench.component';
import { ApprovalBenchComponent } from './app-modules/approval-bench/approval-bench.component';
import { EmployeeDetailsComponent } from './app-modules/employee-details/employee-details.component';
import { UpdateEmployeeComponent } from './app-modules/update-employee/update-employee.component';
import { EmployeeListComponent } from './app-modules/employee-list/employee-list.component';
import { CreateEmployeeComponent } from './app-modules/create-employee/create-employee.component';
import { AddEmployeeListComponent } from './app-modules/add-employee-list/add-employee-list.component';


export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'forgetResetPWD', component: ForgetPasswordComponent },
    { path: 'generatePassword', component: GeneratePasswordComponent },
    { path: 'policy', component: PolicyComponent },
    {
        path: '',
        component: LayoutComponent,
        // canActivate: [authGuard],
        // canActivateChild: [authGuard],
        children: [
            {
                path: 'workflow-bench',
                component: WorkflowBenchComponent
            },
            {
                path: 'processed-docs-bench',
                component: ProcessedDocumentBenchComponent
            },
            {
                path: 'erroneous-queue',
                component: ErroneousQueueComponent
            },
            {
                path: 'approve-request',
                component: ApprovalBenchComponent
            },
            {
                path: 'create-employee',
                component: CreateEmployeeComponent
            },
            {
                path: 'employee-list',
                component: EmployeeListComponent
            },
            {
                path: 'update-employee',
                component: UpdateEmployeeComponent
            },
            {
                path: 'employee-details',
                component: EmployeeDetailsComponent
            },
             {
                path: 'add-employee-list',
                component: AddEmployeeListComponent
            }
        ],
    },
    { path: '**', pathMatch: 'full', component: PagenotfoundComponent },
    { path: 'bsp/okta', pathMatch: 'full', component: OktaCallbackComponent },
];
