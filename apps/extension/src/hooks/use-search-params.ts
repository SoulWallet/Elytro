import { useMemo } from 'react';
import { useSearch } from 'wouter/use-browser-location';

export default function useSearchParams() {
  const searchStr = useSearch();

  const paramsObj = useMemo(() => {
    const searchParams = new URLSearchParams(searchStr);

    return Object.fromEntries(searchParams.entries());
  }, [searchStr]);

  return paramsObj;
}
