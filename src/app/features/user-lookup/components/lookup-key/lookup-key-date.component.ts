import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'app-lookup-key-date',
  template: `
    <label>{{ key.title }}</label>
    <select #modifier [value]="getModifier()" (change)="emitChange(modifier.value, date.value)">
      <option value="before">before</option>
      <option value="after">after</option>
      <option value="is">is</option>
    </select>
    <input #date type="date" [value]="getDateValue()" (change)="emitChange(modifier.value, date.value)" />
  `
})
export class LookupKeyDateComponent {
  @Input() key: fromModels.LookupKey;
  @Input() value: fromModels.LookupField;
  @Output() fieldChange = new EventEmitter<fromModels.LookupFieldChange>();

  getModifier() {
    return this.value ? this.value.modifier : 'is';
  }

  getDateValue() {
    return this.value ? this.value.value : '';
  }

  emitChange(modifier: string, text: string) {
    const { key } = this.key;
    const value = text || null;
    this.fieldChange.emit({ key, value: { modifier, value } });
  }
}
