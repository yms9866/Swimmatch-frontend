import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "./App.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import { SavedProvidersProvider } from "./context/SavedProvidersContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProfileProvider>
      <SavedProvidersProvider>
        <RouterProvider router={router} />
      </SavedProvidersProvider>
    </ProfileProvider>
  </React.StrictMode>
);
