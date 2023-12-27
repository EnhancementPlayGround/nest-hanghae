import { ValueObject } from "./ValueObject";

export class Identity implements ValueObject {
    constructor(readonly key: string) {}
  }