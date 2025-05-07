import React from "react";
import ReactDOM from "react-dom/client";
import { AppRouter } from "./router/router";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ModalProvider } from "./context/ModalContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ModalProvider>
          <AppRouter />
          <Toaster />
        </ModalProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
