import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Layout } from './components/layout.jsx';
import Dashboard from './Modules/Dashboard/dashboardContent.jsx';

export default function App() {
  return <MantineProvider>
    <Layout>
      <Dashboard />
    </Layout>
  </MantineProvider>;
}