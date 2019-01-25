import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject, Observable } from 'rxjs';

// We must import the dialog component directly (instead of from
// the bullet export) to avoid circular dependency warnings.
import {
  TimeoutWarningDialogComponent,
  TimeoutWarningDialogData
} from '../containers/timeout-warning-dialog/timeout-warning-dialog.component';

@Injectable()
export class TimeoutWarningService {

  private _warning = new TitleWarningFlasher(this.titleService);
  private _ref: MatDialogRef<TimeoutWarningDialogComponent, boolean>;

  constructor(
    private titleService: Title,
    private dialog: MatDialog
  ) {}

  /**
   * Show a timeout warning dialog that blocks the page until the user
   * makes a selection. This method will ensure only one dialog is opened
   * at a time and that the results from the dialog closing event are passed
   * onto the consumer.
   *
   * While the dialog is open, also flash a message in the page title.
   */
  showWarning(expiration: Date): Observable<boolean> {
    if (!this._ref) {
      this._warning.start('Are you still there?', 3000);
      this._ref = this.dialog.open<TimeoutWarningDialogComponent, TimeoutWarningDialogData>(
        TimeoutWarningDialogComponent,
        {
          data: { expiration },
          backdropClass: 'sat-overlay-dark-backdrop',
          disableClose: true,
        }
      );
    }

    const _showWarningResult = new Subject<boolean>();

    this._ref.afterClosed().subscribe(result => {
      this._ref = null;
      this._warning.stop();
      _showWarningResult.next(result);
      _showWarningResult.complete();
    });

    return _showWarningResult.asObservable();
  }

}

class TitleWarningFlasher {
  private _originalTitle: string;
  private _showingNewMessage = false;
  private _intervalRef;

  constructor(private title: Title) {}

  /** Flash a message on the page title at a given interval. */
  start(message: string, interval: number) {
    this._originalTitle = this.title.getTitle();
    this._intervalRef = setInterval(() => {
      if (this._showingNewMessage) {
        this._showingNewMessage = false;
        this.title.setTitle(this._originalTitle);
      } else {
        this._showingNewMessage = true;
        this.title.setTitle(message);
      }
    }, interval);
  }

  /**
   * Stop flashing the message and return the title to
   * the original text.
   */
  stop() {
    if (this._intervalRef) {
      clearInterval(this._intervalRef);
    }

    if (this._originalTitle) {
      this._showingNewMessage = false;
      this.title.setTitle(this._originalTitle);
    }
  }

}
