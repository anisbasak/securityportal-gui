import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'app-lookup-key-boolean',
  template: `
    <label>{{ key.title }}</label>
    <select #boolean [value]="getBooleanValue()" (change)="emitChange(boolean.value)">
      <option value="unset" selected>don't care</option>
      <option value="true">true</option>
      <option value="false">false</option>
    </select>
  `
})
export class LookupKeyBooleanComponent {
  @Input() key: fromModels.LookupKey;
  @Input() value: fromModels.LookupField;
  @Output() fieldChange = new EventEmitter<fromModels.LookupFieldChange>();

  getBooleanValue() {
    return this.value ? this.value.value : 'unset';
  }

  emitChange(bool: string) {
    const { key } = this.key;
    const value = bool === 'unset' ? null : bool;
    this.fieldChange.emit({ key, value: { value } });
  }
}
