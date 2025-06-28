// src/service/user.service.ts (o cualquier servicio genérico)

import { PaginatedResult } from '../infrastructure/interfaces/pagination.interface';

export async function getPaginated<T>(
  repo: { getPaginated: (limit: number, offset: number) => Promise<T[]>; count: (filter: object) => Promise<number> },
  page: number,
  itemsPerPage: number
): Promise<PaginatedResult<T>> {
  const offset = page * itemsPerPage;
  const limit = itemsPerPage;

  const [items, totalCount] = await Promise.all([
    repo.getPaginated(limit, offset),
    repo.count({ deleted: false }),
  ]);

  return {
    response: items,
    pagination: {
      currentPage: page+ 1,
      itemsPerPage: itemsPerPage,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / itemsPerPage),
      hasNextPage: (page + 1) * itemsPerPage < totalCount,
      hasPreviousPage: page > 0,
    },
  };
}
