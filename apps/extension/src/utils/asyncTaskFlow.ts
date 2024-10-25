import compose from 'koa-compose';

type ContextType = Record<string, SafeAny>;
type FlowTask<T extends ContextType = ContextType, U = SafeAny> = (
  ctx: T,
  next: () => U
) => U;

export type TFlowMiddleWareFn<T extends ContextType = ContextType> = FlowTask<
  T,
  SafeAny
>;

export default class AsyncTaskFlow<T extends ContextType = ContextType> {
  private _tasks: FlowTask<T>[] = [];
  private _context: ContextType = {};
  public requestedApproval = false;

  use(fn: FlowTask<T>): this {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function to handle the promise');
    }
    this._tasks.push(fn);
    return this;
  }

  compose() {
    return compose(this._tasks);
  }
}
