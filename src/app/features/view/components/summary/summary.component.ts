import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Avatar } from '@app/core/models';


@Component({
  selector: 'app-view-summary',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <resource-gallery
      *ngIf="avatar"
      [name]="name"
      [avatar]="avatar">
    </resource-gallery>
    <div class="summary-info">
      <h3>{{ name }}</h3>
    </div>
  `
})
export class ViewSummaryComponent {
  @Input() avatar: Avatar;
  @Input() name: string;
}
