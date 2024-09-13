import Breadcrumbs from "../../components/Breadcrumbs";
import RecentTabs from "../../components/Tabs";
import DashBoardNotifications from "./dashboardNotifications.jsx";

const Dashboard = () => {
  return (
    <>
      <Breadcrumbs />
      <RecentTabs />
      <DashBoardNotifications />
    </>
  );
};

export default Dashboard;
