import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/common';

// containers
import { SatRepeatComponent } from './containers/repeat/repeat.component';

// components
import { RepeatSelectComponent } from './components/repeat-select/repeat-select.component';
import { RepeatAdjustComponent } from './components/repeat-adjust/repeat-adjust.component';
import { DayOfWeekSelectComponent } from './components/dow-select/dow-select.component';
import { DayOfMonthSelectComponent } from './components/dom-select/dom-select.component';
import { MonthOfYearSelectComponent } from './components/moy-select/moy-select.component';
import { MultiDaySelectComponent } from './components/multi-day-select/multi-day-select.component';
import { RelativeDaySelectComponent } from './components/relative-day-select/relative-day-select.component';


@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [
    // containers
    SatRepeatComponent,
    // components
    RepeatSelectComponent,
    RepeatAdjustComponent,
    DayOfWeekSelectComponent,
    DayOfMonthSelectComponent,
    MonthOfYearSelectComponent,
    MultiDaySelectComponent,
    RelativeDaySelectComponent,
  ],
  exports: [
    SatRepeatComponent
  ]
})
export class SatRepeatModule { }
