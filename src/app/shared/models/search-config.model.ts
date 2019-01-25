/** Search object */
export interface RuleSearchConfig {
  /** Key used to specify the search field. */
  key: string;

  /** Search title. */
  title: string;

  /** Search description. */
  description: string;

  /** Search input type. */
  input: 'text' | 'checkbox';

  /** Validation parameters. */
  validations: RuleSearchValidation[];
}

/** Validation object. */
export interface RuleSearchValidation {
  /** Regular Expression pattern for search. */
  pattern: string;

  /** Validation failure message. */
  msg: string;

  /** Supporting information. */
  info: string;
}
