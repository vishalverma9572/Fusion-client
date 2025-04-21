import React, { useState, useEffect } from "react";
import { Modal, Button, ScrollArea, Loader, ActionIcon } from "@mantine/core";
import { ListChecks, CaretUp, CaretDown } from "@phosphor-icons/react";
import { get_leave_balance } from "../../../../routes/hr";

function LeaveBalanceButton() {
  const [opened, setOpened] = useState(false);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [sortedBalance, setSortedBalance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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
      setLeaveBalance(data.leave_balance);
      setSortedBalance(Object.entries(data.leave_balance));
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

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...Object.entries(leaveBalance)].sort((a, b) => {
      if (key === "leave_type") {
        const nameA = a[0].toLowerCase();
        const nameB = b[0].toLowerCase();
        return direction === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }

      const valA = a[1][key];
      const valB = b[1][key];
      return direction === "asc" ? valA - valB : valB - valA;
    });

    setSortConfig({ key, direction });
    setSortedBalance(sorted);
  };

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey)
      return <CaretUp size={14} opacity={0.3} />;
    return sortConfig.direction === "asc" ? (
      <CaretUp size={14} />
    ) : (
      <CaretDown size={14} />
    );
  };

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
            <div className="form-table-container" style={{ margin: "0 auto" }}>
              <table className="form-table">
                <thead>
                  <tr>
                    <th className="table-header">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        Leave Type
                        <ActionIcon
                          variant="subtle"
                          onClick={() => sortData("leave_type")}
                          ml={5}
                        >
                          {renderSortIcon("leave_type")}
                        </ActionIcon>
                      </div>
                    </th>
                    <th className="table-header">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        Allotted
                        <ActionIcon
                          variant="subtle"
                          onClick={() => sortData("allotted")}
                          ml={5}
                        >
                          {renderSortIcon("allotted")}
                        </ActionIcon>
                      </div>
                    </th>
                    <th className="table-header">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        Taken
                        <ActionIcon
                          variant="subtle"
                          onClick={() => sortData("taken")}
                          ml={5}
                        >
                          {renderSortIcon("taken")}
                        </ActionIcon>
                      </div>
                    </th>
                    <th className="table-header">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        Balance
                        <ActionIcon
                          variant="subtle"
                          onClick={() => sortData("balance")}
                          ml={5}
                        >
                          {renderSortIcon("balance")}
                        </ActionIcon>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBalance.map(([key, value]) => (
                    <tr
                      className="table-row"
                      key={key}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ textTransform: "capitalize" }}>
                        {key.replace(/_/g, " ")}
                      </td>
                      <td>{value.allotted}</td>
                      <td>{value.taken}</td>
                      <td
                        style={{
                          fontWeight: "bold",
                          color: value.balance <= 0 ? "red" : "green",
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
          <div style={{ textAlign: "center", fontWeight: "bold" }}>
            No leave balance data available.
          </div>
        )}
      </Modal>
    </>
  );
}

export default LeaveBalanceButton;
