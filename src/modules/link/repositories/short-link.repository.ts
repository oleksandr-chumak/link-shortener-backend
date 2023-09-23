import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { ShortLinkEntity } from '../entities/short-link.entity';
import { GetFilterDto, GetLinksDto } from '../dto';
import { FieldEnum, FilterType } from '../types/filter.types';

@Injectable()
export class ShortLinkRepository extends Repository<ShortLinkEntity> {
  constructor(private dataSource: DataSource) {
    super(ShortLinkEntity, dataSource.createEntityManager());
  }

  getLinksAndCount(
    userId: string,
    query: GetLinksDto,
  ): Promise<[ShortLinkEntity[], number]> {
    const { take: takeValue = 0, skip: skipValue = 0, ...filterQuery } = query;
    const queryBuilder = this.createBaseQueryBuilder(userId)
      .select(['short_link', 'original_link', 'link_status'])
      .take(takeValue)
      .skip(skipValue);

    this.applyFilters(queryBuilder, filterQuery);

    return queryBuilder.getManyAndCount();
  }

  getStatistics(userId: string, query: GetFilterDto) {
    const queryBuilder = this.createBaseQueryBuilder(userId).select([
      'MIN(short_link.clicks) as min_clicks',
      'MAX(short_link.clicks) as max_clicks',
    ]);

    this.applyFilters(queryBuilder, query);

    return queryBuilder.getRawOne();
  }

  getStatuses(userId: string, query: GetFilterDto): Promise<any[]> {
    const queryBuilder = this.createBaseQueryBuilder(userId)
      .select(['link_status.type as value', 'COUNT(link_status.type) as count'])
      .groupBy('link_status.type');

    this.applyFilters(queryBuilder, query);

    return queryBuilder.getRawMany();
  }

  getHosts(userId: string, query: Omit<GetFilterDto, 'host'>) {
    const queryBuilder = this.createBaseQueryBuilder(userId)
      .select('original_link.host', 'value')
      .addSelect('COUNT(original_link.host)', 'count')
      .groupBy('original_link.host')
      .orderBy('count', 'DESC')
      .addOrderBy('host', 'ASC');

    this.applyFilters(queryBuilder, query);
    return queryBuilder.getRawMany();
  }

  async getDate(userId: string, query: Omit<GetFilterDto, 'date'>) {
    const { tomorrow, today, yesterday, lastWeek, lastMonth, lastYear } =
      this.calculateFutureDates();

    const dateRanges = [today, yesterday, lastWeek, lastMonth, lastYear];

    console.log(dateRanges);

    const dateCountQuery = dateRanges.map((date, index, array) => {
      const queryBuilder = this.createBaseQueryBuilder(userId);
      return this.getCountForDate(
        queryBuilder,
        date,
        array[index - 1] || tomorrow,
      );
    });

    const dateCounts = await Promise.all(dateCountQuery);

    const transformedDateCounts =
      this.calculateDateCountWithPrevCounts(dateCounts);
    return {
      today: transformedDateCounts[0],
      yesterday: transformedDateCounts[1],
      lastWeek: transformedDateCounts[2],
      lastMonth: transformedDateCounts[3],
      lastYear: transformedDateCounts[4],
    };
  }

  private getCountForDate(
    queryBuilder: SelectQueryBuilder<ShortLinkEntity>,
    date: Date,
    prevDate: Date,
  ): Promise<number> {
    return queryBuilder
      .andWhere(
        `short_link.createdAt >= :date AND short_link.createdAt < :prevDate`,
        {
          date: date,
          prevDate: prevDate,
        },
      )
      .getCount();
  }

  private createBaseQueryBuilder(
    userId: string,
  ): SelectQueryBuilder<ShortLinkEntity> {
    return this.createQueryBuilder('short_link')
      .innerJoin('short_link.originalLink', 'original_link')
      .innerJoin('short_link.status', 'link_status')
      .where('short_link.userId = :userId', {
        userId: userId,
      });
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<ShortLinkEntity>,
    query: GetFilterDto,
  ) {
    const { host, clicks, status, date } = query;

    this.applyFilter(queryBuilder, FieldEnum.HOST, 'in', host);
    this.applyFilter(queryBuilder, FieldEnum.CLICKS, 'between', clicks);
    this.applyFilter(queryBuilder, FieldEnum.STATUS, 'in', status);
    this.applyFilter(queryBuilder, FieldEnum.DATE, 'between', date);
  }

  private applyFilter<T extends keyof GetFilterDto>(
    queryBuilder: SelectQueryBuilder<ShortLinkEntity>,
    field: FieldEnum,
    type: FilterType,
    values?: GetFilterDto[T],
  ) {
    if (!values) {
      return;
    }
    if (type === 'between' && Array.isArray(values) === true) {
      const [min, max] = values;
      queryBuilder.andWhere(
        `${field} BETWEEN :min${field} AND :max${field}`, // Уникальные имена параметров
        {
          [`min${field}`]: min,
          [`max${field}`]: max,
        },
      );
    }
    if (type === 'in') {
      queryBuilder.andWhere(`${field} IN(:values${field})`, {
        [`values${field}`]: values,
      });
    }
  }

  private calculateDateCountWithPrevCounts(datesCounts: number[]) {
    let acc = 0;
    const transformedDateCounts = datesCounts.map((dateCount) => {
      const dateCountWithPrevDateCount =
        dateCount !== 0 ? dateCount + acc : dateCount;
      acc += dateCount;
      return dateCountWithPrevDateCount;
    });
    return transformedDateCounts;
  }

  private calculateFutureDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);

    return {
      tomorrow,
      today,
      yesterday,
      lastWeek,
      lastMonth,
      lastYear,
    };
  }
}
