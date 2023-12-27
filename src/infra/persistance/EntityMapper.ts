import { Identity } from '@/domain/common/Identity';

export abstract class EntityMapper<TDomain, TId extends Identity, TEntity> {
  abstract toDomain(entity: TEntity): TDomain;
  abstract toEntity(domain: TDomain): TEntity;
}
