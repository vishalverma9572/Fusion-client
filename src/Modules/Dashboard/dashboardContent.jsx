import DashBoardBreadcrumbs from "../../components/dashboardHeadBreadcrumbs";
import RecentTabs from "../../components/recentTabs";
import DashboardContentArea from "../../components/dashboardContentArea";

const Dashboard = () => {
  return (
    <>
      <DashBoardBreadcrumbs />
      <RecentTabs />
      <DashboardContentArea />
    </>
  );
};

export default Dashboard;
