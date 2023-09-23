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
