import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, map, filter } from 'rxjs/operators';

import { UserGroups } from '@app/core/constants';
import * as fromCore from '@app/core/store';
import * as fromStore from '@app/store';

interface Version {
  app: {
    version: string;
    revision: string;
  };
  api: {
    version: string;
    revision: string;
  };
}

const appVersion = {
  version: require('../../../../package.json').version,
  revision: require('../../../../revision.json').revision
};

@Component({
  selector: 'help-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['help.component.scss'],
  template: `
    <div class="container">
      <h1>{{ fullTitle$ | async }}</h1>
      <div class="subheading">
        <ng-container *ngIf="version$ | async; let version">
          Version

          <!-- App version -->
          {{ version.app.version }}
          <ng-container
            [ngTemplateOutlet]="(isSuperUser$ | async) ? linkedRevision : revision"
            [ngTemplateOutletContext]="_getContext('app', version)">
          </ng-container>

          |

          <!-- Api version -->
          {{ version.api.version }}
          <ng-container
            [ngTemplateOutlet]="(isSuperUser$ | async) ? linkedRevision : revision"
            [ngTemplateOutletContext]="_getContext('api', version)">
          </ng-container>

        </ng-container>
      </div>
      <p>
        Having issues or want to give feedback? Please
        <a [href]="emailHref$ | async">email us!</a>
      </p>
      <a class="button" mat-raised-button color="accent" href="https://sat.ehps.ncsu.edu">SAT Website</a>
    </div>

    <!-- Template: linked or unlinked revision -->
    <ng-template #revision let-text="text">({{ text }})</ng-template>
    <ng-template #linkedRevision let-link="link" let-text="text">
      (<a target="_blank" [href]="link">{{ text }}</a>)
    </ng-template>
  `
})
export class HelpComponent implements OnInit, OnDestroy {
  shortTitle$: Observable<string>;
  fullTitle$: Observable<string>;
  version$: Observable<Version>;
  subject$: Observable<string>;
  versionText$: Observable<string>;
  body$: Observable<string>;
  emailHref$: Observable<string>;
  isSuperUser$: Observable<boolean>;

  private destroy = new Subject<void>();

  constructor(
    private store: Store<fromStore.State>,
  ) { }

  ngOnInit() {
    this.store.dispatch(new fromCore.SetFeatureTitle({ title: 'Help' }));

    // Get whether use is a super user
    this.isSuperUser$ = this.store.pipe(
      select(fromCore.userHasRole(UserGroups.SuperUsers)),
      takeUntil(this.destroy),
    );

    // Get the site title
    this.shortTitle$ = this.store.pipe(
      select(fromCore.getShortSiteTitle),
      takeUntil(this.destroy),
    );

    this.fullTitle$ = this.store.pipe(
      select(fromCore.getFullSiteTitle),
      takeUntil(this.destroy)
    );

    // Get the server/api version and revision
    this.version$ = this.store.pipe(
      select(fromCore.getApiVersion),
      filter(apiVersion => !!apiVersion),
      takeUntil(this.destroy),
      map(apiVersion => {
        return { app: appVersion, api: apiVersion };
      }),
    );

    // Calculate derivative values
    this.subject$ = this.shortTitle$.pipe(map(title => encodeURI(`${title} Feedback`)));
    this.versionText$ = this.version$.pipe(map(v => this._mapVersionToText(v)));
    this.body$ = this.versionText$.pipe(map(version => encodeURI(`\n\n${version}`)));
    this.emailHref$ = combineLatest(this.subject$, this.body$).pipe(
      map(([subject, body]) => `mailto:sat_it_admin@ncsu.edu?subject=${subject}&body=${body}`)
    );
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  _mapVersionToText(version: Version): string {
    const { app, api } = version;
    return `Version ${app.version} (${app.revision}) | ${api.version} (${api.revision})`;
  }

  _getContext(prop: 'app' | 'api', version: Version): { link: string; text: string } {
    const project = `securityportal-${prop === 'app' ? 'gui' : 'server'}`;
    const revision = version[prop].revision;
    return {
      link: `https://github.ncsu.edu/SAT/${project}/commit/${revision}`,
      text: revision
    };
  }

}
