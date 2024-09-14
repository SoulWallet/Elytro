import Router from "@/components/Router";
import React from "react";
import routes from "./routes";
import { createRoot } from "react-dom/client";

const TabApp: React.FC = () => {
  return <div>Tab</div>;
};

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<TabApp />);
