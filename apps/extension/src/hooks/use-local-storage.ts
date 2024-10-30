import { useState, useEffect, useCallback } from 'react';
import { localStorage } from '@/utils/storage/local';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    const loadInitialValue = async () => {
      try {
        const result = await localStorage.get<T>([key]);
        if (result[key] !== undefined) {
          setStoredValue(result[key]);
        } else {
          await localStorage.save({ [key]: initialValue });
        }
      } catch (error) {
        console.error('Error loading from storage:', error);
      }
    };

    loadInitialValue();
  }, [key, initialValue]);

  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        await localStorage.save({ [key]: valueToStore });
      } catch (error) {
        console.error('Error saving to storage:', error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(async () => {
    try {
      await localStorage.remove([key]);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

export { useLocalStorage };
