import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'app-lookup-key',
  styleUrls: ['./lookup-key.component.scss'],
  template: `
    <div [title]="key.description" [ngSwitch]="key.dataType">

      <app-lookup-key-number
        *ngSwitchCase="'number'"
        [key]="key"
        [value]="value"
        (fieldChange)="fieldChange.emit($event)">
      </app-lookup-key-number>
      <app-lookup-key-text
        *ngSwitchCase="'string'"
        [key]="key"
        [value]="value"
        (fieldChange)="fieldChange.emit($event)">
      </app-lookup-key-text>
      <app-lookup-key-boolean
        *ngSwitchCase="'boolean'"
        [key]="key"
        [value]="value"
        (fieldChange)="fieldChange.emit($event)">
      </app-lookup-key-boolean>
      <app-lookup-key-date
        *ngSwitchCase="'date'"
        [key]="key"
        [value]="value"
        (fieldChange)="fieldChange.emit($event)">
      </app-lookup-key-date>

    </div>
  `
})
export class LookupKeyComponent {
  @Input() key: fromModels.LookupKey;
  @Input() value: fromModels.LookupField;
  @Output() fieldChange = new EventEmitter<fromModels.LookupFieldChange>();
}
