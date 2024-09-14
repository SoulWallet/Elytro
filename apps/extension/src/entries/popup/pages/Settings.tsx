import { navigateTo } from "@/utils/navigation";
import React from "react";

const Settings: React.FC = () => {
  return (
    <div
      onClick={() => {
        navigateTo("tab", "create");
      }}
    >
      Settings
    </div>
  );
};

export default Settings;
