/** Configuration for laying out a confirm dialog with exactly 2 actions */
export interface SatConfirmDialogConfig {
  /** Optional confirm dialog title */
  title?: string;

  /** Optional body for the dialog */
  body?: string;

  /** Dismiss action that returns a falsy value */
  dismiss: SatConfirmDialogButton;

  /** Confirmation action that returns a truthy value */
  confirm: SatConfirmDialogButton;
}

export interface SatConfirmDialogButton {
  /** Defaults to 'Cancel' or 'OK' */
  text?: string;

  /** Defaults to 'primary' */
  color?: 'primary' | 'accent' | 'warn';

  /** Defaults to false */
  raised?: boolean;
}
