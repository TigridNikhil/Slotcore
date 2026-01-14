import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";
import App from "./App.jsx";
import { ToasterNotification } from "./utils/toastmessage";

export const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <Provider store={store}>
      <ToasterNotification />
      <App />
    </Provider>
  </StrictMode>
);
