import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { LayoutComponent } from './layout.component';
import { MaterialExampleModule } from 'src/app/shared/angular-material/MaterialExampleModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutService } from '../services/layout.service';


@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatSlideToggleModule,
    MatExpansionModule,
    RouterModule,
    MatTreeModule,
    MatToolbarModule,
    MatButtonModule,
    MaterialExampleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    LayoutService
  ]
})


export class LayoutModule { }
