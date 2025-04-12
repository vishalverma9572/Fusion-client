import React, { useState, useEffect } from "react";
import { Modal, Button, ScrollArea, Loader } from "@mantine/core";
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
          paddingRight: "20px",
        }}
      >
        <Button
          onClick={() => setOpened(true)}
          leftIcon={<ListChecks size={20} weight="bold" />}
          sx={(theme) => ({
            backgroundColor: "#2b6cb0",
            color: "#ffffff",
            fontWeight: 600,
            padding: "8px 16px",
            borderRadius: "6px",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#1e4a82",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 6px rgba(43, 108, 176, 0.2)",
              // Reset to original color when not hovering
              "@media (hover: none)": {
                backgroundColor: "#2b6cb0",
              },
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: "none",
            },
          })}
        >
          Show Leave Balance
        </Button>
      </div>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <span
            style={{
              fontWeight: 600,
              fontSize: "20px",
              color: "#1a365d",
              paddingBottom: "10px",
              display: "block",
            }}
          >
            Leave Balance Details
          </span>
        }
        centered
        size="lg"
        styles={{
          modal: {
            borderRadius: "12px",
            padding: "20px",
            backgroundColor: "#f8fafc",
          },
          header: {
            marginBottom: "10px",
          },
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <Loader size="lg" variant="dots" />
          </div>
        ) : error ? (
          <div
            style={{
              color: "#e53e3e",
              backgroundColor: "#fed7d7",
              padding: "12px",
              borderRadius: "6px",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        ) : leaveBalance ? (
          <ScrollArea style={{ height: "400px" }}>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  backgroundColor: "white",
                }}
              >
                <thead>
                  <tr>
                    {["Leave Type", "Allotted", "Taken", "Balance"].map(
                      (header, index) => (
                        <th
                          key={header}
                          style={{
                            padding: "14px 12px",
                            backgroundColor: "#2b6cb0",
                            color: "#ffffff",
                            fontSize: "13px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.4px",
                            borderBottom: "2px solid #2c5282",
                            borderRight: "1px solid #4a90e2",
                            textAlign: index === 0 ? "left" : "center", // Center align for numeric columns
                            paddingLeft: index === 0 ? "24px" : "12px",
                          }}
                        >
                          {header}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(leaveBalance).map(([key, value], index) => (
                    <tr
                      key={key}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#f7fafc",
                        transition: "all 0.2s ease",
                        ":hover": {
                          backgroundColor: "#ebf8ff",
                        },
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 12px 12px 24px",
                          color: "#1a365d",
                          fontSize: "14px",
                          fontWeight: 600,
                          borderBottom: "1px solid #e2e8f0",
                          borderRight: "1px solid #e2e8f0",
                          textAlign: "left",
                        }}
                      >
                        {key.replace(/_/g, " ").toUpperCase()}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "#1a365d",
                          fontSize: "14px",
                          borderBottom: "1px solid #e2e8f0",
                          borderRight: "1px solid #e2e8f0",
                          textAlign: "center", // Center alignment
                        }}
                      >
                        {value.allotted}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "#1a365d",
                          fontSize: "14px",
                          borderBottom: "1px solid #e2e8f0",
                          borderRight: "1px solid #e2e8f0",
                          textAlign: "center", // Center alignment
                        }}
                      >
                        {value.taken}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          fontWeight: 700,
                          fontSize: "14px",
                          borderBottom: "1px solid #e2e8f0",
                          textAlign: "center", // Center alignment
                          color: value.balance <= 0 ? "#e53e3e" : "#3182ce",
                        }}
                      >
                        {value.balance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        ) : (
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: 600,
              color: "#718096",
            }}
          >
            No leave balance data available
          </div>
        )}
      </Modal>
    </>
  );
};

export default LeaveBalanceButton;
