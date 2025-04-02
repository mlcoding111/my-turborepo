// Every service should extend this class

import { ObjectLiteral, Repository, FindOptionsWhere } from 'typeorm';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  filter?: Record<string, any>;
}

export interface PaginatedResult<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export class PaginationResult<T> implements PaginatedResult<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    _isPaginated: boolean;
  };

  constructor(
    data: T[],
    metadata: Omit<PaginatedResult<T>['metadata'], '_isPaginated'>,
  ) {
    this.data = data;
    this.metadata = {
      ...metadata,
      _isPaginated: true,
    };
  }
}

export class PaginationService<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  /**
   * Paginate results from the repository
   * @param options Pagination options including page, limit, sorting, and filtering
   * @returns Paginated result with data and metadata
   */
  async paginate(options: PaginationOptions = {}): Promise<PaginatedResult<T>> {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = 'DESC',
      filter = {},
    } = options;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build query options
    const queryOptions: any = {
      skip,
      take: limit,
      where: filter as FindOptionsWhere<T>,
    };

    // Add optional sorting
    if (sortBy) {
      queryOptions.order = { [sortBy]: sortOrder };
    }

    // Get data and count in parallel for efficiency
    const [data, total] = await Promise.all([
      this.repository.find(queryOptions),
      this.repository.count({ where: filter as FindOptionsWhere<T> }),
    ]);

    // Calculate metadata
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      metadata: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}
