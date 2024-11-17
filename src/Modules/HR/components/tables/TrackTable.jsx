import React from "react";
import { Title, Container, Paper, Table, Flex } from "@mantine/core";
import { EmptyTable } from "./EmptyTable";

const TrackTable = ({ title, data, exampleItems }) => {
  const headers = [
    "Record Id",
    "Receive Date",
    "Forward Date",
    "Remarks",
    "Current Id",
    "Current Designation",
    "Receiver Id",
    "Receive Designation",
  ];

  const renderRows = () =>
    data.map((item, index) => (
      <Table.Tr key={index}>
        <Table.Td align="center">{item.id}</Table.Td>
        <Table.Td align="center">
          {item.receive_date && (
            <>
              {item.receive_date.split("T")[0]}
              <br />
              {item.receive_date.split("T")[1].split(".")[0]}
            </>
          )}
        </Table.Td>
        <Table.Td align="center">
          {item.forward_date && (
            <>
              {item.forward_date.split("T")[0]}
              <br />
              {item.forward_date.split("T")[1].split(".")[0]}
            </>
          )}
        </Table.Td>
        <Table.Td align="center">{item.remarks}</Table.Td>
        <Table.Td align="center">{item.current_id}</Table.Td>
        <Table.Td align="center">{item.current_design}</Table.Td>
        <Table.Td align="center">{item.receiver_id}</Table.Td>
        <Table.Td align="center">{item.receive_design}</Table.Td>
      </Table.Tr>
    ));

  const renderHeaders = () =>
    headers.map((header, index) => (
      <Table.Th key={index}>
        <Flex align="center" justify="center">
          {header}
        </Flex>
      </Table.Th>
    ));

  return (
    <Container size="lg" mt={30} style={{ maxWidth: "90rem" }} miw="80rem">
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
          <Table
            striped
            highlightOnHover
            withBorder
            withColumnBorders
            style={{ width: "100%" }}
          >
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

export default TrackTable;
