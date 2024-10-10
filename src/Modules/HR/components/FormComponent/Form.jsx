import React, { useEffect, useState } from "react";
import FormTable from "./FormTable";
import { fetchData } from "./dataFetcher";
import "./FormTable.css";

const Form = () => {
  const [headers, setHeaders] = useState([]);
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const { headers, formData } = await fetchData();
      setHeaders(headers);
      setFormData(formData);
    };

    loadData();
  }, []);

  return (
    <div className="app-container">
      <h1 className="table-title">Form </h1>
      {headers.length > 0 && formData.length > 0 ? (
        <FormTable headers={headers} data={formData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Form;
