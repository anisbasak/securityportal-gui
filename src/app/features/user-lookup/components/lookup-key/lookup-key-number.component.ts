import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'app-lookup-key-number',
  template: `
    <label>{{ key.title }}</label>
    <select #modifier [value]="getModifier()" (change)="emitChange(modifier.value, number.value)">
      <option value="less">less than</option>
      <option value="is">equal to</option>
      <option value="greater">greater than</option>
    </select>
    <input #number type="number" [value]="getNumberValue()" (change)="emitChange(modifier.value, number.value)" />
  `
})
export class LookupKeyNumberComponent {
  @Input() key: fromModels.LookupKey;
  @Input() value: fromModels.LookupField;
  @Output() fieldChange = new EventEmitter<fromModels.LookupFieldChange>();

  getModifier() {
    return this.value ? this.value.modifier : 'greater';
  }

  getNumberValue() {
    return this.value ? this.value.value : undefined;
  }

  emitChange(modifier: string, number: number) {
    const { key } = this.key;
    const value = number != null ? number : null;
    this.fieldChange.emit({ key, value: { modifier, value }});
  }
}
