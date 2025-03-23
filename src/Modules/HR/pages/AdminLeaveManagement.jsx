// import React from "react";
// import { Container, SimpleGrid, Title } from "@mantine/core";
// import { ShieldCheck } from "@phosphor-icons/react"; // Using ShieldCheck for consistency
// import PerformanceCard from "../components/FormComponent/PerformanceCard";

// const AdminLeaveManagement = () => {
//   const adminCard = {
//     title: "Manage Leave Balance",
//     description: "Update and review employee leave balances.",
//     icon: ShieldCheck, // You can choose any icon that fits best
//     link: "/hr/admin_leave/manage_leave_balance"
//   };

//   return (
//     <Container size="lg" py="xl">
//       <Title order={2} mb="xl">
//         Admin Leave Management
//       </Title>
//       <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
//         <PerformanceCard
//           IconComponent={adminCard.icon}
//           title={adminCard.title}
//           description={adminCard.description}
//           link={adminCard.link}
//         />
//       </SimpleGrid>
//     </Container>
//   );
// };

// export default AdminLeaveManagement;

import React from "react";
import { Container, SimpleGrid, Title } from "@mantine/core";
import { ShieldCheck, PencilSimple } from "@phosphor-icons/react";
import PerformanceCard from "../components/FormComponent/PerformanceCard";

const AdminLeaveManagement = () => {
  // Card for reviewing leave balances.
  const reviewLeaveCard = {
    title: "Manage Leave Balance",
    description: "Review employee leave balances.",
    icon: ShieldCheck,
    link: "/hr/admin_leave/manage_leave_balance",
  };

  // Card for updating leave balances.
  const updateLeaveCard = {
    title: "Update Leave Balance",
    description: "Edit and update employee leave numbers.",
    icon: PencilSimple, // Using PencilSimple icon to represent an edit/update action
    link: "/hr/admin_leave/update_leave_balance",
  };

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">
        Admin Leave Management
      </Title>
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
        <PerformanceCard
          IconComponent={reviewLeaveCard.icon}
          title={reviewLeaveCard.title}
          description={reviewLeaveCard.description}
          link={reviewLeaveCard.link}
        />
      </SimpleGrid>
    </Container>
  );
};

export default AdminLeaveManagement;
