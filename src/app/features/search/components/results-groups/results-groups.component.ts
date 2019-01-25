import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { ResultsGroup } from '../../models';

@Component({
  selector: 'search-results-groups',
  styleUrls: ['./results-groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-accordion>
      <mat-expansion-panel *ngFor="let group of groups; trackBy: trackByFn">
        <!-- Panel header -->
        <mat-expansion-panel-header>
          {{ group.blueprint | plural: group.resources.length }}
        </mat-expansion-panel-header>

        <!-- Content -->
        <div *ngFor="let resource of group.resources" class="resource-name">
          <a [routerLink]="['/view', resource._id]" >{{ resource.name }}</a>
        </div>
      </mat-expansion-panel>
    </mat-accordion>

    <ng-content></ng-content>
  `
})
export class ResultGroupsComponent {
  /** Groups of resources organized by blueprint. */
  @Input() groups: ResultsGroup[];

  /** Returns unique ID of groups (blueprint). */
  trackByFn(index: number, group: ResultsGroup) {
    return group.blueprint;
  }
}
