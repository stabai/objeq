/**
 * Stores unique values of any object type.
 * 
 * Value equality of two objects is determined by their `JSON.stringify` representations.
 */
export class ObjectSet<T> implements Set<T> {
  private readonly hashMap = new Map<string, T>();

  add(value: T): this {
    this.hashMap.set(JSON.stringify(value), value);
    return this;
  }
  clear(): void {
    this.hashMap.clear();
  }
  delete(value: T): boolean {
    return this.hashMap.delete(JSON.stringify(value));
  }
  forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: unknown): void {
    this.hashMap.forEach(value => callbackfn(value, value, this), thisArg);
  }
  has(value: T): boolean {
    return this.hashMap.has(JSON.stringify(value));
  }
  get size(): number {
    return this.hashMap.size;
  }
  entries(): IterableIterator<[T, T]> {
    return new SelfEntryIterator(this.hashMap.values());
  }
  keys(): IterableIterator<T> {
    return this.hashMap.values();
  }
  values(): IterableIterator<T> {
    return this.hashMap.values();
  }
  [Symbol.iterator](): IterableIterator<T> {
    return this.hashMap.values();
  }
  toString(): string {
    return JSON.stringify(this);
  }
  toJSON(): unknown {
    const arrayCopy = [];
    for (const value of this.hashMap.values()) {
      arrayCopy.push(value);
    }
    return arrayCopy;
  }
  readonly [Symbol.toStringTag]: string = 'ObjectSet';
}

class SelfEntryIterator<T> implements IterableIterator<[T, T]> {
  constructor(private readonly backingIterator: IterableIterator<T>) { }

  [Symbol.iterator](): IterableIterator<[T, T]> {
    return this;
  }
  next(...args: [] | [undefined]): IteratorResult<[T, T], unknown> {
    const result = this.backingIterator.next(...args);
    const convertedValue = (result.value == null) ? result.value : [result.value, result.value];
    return { done: result.done, value: convertedValue };
  }
}
