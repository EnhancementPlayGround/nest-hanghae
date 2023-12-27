/* eslint-disable @typescript-eslint/no-unused-vars */
import { Identity } from '@/domain/common/Identity';

export abstract class EntityMapper<TDomain, TId extends Identity, TEntity> {
  abstract toDomain(entity: TEntity): TDomain;
}
