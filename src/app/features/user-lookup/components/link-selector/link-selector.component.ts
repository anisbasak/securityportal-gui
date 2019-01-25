import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-link-selector',
  template: `
    <select #input (change)="linkChange.emit(input.value)">
      <option disabled [selected]="!selection" value> -- select an option -- </option>
      <option *ngFor="let blueprint of blueprints" [value]="blueprint" [selected]="blueprint === selection">{{ blueprint }}</option>
    </select>
  `
})
export class LinkSelectorComponent {
  @Input() blueprints: string[];
  @Input() selection: string;
  @Output() linkChange = new EventEmitter<string>();
}
