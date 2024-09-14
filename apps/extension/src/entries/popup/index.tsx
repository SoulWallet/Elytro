import React from "react";
import ReactDOM from "react-dom/client";
import Router from "@/components/Router";
import routes from "./routes";

const PopupApp: React.FC = () => {
  return <Router routes={routes} />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>,
);
