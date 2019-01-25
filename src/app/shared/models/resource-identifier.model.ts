/** Contains information necessary to later retrieve the _exact_ same resource */
export interface ResourceIdentifier {
  /** Blueprint of the resource */
  blueprint: string;

  /** Identifying collection of traits. */
  assurances: ResourceIdentifierAssurance[];
}

/** Contains more metadata than the ResourceIdentifier */
export interface ExpandedResourceIdentifier {
  /** The id of the resource */
  id: string;

  /** The preferred title of the resource */
  title: string;

  /** The avatar of the resource */
  avatar?: string;

  /** The actual resource identifier */
  identifier: ResourceIdentifier;
}

/** Contains a trait and the name of the assurance rule that it belongs to. */
export interface ResourceIdentifierAssurance {
  /** Name of the assurance. */
  name: string;

  /** Trait rule. */
  rule: string;

  /** Trait value. */
  value: string | number | boolean;
}
