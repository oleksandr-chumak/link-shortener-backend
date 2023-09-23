import { Injectable } from '@nestjs/common';
import { DateName, DateRecord } from '../types';

@Injectable()
export class DateService {
  getDateByName(name: DateName): Date {
    const dateRecord = this.getDates();
    return dateRecord[name];
  }

  getDates(): DateRecord {
    const days: DateRecord = {
      tomorrow: this.getDateWithOffset(1),
      today: this.getDateWithOffset(0),
      yesterday: this.getDateWithOffset(-1),
      lastWeek: this.getDateWithOffset(-7),
      lastMonth: this.getDateWithOffset(0),
      lastYear: this.getDateWithOffset(0),
    };

    days.lastMonth.setMonth(days.lastMonth.getMonth() - 1);
    days.lastYear.setFullYear(days.lastYear.getFullYear() - 1);

    return days;
  }

  private getDateWithOffset(offset: number): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return date;
  }
}
