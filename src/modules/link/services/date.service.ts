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

  getDateRanges(): Date[] {
    const dates = this.getDates();
    const dateRanges = [
      dates.tomorrow,
      dates.today,
      dates.yesterday,
      dates.lastWeek,
      dates.lastMonth,
      dates.lastYear,
    ];
    return dateRanges;
  }

  calculateDateCountWithPrevCounts(datesCounts: number[]) {
    let acc = 0;
    const transformedDateCounts = datesCounts.map((dateCount) => {
      const dateCountWithPrevDateCount =
        dateCount !== 0 ? dateCount + acc : dateCount;
      acc += dateCount;
      return dateCountWithPrevDateCount;
    });
    return transformedDateCounts;
  }

  createDateObjectByValueAndFilter(dateCount: number[]) {
    const dateName: DateName[] = [
      'today',
      'yesterday',
      'lastWeek',
      'lastMonth',
      'lastYear',
    ];
    const filteredDateRange = [];
    for (let i = 0; i < dateName.length; i++) {
      const count = dateCount[i];
      if (count !== 0) {
        filteredDateRange.push({
          value: dateName[i],
          count: count,
        });
      }
    }
    return filteredDateRange;
  }

  private getDateWithOffset(offset: number): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return date;
  }
}
