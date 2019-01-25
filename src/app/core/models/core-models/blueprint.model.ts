import { DataType } from './common';

export type Blueprints = Blueprint[];

export interface Blueprint {
  _id: string;
  name: string;
  assurances: BlueprintAssurance[];
  traits: BlueprintTrait[];
}

export interface BlueprintAssurance {
  rule: string;
  uniqueness: number;
  isVital: boolean;
}

export interface BlueprintTrait {
  rule: string;
  key: string;
  title: string;
  description: string;
  dataType: DataType;
  upsertRule: UpsertRule;
  reference: BlueprintTraitReference | null;
  validations?: string[];
  extendable?: {
    replaceExisting: boolean;
    configs: BlueprintTraitExtension[];
  };
}

export type UpsertRule = 'replace' | 'multiple' | 'single' | 'protect';

export interface BlueprintTraitReference {
  blueprints: string[];
  rule: string;
}

export interface BlueprintTraitExtension {
  type: 'asc_date' | 'desc_date' | 'single' | 'concat';
  rules: string[];
  separator?: string;
}
