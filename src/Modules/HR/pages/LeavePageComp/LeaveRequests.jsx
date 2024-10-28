import React, { useEffect, useState } from "react";
import RequestsTable from "../../components/tables/RequestsTable";
import { get_leave_requests } from "../../../../routes/hr/index"; // Ensure this is the correct import path

function LeaveRequests() {
  const [requestData, setRequestData] = useState([]); // Correct useState syntax

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
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch leave requests:", error);
      }
    };

    fetchLeaveRequests(); // Ensure function is called
  }, []); // Adding empty dependency array to run only once

  return <RequestsTable title="Leave Requests" data={requestData} />;
}

export default LeaveRequests;
