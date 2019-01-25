import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-general-lookup',
  styleUrls: ['./general-lookup.component.scss'],
  template: `
    <mat-card class="lookup">
      <mat-icon class="lookup--icon" title="Search">search</mat-icon>
      <input #general
        type="search"
        class="lookup--input"
        [value]="value || ''"
        (input)="valueChange.emit(general.value)" />
    </mat-card>
  `
})
export class GeneralLookupComponent {
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();
}
