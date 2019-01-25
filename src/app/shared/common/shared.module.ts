import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';

// Modules
import { MaterialModule } from './material/material.module';

// Components
import { SatAsyncLoaderComponent } from './components/async-loader/async-loader.component';
import { SatCardHeaderComponent } from './components/card-header/card-header.component';
import { SatDividerComponent } from './components/divider/divider.component';
import { SlideComponent } from './components/slide/slide.component';

// Pipes
import { BoldPipe } from './pipes/bold.pipe';
import { ResourcePipe } from './pipes/resource.pipe';
import { ReversePipe } from './pipes/reverse.pipe';
import { PluralPipe } from './pipes/plural.pipe';
import { TimeDiffPipe } from './pipes/time-diff.pipe';

// Directives
import {
  SatAsyncContentDirective,
  SatAsyncLoaderDirective
} from './components/async-loader/async-loader.directives';


const VENDOR_MODULES = [
  AgmCoreModule,
];

const SHARED_MODULES = [
  MaterialModule
];

const COMPONENTS = [
  SatAsyncLoaderComponent,
  SatCardHeaderComponent,
  SatDividerComponent,
  SlideComponent
];

const PIPES = [
  BoldPipe,
  ResourcePipe,
  ReversePipe,
  PluralPipe,
  TimeDiffPipe
];

const DIRECTIVES = [
  SatAsyncContentDirective,
  SatAsyncLoaderDirective
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ...VENDOR_MODULES,
    ...SHARED_MODULES
  ],
  declarations: [
    ...DIRECTIVES,
    ...PIPES,
    ...COMPONENTS,
  ],
  exports: [
    CommonModule,
    ...PIPES,
    ...DIRECTIVES,
    ...COMPONENTS,
    ...VENDOR_MODULES,
    ...SHARED_MODULES
  ]
})
export class SharedModule {
}
