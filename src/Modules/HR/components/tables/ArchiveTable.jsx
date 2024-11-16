import React from "react";
import {
  Title,
  Container,
  Paper,
  Table,
  Button,
  Flex,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Eye, MapPin } from "@phosphor-icons/react";
import "./Table.css";
import { EmptyTable } from "./EmptyTable";

const ArchiveTable = ({ title, data, formType = undefined }) => {
  const navigate = useNavigate();

  const headers = ["FileID", "User", "Designation", "Date", "View", "Track"];

  const handleViewClick = (id) => {
    const viewUrlMap = {
      leave: `/hr/leave/file_handler/${id}?archive=true`,
      cpda_adv: `/hr/cpda_adv/file_handler/${id}?archive=true`,
      ltc: `/hr/ltc/file_handler/${id}?archive=true`,
      cpda_claim: `/hr/cpda_claim/file_handler/${id}?archive=true`,
      appraisal: `/hr/appraisal/file_handler/${id}?archive=true`,
    };

    navigate(viewUrlMap[formType]);
  };

  const handleTrackClick = (id) => {
    const trackUrlMap = {
      leave: `/hr/FormView/leaveform_track/${id}`,
      cpda_adv: `/hr/FormView/cpda_adv_track/${id}`,
      ltc: `/hr/FormView/ltc_track/${id}`,
      cpda_claim: `/hr/FormView/cpda_claim_track/${id}`,
      appraisal: `/hr/FormView/appraisal_track/${id}`,
    };

    navigate(trackUrlMap[formType]);
  };

  // Render table rows
  const renderRows = () =>
    data.map((item, index) => (
      <Table.Tr key={index}>
        <Table.Td align="center">{item.id}</Table.Td>
        <Table.Td align="center">{item.uploader}</Table.Td>
        <Table.Td align="center">{item.designation}</Table.Td>
        <Table.Td align="center">{item.upload_date}</Table.Td>
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
        <Table.Td align="center">
          <Button
            onClick={() => handleTrackClick(item.id)}
            variant="outline"
            color="green"
            size="xs"
            leftIcon={<MapPin size={16} />}
          >
            Track
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
            title="No new Archive requests found!"
            message="There is no new Archive request available. Please check back later."
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

export default ArchiveTable;
