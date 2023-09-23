import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { ShortLinkEntity } from '../entities/short-link.entity';
import { GetFilterDto, GetLinksDto } from '../dto';
import { FieldEnum, FilterType } from '../types';

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

  getCountForDate(
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

  createBaseQueryBuilder(userId: string): SelectQueryBuilder<ShortLinkEntity> {
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
}
