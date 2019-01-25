import { Component, Input } from '@angular/core';

import * as fromModels from '../../models';

@Component({
  selector: 'app-task-stats',
  styleUrls: ['./task-stats.component.scss'],
  template: `
    <div class="mat-subheading-2">Stats</div>
    <table class="mat-body">
      <tr><td>Current:</td><td>{{ task.stats.current }}</td></tr>
      <tr><td>Total:</td><td>{{ task.stats.total }}</td></tr>
      <tr><td>Progress:</td><td>{{ task.stats.percentComplete | percent }}</td></tr>
      <tr><td>Offset:</td><td>{{ task.stats.offset }}</td></tr>
    </table>
  `
})
export class TaskStatsComponent {
  @Input() task: fromModels.Task;
}
