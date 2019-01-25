import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material';
import { map, filter, take, tap } from 'rxjs/operators';

import * as formActions from '../actions/form.action';
import { SimpleDialog } from '@app/shared/simple-dialog';

@Injectable()
export class FormEffects {

  constructor(
    private action$: Actions,
    private dialog: MatDialog,
  ) {}

  @Effect({ dispatch: false })
  showWarningDialog$ = this.action$.pipe(
    ofType(formActions.UPDATE_FORM_USER_FIELD, formActions.UPDATE_FORM_LINK_FIELD),
    map((action: formActions.UpdateFormUserField | formActions.UpdateFormLinkField) => {
      return action.payload.value.modifier;
    }),
    filter(modifer => ['contains', 'begins', 'ends'].includes(modifer)),
    take(1),
    tap(() => this.dialog.open(SimpleDialog, { data: {
      title: 'Warning',
      message: 'Searching for users via anything other than an exact match may result in slow response times.'
    }})),
  );
}
