import { Component, Input, EventEmitter, Output } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'app-lookup-key-text',
  template: `
    <label>{{ key.title }}</label>
    <select #modifier [value]="getModifier()" (change)="emitChange(modifier.value, text.value)">
      <option value="begins">begins with</option>
      <option value="ends">ends with</option>
      <option value="contains">contains</option>
      <option value="is">is</option>
    </select>
    <input #text type="text" [value]="getTextValue()" (change)="emitChange(modifier.value, text.value)" />
  `
})
export class LookupKeyTextComponent {
  @Input() key: fromModels.LookupKey;
  @Input() value: fromModels.LookupField;
  @Output() fieldChange = new EventEmitter<fromModels.LookupFieldChange>();

  getModifier() {
    return this.value ? this.value.modifier : 'is';
  }

  getTextValue() {
    return this.value ? this.value.value : '';
  }

  emitChange(modifier: string, text: string) {
    const { key } = this.key;
    const value = text || null;
    this.fieldChange.emit({ key, value: { modifier, value } });
  }
}
