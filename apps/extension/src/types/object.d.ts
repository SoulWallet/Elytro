type Nullable<T> = T | null | undefined;
type SafeAny = any;
type SafeObject = { [key: string]: SafeAny };
