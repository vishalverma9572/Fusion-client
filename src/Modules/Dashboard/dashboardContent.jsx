import { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import Breadcrumbs from "../../components/Breadcrumbs";
import RecentTabs from "../../components/Tabs";
import DashBoardNotifications from "./dashboardNotifications.jsx";
import { dashboardRoute } from "../../helper/api_routes.jsx";

const Dashboard = () => {

  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("authToken");  

      if (token) {
        try {
          const response = await axios.get(dashboardRoute, {
            headers: {
              Authorization: `Token ${token}`, 
            },
          });

          if (response.status === 200) {
            setDashboardData(response.data); 
            console.log("Dashboard Data:", response.data);
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      } else {
        console.error("No authentication token found!");
      }
    };

    fetchDashboardData(); 
  }, []);

  return (
    <>
      <Breadcrumbs />
      <RecentTabs />
      <DashBoardNotifications />
    </>
  );
};

export default Dashboard;
