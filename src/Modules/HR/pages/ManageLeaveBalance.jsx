// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Title,
//   Card,
//   Text,
//   Divider,
//   Loader,
//   Table,
// } from "@mantine/core";
// import SearchAndSelectUser from "../components/SearchAndSelectUser";
// // import SearchAndSelectUser from "../components/FormComponent/SearchAndSelectUser";

// const ManageLeaveBalance = () => {
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [leaveData, setLeaveData] = useState(null);
//   const [leaveLoading, setLeaveLoading] = useState(false);
//   const [leaveError, setLeaveError] = useState(null);

//   // Called when an employee is selected via the search component
//   const handleUserSelect = (employee) => {
//     setSelectedEmployee(employee);
//     setLeaveData(null); // Clear previous data when a new employee is selected.
//   };

//   // Fetch leave balance data from the API endpoint.
//   const fetchLeaveBalance = async (empid) => {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       setLeaveError("Authentication token is missing.");
//       return;
//     }

//     setLeaveLoading(true);
//     setLeaveError(null);

//     try {
//       const response = await fetch(`http://127.0.0.1:8000/hr2/api/admin_get_leave_balance/${empid}/`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to fetch leave balance data");
//       }

//       const data = await response.json();
//       setLeaveData(data.leave_balance);
//     } catch (err) {
//       setLeaveError(err.message);
//     } finally {
//       setLeaveLoading(false);
//     }
//   };

//   // Call the API when an employee is selected.
//   useEffect(() => {
//     if (selectedEmployee && selectedEmployee.id) {
//       fetchLeaveBalance(selectedEmployee.id);
//     }
//   }, [selectedEmployee]);

//   // Define leave types and corresponding keys from the API response.
//   const leaveTypes = [
//     {
//       type: "Casual Leave",
//       allotted: "casual_leave_allotted",
//       taken: "casual_leave_taken",
//     },
//     {
//       type: "Vacation Leave",
//       allotted: "vacation_leave_allotted",
//       taken: "vacation_leave_taken",
//     },
//     {
//       type: "Earned Leave",
//       allotted: "earned_leave_allotted",
//       taken: "earned_leave_taken",
//     },
//     {
//       type: "Commuted Leave",
//       allotted: "commuted_leave_allotted",
//       taken: "commuted_leave_taken",
//     },
//     {
//       type: "Special Casual Leave",
//       allotted: "special_casual_leave_allotted",
//       taken: "special_casual_leave_taken",
//     },
//     {
//       type: "Restricted Holiday",
//       allotted: "restricted_holiday_allotted",
//       taken: "restricted_holiday_taken",
//     },
//   ];

//   return (
//     <Container size="lg" py="xl">
//       <Title order={2} mb="lg">
//         Manage Leave Balance
//       </Title>

//       {/* Employee search component */}
//       <SearchAndSelectUser onUserSelect={handleUserSelect} />

//       {/* Display leave balance details once an employee is selected */}
//       {selectedEmployee && (
//         <Card withBorder shadow="sm" p="lg" mt="xl">
//           <Title order={4} mb="sm">
//             Leave Balance for {selectedEmployee.username} (
//             {selectedEmployee.designation})
//           </Title>
//           <Divider my="sm" />

//           {leaveLoading ? (
//             <Loader />
//           ) : leaveError ? (
//             <Text color="red">{leaveError}</Text>
//           ) : leaveData ? (
//             <Table striped highlightOnHover withBorder withColumnBorders>
//               <thead style={{ backgroundColor: "#f0f0f0" }}>
//                 <tr>
//                   <th style={{ textAlign: "left", padding: "12px" }}>
//                     Leave Type
//                   </th>
//                   <th style={{ textAlign: "center", padding: "12px" }}>
//                     Allotted
//                   </th>
//                   <th style={{ textAlign: "center", padding: "12px" }}>
//                     Taken
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {leaveTypes.map((item, index) => (
//                   <tr key={index}>
//                     <td style={{ textAlign: "left", padding: "12px" }}>
//                       {item.type}
//                     </td>
//                     <td style={{ textAlign: "center", padding: "12px" }}>
//                       {leaveData[item.allotted]}
//                     </td>
//                     <td style={{ textAlign: "center", padding: "12px" }}>
//                       {leaveData[item.taken]}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           ) : (
//             <Text>
//               Search for an employee and select to see their leave balance details.
//             </Text>
//           )}
//         </Card>
//       )}
//     </Container>
//   );
// };

// export default ManageLeaveBalance;

// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Title,
//   Card,
//   Text,
//   Divider,
//   Loader,
//   Table,
//   TextInput,
//   Select,
// } from "@mantine/core";

// const ManageEmployeeList = () => {
//   const [allEmployees, setAllEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [departmentFilter, setDepartmentFilter] = useState("All");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch all employees on component mount
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Authentication token is missing.");
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch("http://127.0.0.1:8000/hr2/api/hr_employees/", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || "Failed to fetch employee data");
//         }

//         const data = await response.json();
//         // Expecting data to be an array of objects:
//         // { id, name, username, designation, department }
//         setAllEmployees(data);
//         setFilteredEmployees(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   // Compute unique department options for filtering.
//   // Employees with a null department will not be included in the dropdown.
//   const departmentOptions = Array.from(
//     new Set(
//       allEmployees
//         .map((emp) => emp.department)
//         .filter((dept) => dept && dept.trim() !== "")
//     )
//   ).sort();

//   // Handle changes for search input.
//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   // Handle changes for department filter select.
//   const handleDepartmentChange = (value) => {
//     setDepartmentFilter(value);
//   };

//   // Filter the employees based on the search query and the department filter.
//   useEffect(() => {
//     let filtered = allEmployees;

//     if (searchQuery.trim()) {
//       filtered = filtered.filter(
//         (emp) =>
//           emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           emp.username.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (departmentFilter !== "All") {
//       filtered = filtered.filter((emp) => emp.department === departmentFilter);
//     }

//     setFilteredEmployees(filtered);
//   }, [searchQuery, departmentFilter, allEmployees]);

//   return (
//     <Container size="lg" py="xl">
//       <Title order={2} mb="lg">
//         Employees List
//       </Title>

//       {/* Search and Filter Card */}
//       <Card withBorder shadow="sm" p="lg" mb="xl">
//         <TextInput
//           placeholder="Search by name or username"
//           label="Search Employees"
//           value={searchQuery}
//           onChange={handleSearchChange}
//           mb="md"
//         />

//         <Select
//           label="Filter by Department"
//           placeholder="Select Department"
//           data={["All", ...departmentOptions]}
//           value={departmentFilter}
//           onChange={handleDepartmentChange}
//         />
//       </Card>

//       <Divider mb="xl" />

//       {/* Employees Table */}
//       {loading ? (
//         <Loader />
//       ) : error ? (
//         <Text color="red">{error}</Text>
//       ) : filteredEmployees.length ? (
//         <Table striped highlightOnHover withBorder withColumnBorders>
//           <thead style={{ backgroundColor: "#f0f0f0" }}>
//             <tr>
//               <th style={{ textAlign: "left", padding: "12px" }}>ID</th>
//               <th style={{ textAlign: "left", padding: "12px" }}>Name</th>
//               <th style={{ textAlign: "left", padding: "12px" }}>Username</th>
//               <th style={{ textAlign: "left", padding: "12px" }}>Designation</th>
//               <th style={{ textAlign: "left", padding: "12px" }}>Department</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEmployees.map((emp, index) => (
//               <tr key={index}>
//                 <td style={{ textAlign: "left", padding: "12px" }}>{emp.id}</td>
//                 <td style={{ textAlign: "left", padding: "12px" }}>{emp.name}</td>
//                 <td style={{ textAlign: "left", padding: "12px" }}>{emp.username}</td>
//                 <td style={{ textAlign: "left", padding: "12px" }}>{emp.designation}</td>
//                 <td style={{ textAlign: "left", padding: "12px" }}>
//                   {emp.department || "N/A"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       ) : (
//         <Text>No employees found.</Text>
//       )}
//     </Container>
//   );
// };

// export default ManageEmployeeList;

// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Title,
//   Card,
//   Text,
//   Divider,
//   Loader,
//   Table,
//   TextInput,
//   Select,
//   Flex,
// } from "@mantine/core";

// const ManageEmployeeList = () => {
//   const [allEmployees, setAllEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [departmentFilter, setDepartmentFilter] = useState("All");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Define leave types along with their abbreviations and full names.
//   const leaveTypes = [
//     { key: "casual_leave", abbrev: "CL", fullName: "Casual Leave" },
//     { key: "vacation_leave", abbrev: "VL", fullName: "Vacation Leave" },
//     { key: "earned_leave", abbrev: "EL", fullName: "Earned Leave" },
//     { key: "commuted_leave", abbrev: "COL", fullName: "Commuted Leave" },
//     {
//       key: "special_casual_leave",
//       abbrev: "SCL",
//       fullName: "Special Casual Leave",
//     },
//     { key: "restricted_holiday", abbrev: "RH", fullName: "Restricted Holiday" },
//   ];

//   // Fetch employee details and leave balance details then merge them.
//   useEffect(() => {
//     const fetchEmployeesAndLeaveData = async () => {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Authentication token is missing.");
//         return;
//       }
//       setLoading(true);
//       try {
//         // Fetch employee details – these should include department, name, username, etc.
//         const empResponse = await fetch(
//           "http://127.0.0.1:8000/hr2/api/hr_employees/",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Token ${token}`,
//             },
//           },
//         );
//         if (!empResponse.ok) {
//           const errorData = await empResponse.json();
//           throw new Error(
//             errorData.error || "Failed to fetch employee details",
//           );
//         }
//         const employeeData = await empResponse.json();
//         // Assume employeeData is an array of objects:
//         // [{ id, name, username, department, ... }, ...]

//         // Fetch consolidated leave balance details
//         const leaveResponse = await fetch(
//           "http://127.0.0.1:8000/hr2/api/admin_get_all_leave_balances/",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Token ${token}`,
//             },
//           },
//         );
//         if (!leaveResponse.ok) {
//           const errorData = await leaveResponse.json();
//           throw new Error(errorData.error || "Failed to fetch leave details");
//         }
//         const leaveData = await leaveResponse.json();
//         // Expecting a structure: { leave_balances: [ { employee_id, casual_leave_allotted, ..., restricted_holiday_taken }, ... ] }
//         const leaveBalances = leaveData.leave_balances;

//         // Merge employee details with leave balance details by matching the employee ID.
//         const mergedData = employeeData.map((emp) => {
//           // Find leave record for this employee
//           const leaveInfo = leaveBalances.find(
//             (lb) => String(lb.employee_id) === String(emp.id),
//           );
//           return { ...emp, ...(leaveInfo || {}) };
//         });

//         setAllEmployees(mergedData);
//         setFilteredEmployees(mergedData);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployeesAndLeaveData();
//   }, []);

//   // Compute unique department options if available.
//   const departmentOptions = Array.from(
//     new Set(
//       allEmployees
//         .map((emp) => emp.department)
//         .filter((dept) => dept && dept.trim() !== ""),
//     ),
//   ).sort();

//   // Handle search and department filter changes.
//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const handleDepartmentChange = (value) => {
//     setDepartmentFilter(value);
//   };

//   // Apply filtering based on search query and selected department.
//   useEffect(() => {
//     let filtered = allEmployees;
//     if (searchQuery.trim()) {
//       filtered = filtered.filter(
//         (emp) =>
//           emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           emp.username.toLowerCase().includes(searchQuery.toLowerCase()),
//       );
//     }
//     if (departmentFilter !== "All") {
//       filtered = filtered.filter((emp) => emp.department === departmentFilter);
//     }
//     setFilteredEmployees(filtered);
//   }, [searchQuery, departmentFilter, allEmployees]);

//   // Standard table cell styling.
//   const headerCellStyle = {
//     padding: "8px",
//     border: "1px solid #ccc",
//     textAlign: "left",
//     backgroundColor: "#e9ecef",
//     fontWeight: "bold",
//   };

//   const cellStyle = {
//     padding: "8px",
//     border: "1px solid #ccc",
//     textAlign: "left",
//   };

//   // Abbreviation table styles for smaller text.
//   const abbrHeaderCellStyle = {
//     padding: "4px 8px",
//     border: "1px solid #ccc",
//     textAlign: "left",
//     backgroundColor: "#e9ecef",
//     fontWeight: "bold",
//     fontSize: "0.75rem",
//   };

//   const abbrCellStyle = {
//     padding: "4px 8px",
//     border: "1px solid #ccc",
//     textAlign: "left",
//     fontSize: "0.75rem",
//   };

//   return (
//     <Container size="lg" py="xl">
//       <Title order={2} mb="lg">
//         Employees List with Leave Details
//       </Title>

//       {/* Top Section: Search/Filter Panel & Abbreviation Chart */}
//       <Flex gap="md" wrap="nowrap" mb="xl" style={{ alignItems: "stretch" }}>
//         {/* Search/Filter Panel */}
//         <Card withBorder shadow="sm" p="lg" style={{ flex: 1 }}>
//           {/* Wrap content in a div that fills the height */}
//           <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
//             <TextInput
//               placeholder="Search by name or username"
//               label="Search Employees"
//               value={searchQuery}
//               onChange={handleSearchChange}
//               mb="md"
//             />
//             <Select
//               label="Filter by Department"
//               placeholder="Select Department"
//               data={["All", ...departmentOptions]}
//               value={departmentFilter}
//               onChange={handleDepartmentChange}
//             />
//           </div>
//         </Card>

//         {/* Abbreviation Table */}
//         <Card withBorder shadow="sm" p="lg" style={{ flex: 1 }}>
//           <Title order={5} mb="sm" style={{ fontSize: "1rem" }}>
//             Leave Type Abbreviations
//           </Title>
//           <Table fontSize="xs">
//             <thead>
//               <tr>
//                 <th style={abbrHeaderCellStyle}>Leave Type</th>
//                 <th style={abbrHeaderCellStyle}>Allotted</th>
//                 <th style={abbrHeaderCellStyle}>Taken</th>
//               </tr>
//             </thead>
//             <tbody>
//               {leaveTypes.map((leave) => (
//                 <tr key={leave.key}>
//                   <td style={abbrCellStyle}>{leave.fullName}</td>
//                   <td style={abbrCellStyle}>{`${leave.abbrev} A`}</td>
//                   <td style={abbrCellStyle}>{`${leave.abbrev} T`}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card>
//       </Flex>

//       <Divider mb="xl" />

//       {/* Main Employee List Table */}
//       {loading ? (
//         <Loader />
//       ) : error ? (
//         <Text color="red">{error}</Text>
//       ) : filteredEmployees.length ? (
//         <div className="striped-table-container" style={{ overflowX: "auto" }}>
//           <style>{`
//             .striped-table-container table tbody tr:nth-child(odd) {
//               background-color: #f7f7f7 !important;
//             }
//             .striped-table-container table tbody tr:nth-child(even) {
//               background-color: #ffffff !important;
//             }
//             .striped-table-container table tbody tr:hover {
//               background-color: #f1f3f5 !important;
//             }
//           `}</style>
//           <Table
//             striped
//             highlightOnHover
//             horizontalSpacing="md"
//             verticalSpacing="md"
//           >
//             <thead>
//               <tr>
//                 <th style={headerCellStyle}>#</th>
//                 <th style={headerCellStyle}>ID</th>
//                 <th style={headerCellStyle}>Name</th>
//                 <th style={headerCellStyle}>Username</th>
//                 <th style={headerCellStyle}>Department</th>
//                 {leaveTypes.map((leave) => (
//                   <React.Fragment key={leave.key}>
//                     <th style={headerCellStyle}>{leave.abbrev} A</th>
//                     <th style={headerCellStyle}>{leave.abbrev} T</th>
//                   </React.Fragment>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredEmployees.map((emp, index) => (
//                 <tr key={emp.id}>
//                   <td style={cellStyle}>{index + 1}</td>
//                   <td style={cellStyle}>{emp.id}</td>
//                   <td style={cellStyle}>{emp.name}</td>
//                   <td style={cellStyle}>{emp.username}</td>
//                   <td style={cellStyle}>{emp.department || "N/A"}</td>
//                   {leaveTypes.map((leave) => {
//                     const allottedKey = `${leave.key}_allotted`;
//                     const takenKey = `${leave.key}_taken`;
//                     return (
//                       <React.Fragment key={leave.key}>
//                         <td style={cellStyle}>
//                           {emp[allottedKey] !== undefined
//                             ? emp[allottedKey]
//                             : "-"}
//                         </td>
//                         <td style={cellStyle}>
//                           {emp[takenKey] !== undefined ? emp[takenKey] : "-"}
//                         </td>
//                       </React.Fragment>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       ) : (
//         <Text>No employees found.</Text>
//       )}
//     </Container>
//   );
// };

// export default ManageEmployeeList;

import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  Card,
  Text,
  Divider,
  Loader,
  Table,
  TextInput,
  Select,
  Flex,
} from "@mantine/core";

const ManageEmployeeList = () => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define leave types along with their abbreviations and full names.
  const leaveTypes = [
    { key: "casual_leave", abbrev: "CL", fullName: "Casual Leave" },
    { key: "vacation_leave", abbrev: "VL", fullName: "Vacation Leave" },
    { key: "earned_leave", abbrev: "EL", fullName: "Earned Leave" },
    { key: "commuted_leave", abbrev: "COL", fullName: "Commuted Leave" },
    {
      key: "special_casual_leave",
      abbrev: "SCL",
      fullName: "Special Casual Leave",
    },
    { key: "restricted_holiday", abbrev: "RH", fullName: "Restricted Holiday" },
  ];

  // Fetch employee/leave details from one optimized API call.
  useEffect(() => {
    const fetchEmployeesAndLeaveData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token is missing.");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/hr2/api/admin_get_all_leave_balances/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          },
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch leave details");
        }
        const data = await response.json();
        // data.leave_balances is an array of objects with leave and department info.
        // Transform keys to match what the UI expects.
        const mergedData = data.leave_balances.map((emp) => {
          const { employee_id, employee_username, employee_fullname, ...rest } =
            emp;
          return {
            id: employee_id,
            username: employee_username,
            name: employee_fullname,
            ...rest,
          };
        });

        setAllEmployees(mergedData);
        setFilteredEmployees(mergedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeesAndLeaveData();
  }, []);

  // Compute unique department options if available.
  const departmentOptions = Array.from(
    new Set(
      allEmployees
        .map((emp) => emp.department)
        .filter((dept) => dept && dept.trim() !== ""),
    ),
  ).sort();

  // Handle search and department filter changes.
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDepartmentChange = (value) => {
    setDepartmentFilter(value);
  };

  // Apply filtering based on search query and selected department.
  useEffect(() => {
    let filtered = allEmployees;
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.username.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (departmentFilter !== "All") {
      filtered = filtered.filter((emp) => emp.department === departmentFilter);
    }
    setFilteredEmployees(filtered);
  }, [searchQuery, departmentFilter, allEmployees]);

  // Standard table cell styling.
  const headerCellStyle = {
    padding: "8px",
    border: "1px solid #ccc",
    textAlign: "left",
    backgroundColor: "#e9ecef",
    fontWeight: "bold",
  };

  const cellStyle = {
    padding: "8px",
    border: "1px solid #ccc",
    textAlign: "left",
  };

  // Abbreviation table styles for smaller text.
  const abbrHeaderCellStyle = {
    padding: "4px 8px",
    border: "1px solid #ccc",
    textAlign: "left",
    backgroundColor: "#e9ecef",
    fontWeight: "bold",
    fontSize: "0.75rem",
  };

  const abbrCellStyle = {
    padding: "4px 8px",
    border: "1px solid #ccc",
    textAlign: "left",
    fontSize: "0.75rem",
  };

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">
        Employees List with Leave Details
      </Title>

      {/* Top Section: Search/Filter Panel & Abbreviation Chart */}
      <Flex gap="md" wrap="nowrap" mb="xl" style={{ alignItems: "stretch" }}>
        {/* Search/Filter Panel */}
        <Card withBorder shadow="sm" p="lg" style={{ flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <TextInput
              placeholder="Search by name or username"
              label="Search Employees"
              value={searchQuery}
              onChange={handleSearchChange}
              mb="md"
            />
            <Select
              label="Filter by Department"
              placeholder="Select Department"
              data={["All", ...departmentOptions]}
              value={departmentFilter}
              onChange={handleDepartmentChange}
            />
          </div>
        </Card>

        {/* Abbreviation Table */}
        <Card withBorder shadow="sm" p="lg" style={{ flex: 1 }}>
          <Title order={5} mb="sm" style={{ fontSize: "1rem" }}>
            Leave Type Abbreviations
          </Title>
          <Table fontSize="xs">
            <thead>
              <tr>
                <th style={abbrHeaderCellStyle}>Leave Type</th>
                <th style={abbrHeaderCellStyle}>Allotted</th>
                <th style={abbrHeaderCellStyle}>Taken</th>
              </tr>
            </thead>
            <tbody>
              {leaveTypes.map((leave) => (
                <tr key={leave.key}>
                  <td style={abbrCellStyle}>{leave.fullName}</td>
                  <td style={abbrCellStyle}>{`${leave.abbrev} A`}</td>
                  <td style={abbrCellStyle}>{`${leave.abbrev} T`}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Flex>

      <Divider mb="xl" />

      {/* Main Employee List Table */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Text color="red">{error}</Text>
      ) : filteredEmployees.length ? (
        <div className="striped-table-container" style={{ overflowX: "auto" }}>
          <style>{`
            .striped-table-container table tbody tr:nth-child(odd) {
              background-color: #f7f7f7 !important;
            }
            .striped-table-container table tbody tr:nth-child(even) {
              background-color: #ffffff !important;
            }
            .striped-table-container table tbody tr:hover {
              background-color: #f1f3f5 !important;
            }
          `}</style>
          <Table
            striped
            highlightOnHover
            horizontalSpacing="md"
            verticalSpacing="md"
          >
            <thead>
              <tr>
                <th style={headerCellStyle}>#</th>
                <th style={headerCellStyle}>ID</th>
                <th style={headerCellStyle}>Name</th>
                <th style={headerCellStyle}>Username</th>
                <th style={headerCellStyle}>Department</th>
                {leaveTypes.map((leave) => (
                  <React.Fragment key={leave.key}>
                    <th style={headerCellStyle}>{leave.abbrev} A</th>
                    <th style={headerCellStyle}>{leave.abbrev} T</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, index) => (
                <tr key={emp.id}>
                  <td style={cellStyle}>{index + 1}</td>
                  <td style={cellStyle}>{emp.id}</td>
                  <td style={cellStyle}>{emp.name}</td>
                  <td style={cellStyle}>{emp.username}</td>
                  <td style={cellStyle}>{emp.department || "N/A"}</td>
                  {leaveTypes.map((leave) => {
                    const allottedKey = `${leave.key}_allotted`;
                    const takenKey = `${leave.key}_taken`;
                    return (
                      <React.Fragment key={leave.key}>
                        <td style={cellStyle}>
                          {emp[allottedKey] !== undefined
                            ? emp[allottedKey]
                            : "-"}
                        </td>
                        <td style={cellStyle}>
                          {emp[takenKey] !== undefined ? emp[takenKey] : "-"}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Text>No employees found.</Text>
      )}
    </Container>
  );
};

export default ManageEmployeeList;
