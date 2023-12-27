import { Identity } from '../common/Identity';

export class ProductId extends Identity {
  constructor(key: string) {
    super(key);
  }

  equals(other: ProductId): boolean {
    if (this === other) return true;
    if (other === null || other === undefined) return false;
    return this.key === other.key;
  }
}
