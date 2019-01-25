import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as addDays from 'date-fns/add_days';
import * as format from 'date-fns/format';
import * as distanceInWordsStrict from 'date-fns/distance_in_words_strict';

@Component({
  selector: 'date-selector-disabled',
  styleUrls: ['./date-selector-disabled.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="trait && begin; else invalid">
      <span class="trait">{{ trait }}</span>
      <span class="description">{{ getDescription() }}</span>
      <span class="range">({{ getRange() }})</span>
    </ng-container>
    <ng-template #invalid>Invalid</ng-template>
  `
})
export class DateSelectorDisabledComponent {

  /** Trait for the date filter. */
  @Input() trait: string;

  /** Begin date of the filter. */
  @Input() begin: Date;

  /** Optional end date of the filter. */
  @Input() end: Date;

  /** Return string description of date range. */
  getDescription(): string {
    // Beginning of statement
    let statementString = `since ${format(this.begin, 'M/D/YYYY')}`;

    if (this.end) {
      // Add end of statement and fix grammar
      statementString += ` through ${format(this.end, 'M/D/YYYY')}`;
      statementString = statementString.replace(/since/, 'from');
    }

    return statementString;
  }

  /** Return range as time difference from now or between begin and end. */
  getRange(): string {
    if (this.end) {
      // Add one day due to `end` being inclusive of the whole selected day
      return distanceInWordsStrict(addDays(this.end, 1), this.begin);
    } else {
      return distanceInWordsStrict(new Date(), this.begin, {addSuffix: true});
    }
  }
}
