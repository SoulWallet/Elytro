import { useState, useEffect, useCallback } from "react";

export const useHashLocation = (): [string, (to: string) => void] => {
  const [loc, setLoc] = useState(() => window.location.hash.slice(1) || "/");

  useEffect(() => {
    const handler = () => setLoc(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
  }, []);

  return [loc, navigate];
};
