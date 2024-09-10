import DashBoardBreadcrumbs from "../../components/dashboardHeadBreadcrumbs";
import RecentTabs from "../../components/recentTabs";
import SortOptions from "../../components/sortOptions";
import DashboardContentArea from "../../components/dashboardContentArea";

const Dashboard = () => {
  return (
    <>
      <DashBoardBreadcrumbs />
      <RecentTabs />
      <SortOptions />
      <DashboardContentArea />
    </>
  );
};

export default Dashboard;
