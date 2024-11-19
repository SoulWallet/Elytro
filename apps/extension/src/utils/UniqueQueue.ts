class UniqueQueue<T> {
  private _items: Set<T>;
  private _itemsInOrder: T[];

  constructor() {
    this._items = new Set<T>();
    this._itemsInOrder = [];
  }

  get items() {
    return [...this._itemsInOrder];
  }

  /**
   * Add an item to the queue if it is not already present.
   * @param item - The item to add to the queue.
   */
  enqueue(item: T): void {
    if (!this._items.has(item)) {
      this._items.add(item);
      this._itemsInOrder.unshift(item); // new item is added to the beginning of the array
    }
  }

  /**
   * Remove and return the first item from the queue.
   * @returns The first item from the queue or undefined if the queue is empty.
   */
  dequeue(): T | undefined {
    const firstItem = this._itemsInOrder.shift();
    if (firstItem !== undefined) {
      this._items.delete(firstItem);
    }
    return firstItem;
  }

  /**
   * Remove and return an item from the queue that matches the given function.
   * @param fn - The function to match the item.
   * @returns The item that matches the function or undefined if no item matches.
   */
  dequeueByFn(fn: (item: T) => boolean): T | undefined {
    const item = this.find(fn);
    if (item) {
      this.dequeue();
    }
    return item;
  }

  /**
   * Return the first item from the queue without removing it.
   * @returns The first item from the queue or undefined if the queue is empty.
   */
  peek(): T | undefined {
    return this._itemsInOrder[0];
  }

  /**
   * Check if the queue is empty.
   * @returns true if the queue is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this._itemsInOrder.length === 0;
  }

  /**
   * Get the number of items in the queue.
   * @returns The number of items in the queue.
   */
  size(): number {
    return this._itemsInOrder.length;
  }

  /**
   * Find an item in the queue.
   * @param item - The item to find.
   * @returns The item if found, undefined otherwise.
   */
  find(fn: (item: T) => boolean): T | undefined {
    return this._itemsInOrder.find(fn);
  }
}

export default UniqueQueue;
