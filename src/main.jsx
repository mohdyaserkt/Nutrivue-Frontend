import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store } from "./redux//store.js";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import "@fortawesome/fontawesome-free/css/all.min.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Toaster position="top-right" reverseOrder={false} />
    <App />
  </Provider>
);
