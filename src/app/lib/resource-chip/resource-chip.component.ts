import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';

import { Resource } from '@app/core/models';
import { ExpandedResourceIdentifier } from '@app/shared';

@Component({
  selector: 'sat-resource-chip',
  styleUrls: ['./resource-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-chip class="sat-resource-chip" [selectable]="false" [removable]="removable" (removed)="removed.emit()">
      <resource-avatar *ngIf="contact"
        class="sat-resource-contact"
        [avatarMd5]="avatarMd5"
        [name]="title"></resource-avatar>
      {{ title }}
      <mat-icon matChipRemove *ngIf="removable">cancel</mat-icon>
    </mat-chip>
  `
})
export class SatResourceChipComponent implements OnChanges {

  /** Expanded resource identifier representing the chip */
  @Input() identifier: ExpandedResourceIdentifier;

  /** Resource representing the chip */
  @Input() resource: Resource;

  /** Whether the chip can be removed */
  @Input() removable = true;

  /** Whether the chip is a contact chip */
  @Input() contact = true;

  /** Emitted whenever the chip should be removed */
  @Output() removed = new EventEmitter<void>();

  /** The name to be displayed on the chip */
  title: string = '?';

  /** The avatar to display for a contact chip */
  avatarMd5: string;

  ngOnChanges() {
    // Prefer the identifier
    if (this.identifier) {
      this.title = this.identifier.title;
      this.avatarMd5 = this.identifier.avatar || null;
    } else if (this.resource) {
      this.title = this.resource.name;
    }
  }

}
