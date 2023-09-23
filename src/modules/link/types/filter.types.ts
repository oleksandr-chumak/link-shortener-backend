export type FilterType = 'between' | 'in';

export enum FieldEnum {
  DATE = 'short_link.createdAt',
  HOST = 'original_link.host',
  STATUS = 'link_status.type',
  CLICKS = 'short_link.clicks',
}

export interface QueryFilter {
  host?: string | string[];
  clicks?: number[];
  status?: string | string[];
  date?: Date[];
}

export type FilterFieldType = 'in' | 'between';

export type FilterFieldsTypes = Record<keyof QueryFilter, FilterFieldType>;

export enum FilterRule {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
}

export interface Filtering {
  property: string;
  rule: string;
  value: string;
}
