export type DateName =
  | 'tomorrow'
  | 'today'
  | 'yesterday'
  | 'lastWeek'
  | 'lastMonth'
  | 'lastYear';

export type DateRecord = Record<DateName, Date>;
