import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

import { ResultsView } from '../../models';

interface ResultSelector {
  id: ResultsView;
  title: string;
  icon: string;
  condition: () => boolean;
}

@Component({
  selector: 'results-view-selectors',
  styleUrls: ['./results-view-selectors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngFor="let selector of selectors">
      <mat-icon *ngIf="selector.condition()"
        (click)="selection.emit(selector.id)"
        [title]="selector.title"
        [class.selected]="view === selector.id">
        {{ selector.icon }}
      </mat-icon>
    </ng-container>
  `
})
export class ResultsViewSelectorsComponent {

  /** Whether the map selector should be shown. */
  @Input() showMapView = false;

  /** Currently selected view. */
  @Input() view: ResultsView;

  /** Emits when the user makes a selection. */
  @Output() selection = new EventEmitter<ResultsView>();

  /** Config for the selectors. */
  selectors: ResultSelector[] = [
    { id: 'list', title: 'View results as a list', icon: 'view_list', condition: () => true },
    { id: 'group', title: 'View results in groups', icon: 'view_stream', condition: () => true },
    { id: 'map', title: 'View results on a map', icon: 'place', condition: () => this.showMapView }
  ];

}
