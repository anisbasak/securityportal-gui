import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import _find from 'lodash-es/find';
import _sortBy from 'lodash-es/sortBy';
import { ViewableResourceTrait } from '../../models';

@Component({
  selector: 'app-view-traits',
  styleUrls: ['./traits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4>All Data</h4>
    <table>
      <tr *ngFor="let trait of traits" [class.dark-row]="trait.fullAssurance">
        <td [title]="(trait.active ? 'Active' : 'Not active')">
          <sp-active-badge [active]="trait.active"></sp-active-badge>
        </td>
        <td class="trait-name" title="Rule">{{ trait.rule }}</td>
        <td class="value" title="Value">{{ trait.value }}</td>
        <td class="value" title="Priority">{{ trait.priority }}</td>
        <td class="value" title="Timestamp">{{ trait.ts | date:'medium' }}</td>
        <td class="value" title="Options">{{ trait.option }}</td>
        <td class="value" title="Meta">{{ trait.meta }}</td>
      </tr>
    </table>
  `
})
export class ViewTraitsComponent {
  @Input() traits: ViewableResourceTrait[];
}
