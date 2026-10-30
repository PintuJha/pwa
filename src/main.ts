import { enableProdMode, importProvidersFrom, APP_INITIALIZER, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OAuthModule } from 'angular-oauth2-oidc';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AgGridModule } from 'ag-grid-angular';
import { NgxEditorModule } from 'ngx-editor';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { appRoutes } from './app/app.routes';
import { MaterialExampleModule } from './app/shared/angular-material/MaterialExampleModule';
import { SharedModule } from './app/shared/shared.module';
import { LayoutModule } from './app/core/layout/layout.module';
import { AuthModule } from './app/modules/auth/auth.module';
import { ForgetModule } from './app/modules/auth/forget-password/forget.module';
import { HttpInterceptorService } from './app/core/services/http-interceptor.service';
import { HttpService } from './app/core/services/http.service';
import { SpinnerService } from './app/core/services/spinner.service';
import { ToastService } from './app/core/services/toast.service';
import { AuthenticationService } from './app/core/services/authentication.service';
import { ConfigService } from './app/core/services/config.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { CheckTokenExpiryService } from './app/core/services/check-token-expiry.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { DialogService } from './app/core/services/dialog.service';
import { LocaleService } from './app/core/services/locale.service';
import { ExcelExportService } from './app/core/services/excel-export.service';
import { AgGridAngular } from 'ag-grid-angular';
import { provideServiceWorker } from '@angular/service-worker';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled', useHash: true, onSameUrlNavigation: 'reload' }),
      BrowserAnimationsModule,
      MaterialExampleModule,
      LayoutModule,
      DragDropModule,
      AgGridModule,
      FormsModule,
      MatSelectModule,
      MatFormFieldModule,
      MatPaginatorModule,
      MatTableModule,
      MatTabsModule,
      MatInputModule,
      ReactiveFormsModule,
      AuthModule,
      ForgetModule,
      OAuthModule.forRoot(),
      SharedModule,
      NgxEditorModule
    ),
    HttpService,
    AuthenticationService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ConfigService],
      useFactory: (appConfigService: ConfigService) => {
        return () => {
          return appConfigService.loadAppConfig();
        };
      },
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    DatePipe,
    SpinnerService,
    AgGridAngular,
    ToastService,
    OAuthService,
    CheckTokenExpiryService,
    BnNgIdleService,
    DialogService,
    LocaleService,
    ExcelExportService,
    provideHttpClient(withInterceptorsFromDi()), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
  ]
}).catch(err => console.error(err));
