
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import _groupBy from 'lodash-es/groupBy';
import _keys from 'lodash-es/keys';

import { ViewableResourceLink } from '../../models';

@Component({
  selector: 'app-view-links',
  styleUrls: ['./links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4>Related to this {{ blueprint }}</h4>
    <div class="card-collection">
      <mat-card *ngFor="let group of groupedLinks()">
        <mat-card-title>{{ group.rule }}</mat-card-title>
        <mat-card-content>
          <p *ngFor="let l of group.links">
            <!-- TODO show active -->
            <i *ngIf="l.resourceMessage">{{ l.resourceMessage }}</i>
            <a *ngIf="l.resourceId" [routerLink]="['/view', l.resourceId]">{{ l.resourceName }}</a>
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ViewLinksComponent {
  @Input() blueprint: string;
  @Input() links: ViewableResourceLink[] = [];

  groupedLinks() {
    const grouped = _groupBy(this.links, link => link.rule);
    const linkRules = _keys(grouped);
    return linkRules.map(lr => ({ rule: lr, links: grouped[lr] }));
  }
}
