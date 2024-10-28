import React, { useEffect, useState } from "react";
import RequestsTable from "../../components/tables/RequestsTable";
import { get_leave_requests } from "../../../../routes/hr/index"; // Ensure this is the correct import path
import LoadingComponent from "../../components/Loading"; // Ensure this is the correct import path

function LeaveRequests() {
  const [requestData, setRequestData] = useState([]); // Correct useState syntax
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      console.log("Fetching leave requests...");
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }
      try {
        const response = await fetch(get_leave_requests, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await response.json();
        setRequestData(data.leave_requests); // Set fetched data
        setLoading(false); // Set loading to false once data is fetched
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch leave requests:", error);
        setLoading(false); // Set loading to false if there’s an error
      }
    };
    fetchLeaveRequests(); // Ensure function is called
  }, []); // Adding empty dependency array to run only once

  if (loading) {
    return <LoadingComponent loadingMsg="Fetching Leave Requests..." />;
  }

  return <RequestsTable title="Leave Requests" data={requestData} />;
}

export default LeaveRequests;
