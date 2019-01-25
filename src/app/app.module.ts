import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { DateFnsModule } from 'ngx-date-fns';

// ngrx
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, CustomSerializer, effects } from './store';

// ngrx not used in production
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';


import { environment } from '../environments/environment';

const metaReducers: MetaReducer<any>[] = !environment.production
  ? [storeFreeze]
  : [];

const devModules = !environment.production
  ? [StoreDevtoolsModule.instrument()]
  : [];

// Feature modules
import { AuthModule } from './auth';
import { CoreModule, AppComponent } from '@app/core';

// Routing
import { routes } from './routes';

const APP_IMPORTS = [
  BrowserModule,
  BrowserAnimationsModule,
  HttpClientModule,
  RouterModule.forRoot(routes),

  // State management modules
  StoreModule.forRoot(reducers, { metaReducers }),
  EffectsModule.forRoot(effects),
  StoreRouterConnectingModule,
  ...devModules,

  // Eager application modules
  AuthModule.forRoot(),
  CoreModule.forRoot(),

  // 3rd part modules
  AgmCoreModule.forRoot({
    apiKey: 'AIzaSyDqjbYWCaJR-y7r1Y7ds13OAMQKWPJtaBo'
  }),
  DateFnsModule.forRoot(),
];

const APP_PROVIDERS = [
  Title,
  // The `RouterStateSnapshot` provided by the Router is a large complex structure.
  // Here we're using a custom RouterStateSerializer to parse the snapshot provided
  // by `@ngrx/router-store` to include on the desired pieces of the snapshot.
  { provide: RouterStateSerializer, useClass: CustomSerializer },
];

@NgModule({
  imports: APP_IMPORTS,
  providers: APP_PROVIDERS ,
  bootstrap: [AppComponent]
})
export class AppModule {
}
