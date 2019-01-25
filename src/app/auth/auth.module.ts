import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { DateFnsModule } from 'ngx-date-fns';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromContainers from './containers';
import { OauthService, TimeoutWarningService } from './services';
import { TokenInterceptor } from './interceptors';
import { AuthGuard } from './guards';
import { reducers, effects, AUTH_FEATURE_NAME } from './store';
import { routes } from './routes';

// tslint:disable:no-use-before-declare

@NgModule({
  imports: [
    HttpClientModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(AUTH_FEATURE_NAME, reducers),
    EffectsModule.forFeature(effects),
    MatDialogModule,
    MatButtonModule,
    DateFnsModule,
  ],
  declarations: [
    ...fromContainers.containers
  ],
  entryComponents: [
    fromContainers.TimeoutWarningDialogComponent,
  ]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootAuthModule,
      providers: [
        OauthService,
        TimeoutWarningService,
        AuthGuard,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    };
  }
}

@NgModule({
  imports: [
    AuthModule,
  ],
})
export class RootAuthModule {}
