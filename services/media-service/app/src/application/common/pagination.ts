export interface Pagination {
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: Pagination;
}

export function buildPagination(total: number, page: number, limit: number): Pagination {
  return { total, currentPage: page, limit, totalPages: Math.ceil(total / limit) };
}
