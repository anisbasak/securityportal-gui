import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../../store';
import { OauthService } from '../../services';

/**
 * This component is an empty landing page that effectively redirects the user
 * back through the authorization flow (which they will likely exit the window from).
 *
 * An alternative UX could be displaying a message along the lines of "You have been
 * signed out!" and providing a button to sign back in with.
 */
@Component({
  selector: 'app-sign-out-page',
  template: ''
})
export class SignOutPageComponent {

  constructor(
    private store: Store<fromStore.AuthState>,
    private oauthService: OauthService
  ) {
    const authorizationState = this.oauthService.createRandomState();
    this.store.dispatch(new fromStore.Authorize({ nextUrl: '', authorizationState }));
  }

}
