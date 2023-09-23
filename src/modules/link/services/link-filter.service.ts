import { Injectable } from '@nestjs/common';
import { GetFilterDto } from '../dto';
import { ShortLinkRepository } from '../repositories';
import { DateService } from './date.service';

@Injectable()
export class LinkFilterService {
  constructor(
    private shortLinkRepository: ShortLinkRepository,
    private dateService: DateService,
  ) {}

  async getFilters(userId: string, query: GetFilterDto) {
    const [statistics, hosts, statuses, dates] = await Promise.all([
      this.getStatistics(userId, query),
      this.getHosts(userId, query),
      this.getStatuses(userId, query),
      this.getDate(userId, query),
    ]);

    return {
      ...statistics,
      statuses,
      hosts,
      dates,
    };
  }

  private getHosts(userId: string, query: GetFilterDto) {
    const { host: _, ...queryWithoutCurrentFilter } = query;
    return this.shortLinkRepository.getHosts(userId, queryWithoutCurrentFilter);
  }

  private getStatuses(userId: string, query: GetFilterDto) {
    const { status: _, ...queryWithoutCurrentFilter } = query;
    return this.shortLinkRepository.getStatuses(
      userId,
      queryWithoutCurrentFilter,
    );
  }

  private async getDate(userId, query: GetFilterDto) {
    const { date: _, ...queryWithoutCurrentFilter } = query;

    const [tomorrow, ...dateRanges] = this.dateService.getDateRanges();

    const dateCountQuery = dateRanges.map((date, index, array) => {
      const queryBuilder =
        this.shortLinkRepository.createBaseQueryBuilder(userId);
      return this.shortLinkRepository.getCountForDate(
        queryBuilder,
        date,
        array[index - 1] || tomorrow,
      );
    });

    const dateCounts = await Promise.all(dateCountQuery);

    const transformedDatesCounts =
      this.dateService.calculateDateCountWithPrevCounts(dateCounts);

    return this.dateService.createDateObjectByValueAndFilter(
      transformedDatesCounts,
    );
  }

  private async getStatistics(userId: string, query: GetFilterDto) {
    const statistics = await this.shortLinkRepository.getStatistics(
      userId,
      query,
    );

    const result = {};

    if (statistics.max_clicks !== null && statistics.min_clicks !== null) {
      result['clicks'] = [statistics.min_clicks, statistics.max_clicks];
    }

    return result;
  }
}
