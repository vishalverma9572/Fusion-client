import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout.jsx";
import Dashboard from "./Modules/Dashboard/dashboardContent.jsx";
import LoginPage from "./pages/login.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";

export default function App() {
  return (
    <MantineProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route path="/accounts/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
      </Routes>
    </MantineProvider>
  );
}
