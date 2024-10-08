export const safeJsonParse = <T>(json: string, defaultValue?: T) => {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error(error);
    return defaultValue;
  }
};

export const safeJsonStringify = (
  obj: Record<string, any>,
  defaultValue?: string
) => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error(error);
    return defaultValue ?? '';
  }
};
