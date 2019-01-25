import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import _isString from 'lodash-es/isString';
import _isNumber from 'lodash-es/isNumber';

import { Resource, Trait } from '@app/core/models';
import { stringScore } from '@app/shared';
import { LIST_ITEM_LAYOUT } from '../resource.config';
import { LayoutService } from '../services/layout.service';
import { AvatarUtil } from '@app/core/util';

@Component({
  selector: 'resource-list-item',
  styleUrls: ['./list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="list-item mat-elevation-z1">
      <a [routerLink]="[rootPath, id]">
        <mat-list-item>
          <!-- Avatar -->
          <resource-avatar mat-list-avatar *ngIf="avatar !== undefined"
            [name]="title"
            [avatarMd5]="avatar">
          </resource-avatar>

          <!-- Title -->
          <p matLine>{{ title }}</p>

          <!-- Single value data -->
          <p matLine *ngIf="genericValue">{{ genericValue | resource }}</p>

          <!-- Subtitles -->
          <p matLine class="subtitle"
            *ngFor="let item of resolvedLayout.subtitles?.filter(_maxSubtitles)"
            [title]="item.name">
            {{ item.value | async | resource }}
          </p>
          <ng-container *ngFor="let blank of blankSubTitles()" ngProjectAs="[matLine]">
            <p matLine></p>
          </ng-container>
        </mat-list-item>

        <!-- Detail messages -->
        <span class="detail blueprint">
          {{ blueprint }}
        </span>
        <span class="detail trait">
          {{ traitMessage }}
        </span>
      </a>
    </mat-card>
  `
})
export class ResourceListItemComponent implements OnChanges {

  @Input() searchTerm: string;

  @Input() rootPath = '/view';

  @Input() constantHeight = false;

  resolvedLayout: any = {};
  genericValue: any;
  id: string;
  traitMessage: string;
  blueprint: string;

  avatar: string;
  title: string;

  private _resource: Resource;

  /** A resource to be displayed as a list item */
  @Input() set resource(r: Resource) {
    this.id = r._id;
    if (r && r.name && r._id) {
      this.genericValue = undefined;
      this.blueprint = r.blueprint;
      this._resource = r;
      this.resolvedLayout = this.layoutService.resolve(LIST_ITEM_LAYOUT, r);

      if (r.avatar) {
        // Will return 'null' if no avatar found
        this.avatar = AvatarUtil.getAvatarBySize(r.avatar, 'small');
      } else {
        this.avatar = undefined;
      }

      this.title = r.name;
    } else {
      this.genericValue = r;
      this.blueprint = this._resource = this.avatar = undefined;
      this.resolvedLayout = {};
      this.title = undefined;
    }
  }

  constructor (
    private layoutService: LayoutService
  ) { }

  // TODO(will): Investigate if a tooltip would be better suited here
  ngOnChanges(changes) {
    if (!this.searchTerm || !this._resource) {
      this.traitMessage = null;
      return;
    }

    // Split highlighted terms by spaces
    const searchTerms = this.searchTerm
      .replace(/[^A-Za-z0-9\s]+/, ' ')
      .split(' ')
      .filter(x => !!x);

    // Sort traits containing some of the search terms by similarity
    const traits = this._resource.traits
      .filter(x => _isString(x.value) || _isNumber(x.value))
      .filter(x => searchTerms.some(t => getVal(x).toLowerCase().includes(t.toLowerCase())))
      .sort((a, b) => {
        const aScore = stringScore(this.searchTerm.toLowerCase(), getVal(a).toLowerCase(), 0.7);
        const bScore = stringScore(this.searchTerm.toLowerCase(), getVal(b).toLowerCase(), 0.7);
        return bScore - aScore;
      });

    if (!traits.length) {
      this.traitMessage = null;
      return;
    }

    this.traitMessage = `${traits[0].rule}: ${traits[0].value}`;
  }

  /**
   * Filters the subtitle list to only show the top 2.
   * For internal use.
   */
  _maxSubtitles(subtitle, index) {
    return index < 2;
  }

  /** Returns an array the length of how many blank subtitles to add. */
  blankSubTitles(): any[] {
    if (!this.resolvedLayout.subtitles || !this.constantHeight) {
      return [];
    }

    const subCount = this.resolvedLayout.subtitles.length;
    return Array.from('.'.repeat(2 - subCount));
  }

}

/** Utility to ensure return value is a string */
function getVal(x: Trait): string {
  return x.value.toString();
}
