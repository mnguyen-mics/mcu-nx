
export type Index<T>= { [key: string]: T};

export interface OrganisationIdProp {
 organisationId: string;
}

export function getOrElse<T>(t: T | undefined, _default: T): T {
    return t ? t : _default;
}
import {
  PaginationSearchSettings,
  KeywordSearchSettings,
  DatamartSearchSettings,
  TypeSearchSettings,
} from './LocationSearchHelper';
export interface SearchFilter
  extends PaginationSearchSettings,
    KeywordSearchSettings,
    TypeSearchSettings,
    DatamartSearchSettings {}

export interface SelectableItem {
  id: string;
}
