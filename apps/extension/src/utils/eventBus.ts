/**
 * Global Single Instance Event Bus
 * Please Note: ONLY used in background runtime
 */
type EventListener = (...args: SafeAny[]) => void;

class EventBus {
  private events: { [key: string]: Array<EventListener> } = {};

  constructor() {}

  /**
   * Add an event listener to the event bus.
   * @param event - The event name.
   * @param listener - The event listener.
   */
  on(event: string, listener: EventListener): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  /**
   * Remove an event listener from the event bus.
   * @param event - The event name.
   * @param listener - The event listener.
   */
  off(event: string, listener: EventListener): void {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter((l) => l !== listener);
  }

  /**
   * Emit an event with the given arguments.
   * @param event - The event name.
   * @param args - The event arguments.
   */
  emit(event: string, ...args: SafeAny[]): void {
    if (!this.events[event]) return;

    this.events[event].forEach((listener) => listener(...args));
  }

  /**
   * Add a one-time event listener to the event bus.
   * @param event - The event name.
   * @param listener - The event listener.
   */
  once(event: string, listener: EventListener): void {
    const onceListener = (...args: SafeAny[]) => {
      listener(...args);
      this.off(event, onceListener);
    };
    this.on(event, onceListener);
  }

  /**
   * Clear all listeners for a specific event.
   * @param event - The event name.
   */
  clear(event: string): void {
    if (!this.events[event]) return;
    this.events[event] = [];
  }
}

export default new EventBus();
