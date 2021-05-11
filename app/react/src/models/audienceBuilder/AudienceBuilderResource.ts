import { QueryBooleanOperator, SelectionOperation } from './../datamart/graphdb/QueryDocument';
export interface AudienceBuilderResource {
  id: string;
  name: string;
  datamart_id: string;
  demographics_features_ids: string[];
}

export interface AudienceBuilderGroupNode {
  type: 'GROUP';
  expressions: AudienceBuilderNodeShape[];
  negation?: boolean;
  boolean_operator: QueryBooleanOperator;
}

export interface AudienceBuilderParametricPredicateGroupNode {
  expressions: AudienceBuilderParametricPredicateNode[];
}

export interface AudienceBuilderParametricPredicateNode {
  type: 'PARAMETRIC_PREDICATE';
  parametric_predicate_id: string;
  parameters: {
    [key: string]: string[] | string | number | undefined;
  };
}

export function isAudienceBuilderGroupNode(
  node: AudienceBuilderNodeShape,
): node is AudienceBuilderGroupNode {
  return node.type === 'GROUP';
}

export function isAudienceBuilderParametricPredicateNode(
  node: AudienceBuilderNodeShape,
): node is AudienceBuilderParametricPredicateNode {
  return node.type === 'PARAMETRIC_PREDICATE';
}

export type AudienceBuilderNodeShape =
  | AudienceBuilderGroupNode
  | AudienceBuilderParametricPredicateNode;


export interface AudienceBuilderFormData {
  include: AudienceBuilderParametricPredicateGroupNode[];
  exclude: AudienceBuilderParametricPredicateGroupNode[];
}

export interface AudienceBuilderQueryDocument {
  language_version?: string;
  operations: SelectionOperation[];
  from: string;
  where?: AudienceBuilderNodeShape;
}
