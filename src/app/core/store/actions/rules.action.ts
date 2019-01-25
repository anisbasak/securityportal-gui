import { Action } from '@ngrx/store';
import * as fromModels from '../../models';

// blueprints
export const LOAD_BLUEPRINTS = '[Core] Load Blueprints';
export const LOAD_BLUEPRINTS_FAIL = '[Core] Load Blueprints Fail';
export const LOAD_BLUEPRINTS_SUCCESS = '[Core] Load Blueprints Success';

export class LoadBlueprints implements Action {
  readonly type = LOAD_BLUEPRINTS;
}

export class LoadBlueprintsFail implements Action {
  readonly type = LOAD_BLUEPRINTS_FAIL;
  constructor(public payload: any) {}
}

export class LoadBlueprintsSuccess implements Action {
  readonly type = LOAD_BLUEPRINTS_SUCCESS;
  constructor(public payload: fromModels.Blueprints) {}
}

export type RulesAction =
 | LoadBlueprints
 | LoadBlueprintsFail
 | LoadBlueprintsSuccess;
