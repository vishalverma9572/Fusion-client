import React, { useEffect, useState } from "react";
import InboxTable from "../../components/tables/InboxTable";
import { get_leave_inbox } from "../../../../routes/hr/index"; // Ensure this is the correct import path
import LoadingComponent from "../../components/Loading"; // Ensure this is the correct import path

function LeaveInbox() {
  const [inboxData, setInboxData] = useState([]); // Correct useState syntax
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchLeaveInbox = async () => {
      console.log("Fetching leave inbox...");
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(get_leave_inbox, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await response.json();
        setInboxData(data.leave_inbox); // Set fetched data
        setLoading(false); // Set loading to false once data is fetched
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch leave inbox:", error);
        setLoading(false); // Set loading to false if there’s an error
      }
    };
    fetchLeaveInbox(); // Ensure function is called
  }, []); // Adding empty dependency array to run only once

  if (loading) {
    return <LoadingComponent loadingMsg="Fetching Leave Inbox..." />;
  }

  return <InboxTable title="Leave Inbox" data={inboxData} formType="leave" />;
}

export default LeaveInbox;
