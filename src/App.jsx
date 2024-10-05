import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "./components/layout.jsx";
import Dashboard from "./Modules/Dashboard/dashboardNotifications.jsx";
import Profile from "./Modules/Profile/profile.jsx";
import LoginPage from "./pages/login.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";
import AcademicPage from "./Modules/Academic/index.jsx";

export default function App() {
  return (
    <MantineProvider>
      <Routes>
      <Route path="/" element={<Navigate to="/accounts/login" replace />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/academics"
          element={
            <Layout>
              <AcademicPage />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route path="/accounts/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
      </Routes>
    </MantineProvider>
  );
}
