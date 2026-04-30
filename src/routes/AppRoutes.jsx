import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Dashboard from "../pages/dashboard/Dashboard";
import Leads from "../pages/leads/Leads";
import LeadEdit from "../pages/leads/LeadEdit";
import Client from "../pages/clients/Client";
import ClientProfile from "../pages/clients/ClientProfile";
import Accounts from "../pages/Accounts";
import Pipeline from "../pages/Pipeline";
import Analytics from "../pages/Analytics";
import Reports from "../pages/Reports";
import Support from "../pages/Support";
import Signout from "../pages/Signout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<MainLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads">
          <Route index element={<Leads />} />
          <Route path=":id" element={<LeadEdit />} />
        </Route>
        <Route path="clients">
          <Route index element={<Client />} />
          <Route path=":id" element={<ClientProfile />} />
        </Route>
        <Route path="accounts" element={<Accounts />} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="support" element={<Support />} />
        <Route path="signout" element={<Signout />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
