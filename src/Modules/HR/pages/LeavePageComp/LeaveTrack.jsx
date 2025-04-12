import React, { useEffect, useState } from "react";
import { get_form_track } from "../../../../routes/hr/index";
import { useParams } from "react-router-dom";
import LoadingComponent from "../../components/Loading";
import TrackTable from "../../components/tables/TrackTable";
import HrBreadcrumbs from "../../components/HrBreadcrumbs";

function LeaveTrack() {
  const { id } = useParams();
  const [trackData, setTrackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const admin = new URLSearchParams(window.location.search).get("admin");
  const [exampleItems, setExampleItems] = useState([]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (admin) {
      setExampleItems([
        { title: "Home", path: "/dashboard" },
        { title: "Human Resources", path: "/hr" },
        { title: "Admin Leave Management", path: "/hr/admin_leave" },
        { title: "Track", path: `${currentPath}?admin=true` },
      ]);
    } else {
      setExampleItems([
        { title: "Home", path: "/dashboard" },
        { title: "Human Resources", path: "/hr" },
        { title: "Leave Management", path: "/hr/leave" },
        { title: "Track", path: currentPath },
      ]);
    }
  }, [admin]);

  useEffect(() => {
    const fetchLeaveTrack = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${get_form_track(id)}`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await response.json();
        setTrackData(data.file_history);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch leave Track:", error);
        setLoading(false);
      }
    };
    fetchLeaveTrack();
  }, [id]);

  if (loading) {
    return <LoadingComponent loadingMsg="Fetching Leave Track..." />;
  }

  return (
    <TrackTable
      title="Leave Track"
      exampleItems={exampleItems}
      data={trackData}
    />
  );
}

export default LeaveTrack;
