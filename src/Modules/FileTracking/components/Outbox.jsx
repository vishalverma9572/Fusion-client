import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Title,
  Table,
  ActionIcon,
  Tooltip,
  Select,
  Textarea,
  Button,
  Group,
  TextInput,
} from "@mantine/core";
import { Eye } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import axios from "axios";
import View from "./ViewFile";
import {
  forwardFileRoute,
  outboxRoute,
  designationsRoute,
  createFileRoute,
} from "../../../routes/filetrackingRoutes";

export default function Outboxfunc() {
  const [files, setFiles] = useState([]);
  const token = localStorage.getItem("authToken");
  const role = useSelector((state) => state.user.role);
  const username = useSelector((state) => state.user.roll_no);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  let current_module = useSelector((state) => state.module.current_module);
  current_module = current_module.split(" ").join("").toLowerCase();
  const convertDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  };
  const [receiver_username, setReceiverUsername] = React.useState("");
  const [receiver_designation, setReceiverDesignation] = React.useState("");
  const [receiver_designations, setReceiverDesignations] = React.useState("");
  const [selectedFile, setSelectedFile] = useState(null); // For viewing file details
  const [forwardFile, setForwardFile] = useState(null); // For forwarding file

  const [remarks, setRemarks] = useState(""); // State for remarks
  const receiverRoles = Array.isArray(receiver_designations)
    ? receiver_designations.map((receiver_role) => ({
        value: receiver_role,
        label: receiver_role,
      }))
    : [];
  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await axios.get(
          `${outboxRoute}`,

          {
            params: {
              username,
              designation: role,
              src_module: current_module,
            },
            withCredentials: true,
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
        // Set the response data to the files state
        setFiles(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    // Call the getFiles function to fetch data on component mount
    getFiles();
  }, []);
  const fetchRoles = async () => {
    const response = await axios.get(
      `${designationsRoute}${receiver_username}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
    setReceiverDesignations(response.data.designations);
  };
  const handleBack = () => {
    setSelectedFile(null);
    setForwardFile(null); // Reset forward file state
  };

  const sortedFiles = [...files].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? direction : -direction;
  });

  const filteredFiles = sortedFiles.filter(
    (file) =>
      file.uploader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.id.toString().includes(searchQuery) ||
      file.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      convertDate(file.upload_date).includes(searchQuery),
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSubmitForward = async () => {
    try {
      let response = await axios.get(`${createFileRoute}${forwardFile.id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setForwardFile(response.data);
      const fileAttachment =
        forwardFile.upload_file instanceof File
          ? forwardFile.upload_file
          : new File([forwardFile.upload_file], "uploaded_file", {
              type: "application/octet-stream",
            });

      console.log(forwardFile.upload_file);
      const formData = new FormData();
      formData.append("file_attachment", fileAttachment);
      console.log(receiver_username);
      formData.append("receiver", receiver_username);
      formData.append("receiver_designation", receiver_designation);
      formData.append("remarks", remarks);
      console.log(formData);
      console.log(forwardFile.id);
      response = await axios.post(
        `${forwardFileRoute}${forwardFile.id}/`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      // Reset form and state
      setForwardFile(null);
      setReceiverDesignation(""); // Reset designation
      setReceiverUsername("");
      setRemarks("");
    } catch (err) {
      console.error("Error forwarding file:", err);
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        backgroundColor: "#F5F7F8",
        position: "absolute",
        height: "70vh",
        width: "90vw",
        overflowY: "auto",
      }}
    >
      {!selectedFile && !forwardFile && (
        <Group position="apart" mb="md">
          <Title
            order={2}
            mb="md"
            style={{
              fontSize: "24px",
            }}
          >
            Outbox
          </Title>
          <TextInput
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: "10px", marginLeft: "auto" }}
          />
        </Group>
      )}

      {selectedFile ? (
        <div>
          <Title
            order={3}
            mb="md"
            style={{
              fontSize: "26px",
            }}
          >
            File Subject
          </Title>
          <View
            onBack={handleBack}
            fileID={selectedFile.id}
            updateFiles={() =>
              setFiles(files.filter((f) => f.id !== selectedFile.id))
            }
          />
        </div>
      ) : forwardFile ? (
        <div
          style={{
            margin: "1rem",
            padding: "1rem",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title order={3} mb="md">
            Forward File
          </Title>
          <Box>
            {/* Step 1: Select the recipient's designation */}
            <TextInput
              label="Forward To"
              placeholder="Enter forward recipient"
              value={receiver_username}
              onChange={(e) => {
                setReceiverUsername(e.target.value);
              }}
              mb="sm"
            />
            {/* Receiver Designation as a dropdown */}
            <Select
              label="Receiver Designation"
              placeholder="Select designation"
              onClick={() => fetchRoles()}
              value={receiver_designation}
              data={receiverRoles}
              mb="sm"
              onChange={(value) => setReceiverDesignation(value)}
            />

            {/* Remarks Textarea */}
            <Textarea
              label="Remarks"
              placeholder="Add any remarks here"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              mt="md"
              style={{ height: "100px" }}
            />

            {/* Forward and Cancel Buttons */}
            <Group position="right" mt="md">
              <Button
                variant="light"
                color="blue"
                onClick={handleSubmitForward}
              >
                Forward File
              </Button>
              <Button variant="subtle" color="gray" onClick={handleBack}>
                Cancel
              </Button>
            </Group>
          </Box>
        </div>
      ) : (
        <Box
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflowY: "auto",
            height: "56vh",
            backgroundColor: "#fff",
          }}
        >
          <Table
            highlightOnHover
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#0000" }}>
                <th onClick={() => handleSort("id")}>
                  File ID{" "}
                  {sortConfig.key === "id" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("subject")}>
                  Subject{" "}
                  {sortConfig.key === "subject" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("upload_date")}>
                  Date{" "}
                  {sortConfig.key === "upload_date" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  style={{
                    padding: "12px",
                    width: "8.5%",
                    border: "1px solid #ddd",
                  }}
                >
                  View File
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file, index) => (
                <tr key={index}>
                  {/* <td
                    style={{
                      padding: "8px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                    }}
                  >
                    <Tooltip label="Forward" position="top" withArrow>
                      <ActionIcon
                        variant="light"
                        color="blue"
                        style={{
                          transition: "background-color 0.3s",
                          width: "2rem",
                          height: "2rem",
                        }}
                        onClick={() => handleForwardFile(file)} // Set the file to forward
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#ffebee";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                        }}
                      >
                        <ArrowArcRight size="1rem" />
                      </ActionIcon>
                    </Tooltip>
                  </td> */}

                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {file.branch}-{new Date(file.upload_date).getFullYear()}-
                    {(new Date(file.upload_date).getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}
                    -#{file.id}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {file.subject}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {convertDate(file.upload_date)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                    }}
                  >
                    <Tooltip label="View File" position="top" withArrow>
                      <ActionIcon
                        variant="light"
                        color="black"
                        style={{
                          transition: "background-color 0.3s",
                          width: "2rem",
                          height: "2rem",
                        }}
                        onClick={() => setSelectedFile(file)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#E3F2FD";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                        }}
                      >
                        <Eye size="1rem" />
                      </ActionIcon>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      )}
    </Card>
  );
}
