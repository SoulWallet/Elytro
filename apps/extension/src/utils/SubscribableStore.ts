export class SubscribableStore<T> {
  private _state: Readonly<T>;
  private _subscribers: Set<(state: Readonly<T>) => void> = new Set();

  constructor(initialState: T) {
    this._state = initialState;
  }

  get state(): Readonly<T> {
    return { ...this._state };
  }

  public setState(newState: Partial<T>): void {
    this._state = { ...this._state, ...newState };
    this._notifySubscribers();
  }

  private _notifySubscribers(): void {
    this._subscribers.forEach((subscriber) => subscriber(this._state));
  }

  public subscribe(subscriber: (state: Readonly<T>) => void): () => void {
    this._subscribers.add(subscriber);

    return () => {
      this._subscribers.delete(subscriber);
    };
  }

  public unsubscribe(subscriber: (state: Readonly<T>) => void): void {
    this._subscribers.delete(subscriber);
  }
}
