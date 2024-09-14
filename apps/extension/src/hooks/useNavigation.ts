import { useCallback } from "react";
import { navigateTo } from "../utils/navigation";

export const useNavigation = () => {
  const navigate = useCallback(
    (target: "tab" | "popup" | "options", path: string) => {
      navigateTo(target, path);
    },
    [],
  );

  return { navigate };
};
