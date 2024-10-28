import React, { useEffect, useState } from "react";
import { get_leave_archive } from "../../../../routes/hr"; // Ensure the import path is correct
import ArchiveTable from "../../components/tables/ArchiveTable"; // Ensure the import path is correct

function LeaveArchive() {
  const [archiveData, setArchiveData] = useState([]); // Correct useState syntax

  useEffect(() => {
    const fetchLeaveArchive = async () => {
      console.log("Fetching leave archive...");
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      try {
        const response = await fetch(get_leave_archive, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await response.json();
        setArchiveData(data.leave_archive); // Set fetched data
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch leave archive:", error);
      }
    };

    fetchLeaveArchive(); // Ensure function is called
  }, []); // Add dependency array to run only once

  return <ArchiveTable title="Leave Archive" data={archiveData} />;
}

export default LeaveArchive;
