import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SatConfirmComponent } from './confirm.component';
import { SatConfirmDialogConfig } from './confirm-dialog.model';

@Injectable()
export class SatConfirmService {

  constructor(private dialog: MatDialog) { }

  /**
   * Opens a new dialog immediately and returns an observable of a boolean result
   * of whether the dialog message was confirmed.
   */
  open(data: SatConfirmDialogConfig, config?: MatDialogConfig): Observable<boolean> {

    // Assign centering panel class, but allow overwritting. Merge confirm config as `data`
    const mergedConfig = Object.assign(
      { panelClass: 'sat-centered-dialog' },
      config,
      { data: data }
    );

    // Open the dialog
    const ref = this.dialog.open(SatConfirmComponent, mergedConfig);

    // Return a boolean result from the closed dialog
    return ref.afterClosed().pipe(map(val => !!val));
  }
}
