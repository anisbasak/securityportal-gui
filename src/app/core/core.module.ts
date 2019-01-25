import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatTabsModule,
  MatToolbarModule,
} from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ResourceAvatarModule } from '@app/shared/resource-avatar';
import { reducers, effects } from './store';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import * as fromInterceptors from './interceptors';
import * as fromServices from './services';
import * as fromGuards from './guards';
import { routes } from './routes';

export const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatTabsModule,
  MatToolbarModule,
];

export const COMPONENTS = [
  ...fromComponents.components,
  ...fromContainers.containers,
];

export const PROVIDERS = [
  fromServices.AppLoaderService,
  fromServices.CoreApiService,
  fromServices.MenuService,
  fromServices.RouteAccessService,
  fromServices.RulesApiService,
  fromServices.UserService,
  fromServices.LoadingService,
  ...fromGuards.guards,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: fromInterceptors.LoaderInterceptor,
    multi: true,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('core', reducers),
    EffectsModule.forFeature(effects),
    ResourceAvatarModule,
    ...MATERIAL_MODULES,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: PROVIDERS,
    };
  }
}
