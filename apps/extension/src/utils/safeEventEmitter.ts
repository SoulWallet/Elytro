import { EventEmitter } from 'events';

export class SafeEventEmitter extends EventEmitter {
  emit(eventName: string | symbol, ...args: unknown[]): boolean {
    try {
      return super.emit(eventName, ...args);
    } catch (error) {
      console.error(`Error occurred while emitting event: ${error}`);
      return false;
    }
  }

  on(eventName: string | symbol, listener: (...args: unknown[]) => void): this {
    const wrappedListener = (...args: unknown[]) => {
      try {
        return listener(...args);
      } catch (error) {
        console.error(
          `Error occurred while executing event listener: ${error}`
        );
      }
    };
    return super.on(eventName, wrappedListener);
  }
}
