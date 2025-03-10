import React, { useState, useEffect } from "react";
import { Modal, Button, Table, ScrollArea, Loader } from "@mantine/core";
import { ListChecks } from "@phosphor-icons/react";
import { get_leave_balance } from "../../../../routes/hr";

const LeaveBalanceButton = () => {
  const [opened, setOpened] = useState(false);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaveBalance = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No authentication token found!");
      setError("Authentication token is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(get_leave_balance, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Error fetching leave balance: ${response.statusText}`);
      }

      const data = await response.json();
      setLeaveBalance(data.leave_balance); // Extract 'leave_balance' object from response
    } catch (err) {
      console.error(err.message);
      setError("Failed to fetch leave balance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (opened) {
      fetchLeaveBalance();
    }
  }, [opened]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "-50px",
          position: "relative",
          top: "50px",
        }}
      >
        <Button
          onClick={() => setOpened(true)}
          leftIcon={<ListChecks size={20} />}
        >
          Show Leave Balance
        </Button>
      </div>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <span style={{ fontWeight: "bold", fontSize: "20px" }}>
            Leave Balance
          </span>
        }
        centered
        size="lg"
        styles={{
          modal: { height: "500px", padding: "20px" },
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div
            style={{ color: "red", textAlign: "center", fontWeight: "bold" }}
          >
            {error}
          </div>
        ) : leaveBalance ? (
          <ScrollArea>
            <Table striped highlightOnHover withBorder withColumnBorders>
              <thead style={{ backgroundColor: "#f5f5f5" }}>
                <tr>
                  <th style={{ fontWeight: "bold" }}>Leave Type</th>
                  <th style={{ fontWeight: "bold" }}>Allotted</th>
                  <th style={{ fontWeight: "bold" }}>Taken</th>
                  <th style={{ fontWeight: "bold" }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(leaveBalance).map(([key, value], index) => (
                  <tr
                    key={key}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                      height: "50px",
                    }}
                  >
                    <td
                      style={{
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {key.replace(/_/g, " ")}
                    </td>
                    <td>{value.allotted}</td>
                    <td>{value.taken}</td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: value.balance === 0 ? "red" : "green",
                      }}
                    >
                      {value.balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>
        ) : (
          <div style={{ textAlign: "center", fontWeight: "bold" }}>
            No leave balance data available.
          </div>
        )}
      </Modal>
    </>
  );
};

export default LeaveBalanceButton;
