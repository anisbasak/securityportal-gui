import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/common';
import { SatRepeatModule } from '@app/lib/repeat';
import { SatGenericOverlayModule } from '@app/lib/generic-overlay';

// containers
import { SatSchedulerComponent } from './containers/scheduler/scheduler.component';

// components
import { EndSelectorComponent } from './components/end-selector/end-selector.component';
import { RepeatContainerComponent } from './components/repeat-container/repeat-container.component';
import { RepeatSelectorComponent } from './components/repeat-selector/repeat-selector.component';
import { StartSelectorComponent } from './components/start-selector/start-selector.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    SharedModule,
    SatRepeatModule,
    SatGenericOverlayModule
  ],
  declarations: [
    // containers
    SatSchedulerComponent,
    // components
    EndSelectorComponent,
    RepeatContainerComponent,
    RepeatSelectorComponent,
    StartSelectorComponent
  ],
  entryComponents: [
    RepeatContainerComponent
  ],
  exports: [
    SatSchedulerComponent
  ]
})
export class SatSchedulerModule { }
