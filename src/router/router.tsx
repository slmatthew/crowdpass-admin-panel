import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import EventsPage from "../pages/Events/EventsPage";
import TicketsPage from "../pages/TicketsPage";
import BookingsPage from "../pages/BookingsPage";
import LayoutDashboard from "../layouts/LayoutDashboard";
import VkCallbackPage from "../pages/Login/VkCallbackPage";
import TelegramCallbackPage from "../pages/Login/TelegramCallbackPage";
import AccessRoute from "./AccessRoute";
import LogsPage from "@/pages/LogsPage";
import CreateEventPage from "@/pages/Events/CreateEventPage";
import EditEventPage from "@/pages/Events/EditEventPage";
import CategoriesPage from "@/pages/CategoriesPage";
import UsersPage from "@/pages/UsersPage";
import OrganizersPage from "@/pages/OrganizersPage";
import OrganizerPage from "@/pages/OrganizerPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AccessRoute requireAuth={false}><LoginPage /></AccessRoute>} />
        <Route path="/login/vkCallback" element={<AccessRoute requireAuth={false}><VkCallbackPage /></AccessRoute>} />
        <Route path="/login/telegram" element={<AccessRoute requireAuth={false}><TelegramCallbackPage /></AccessRoute>} />

        <Route
          element={
            <AccessRoute>
              <LayoutDashboard />
            </AccessRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/create" element={<CreateEventPage />} />
          <Route path="/events/:id/edit" element={<EditEventPage />} />
          
          <Route path="/organizers" element={<OrganizersPage />} />
          <Route path="/organizers/me" element={<OrganizerPage />} />
          <Route path="/organizers/:id" element={<OrganizerPage />} />

          <Route path="/users" element={<UsersPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/logs" element={<LogsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
