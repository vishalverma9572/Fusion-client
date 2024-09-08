import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import Dashboard from './Pages/dashboard.jsx';

export default function App() {
  return <MantineProvider>
    <Dashboard />
  </MantineProvider>;
}