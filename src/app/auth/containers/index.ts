import { OauthCallbackPageComponent } from './oauth-callback-page/oauth-callback-page.component';
import { SignOutPageComponent } from './sign-out-page/sign-out-page.component';
import { TimeoutWarningDialogComponent } from './timeout-warning-dialog/timeout-warning-dialog.component';

export const containers = [
  OauthCallbackPageComponent,
  SignOutPageComponent,
  TimeoutWarningDialogComponent,
];

export * from './oauth-callback-page/oauth-callback-page.component';
export * from './sign-out-page/sign-out-page.component';
export * from './timeout-warning-dialog/timeout-warning-dialog.component';
