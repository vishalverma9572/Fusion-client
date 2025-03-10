import React, { useState } from "react";
import { Select } from "@mantine/core";

const SearchAndSelectUser = ({ onUserSelect }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const apiUrl = "http://127.0.0.1:8000/hr2/api/search_employees/";
  const token = localStorage.getItem("authToken");

  const fetchUsers = async (searchText) => {
    // Trigger search only if at least 4 characters are entered
    if (searchText.length < 4) {
      setSearchResults([]); // Clear previous results
      return;
    }

    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}?search_text=${searchText}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      const data = await response.json();

      // Use id, username, and designation to create a unique identifier
      const formattedResults = data.employees.map((employee) => ({
        value: `${employee.id}-${employee.username}-${employee.designation}`, // Unique identifier
        label: `${employee.username} (${employee.designation})`,
        details: employee,
      }));

      console.log(formattedResults);
      setSearchResults(formattedResults);
    } catch (err) {
      setError("Unable to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelection = (selectedValue) => {
    const user = searchResults.find((result) => result.value === selectedValue);
    setSelectedUser(user?.details || null);

    // Pass selected user to the parent via the callback
    if (onUserSelect && user?.details) {
      onUserSelect(user.details);
    }
  };

  return (
    <div style={{ maxWidth: "400px", marginBottom: "20px" }}>
      <Select
        label="Search and Select User"
        placeholder="Type to search"
        searchable
        nothingFound={error || "No users found"}
        data={searchResults}
        onSearchChange={fetchUsers}
        onChange={handleUserSelection}
        disabled={loading}
      />
    </div>
  );
};

export default SearchAndSelectUser;
