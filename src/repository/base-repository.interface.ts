// src/core/interfaces/base.repository.ts
import { DeleteResult, UpdateResult } from 'typeorm';

export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  findByCriteria(criteria: Partial<T>): Promise<T[]>;
  create(entity: Partial<T>): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T>;
  delete(id: number): Promise<DeleteResult>;
  softDelete(id: number): Promise<UpdateResult>;
  restore(id: number): Promise<UpdateResult>;
  count(criteria?: Partial<T>): Promise<number>;
}