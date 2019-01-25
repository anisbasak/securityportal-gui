import { AppComponent } from './app/app.component';
import { LayoutComponent } from './layout/layout.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { MissingPageComponent } from './missing-page/missing-page.component';
import { UnauthorizedPageComponent } from './unauthorized-page/unauthorized-page.component';

export const containers = [
  AppComponent,
  LayoutComponent,
  ErrorPageComponent,
  MissingPageComponent,
  UnauthorizedPageComponent,
];

export * from './app/app.component';
export * from './layout/layout.component';
export * from './error-page/error-page.component';
export * from './missing-page/missing-page.component';
export * from './unauthorized-page/unauthorized-page.component';
