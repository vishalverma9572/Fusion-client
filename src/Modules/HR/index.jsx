import React from "react";
import LeaveForm from "./pages/leaveForm";
import { MantineProvider } from '@mantine/core';
export default function HR() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div>
        <h1>HR Module</h1>
        <LeaveForm />
      </div>
    </MantineProvider>
  );
}
