import React from "react";
import {
  Title,
  Container,
  Paper,
  Button,
  Flex,
  Table,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Eye } from "@phosphor-icons/react";
import "./Table.css";
import { EmptyTable } from "./EmptyTable";

const RequestsTable = ({ title, data }) => {
  const navigate = useNavigate();
  const headers = ["ID", "Name", "Designation", "Submission Date", "View"];

  const handleViewClick = (view) => {
    navigate(`./view/${view}`);
  };

  // Render table rows
  const renderRows = () =>
    data.map((item, index) => (
      <Table.Tr key={index}>
        <Table.Td align="center">{item.id}</Table.Td>
        <Table.Td align="center">{item.name}</Table.Td>
        <Table.Td align="center">{item.designation}</Table.Td>
        <Table.Td align="center">{item.submissionDate}</Table.Td>
        <Table.Td align="center">
          <Button
            onClick={() => handleViewClick(item.id)}
            variant="outline"
            color="blue"
            size="xs"
            leftIcon={<Eye size={16} />}
          >
            View
          </Button>
        </Table.Td>
      </Table.Tr>
    ));

  // Render table headers
  const renderHeaders = () =>
    headers.map((header, index) => (
      <Table.Th key={index}>
        <Flex align="center" justify="center">
          {header}
        </Flex>
      </Table.Th>
    ));

  return (
    <Container size="lg" mt={30} miw="80rem">
      <Paper shadow="md" radius="md" p="lg" withBorder>
        <Title order={2} align="center" mb="lg" c="#1c7ed6">
          {title}
        </Title>

        {data.length === 0 ? (
          <EmptyTable
            title="No new requests found!"
            message="There is no new request available. Please check back later."
          />
        ) : (
          <Table striped highlightOnHover withBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>{renderHeaders()}</Table.Tr>
            </Table.Thead>
            <Table.Tbody>{renderRows()}</Table.Tbody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default RequestsTable;
