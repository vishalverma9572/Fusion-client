import {
  Anchor,
  Button,
  Center,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
// import classes from "./AuthenticationTitle.module.css";

const LoginPage = () => {
  return (
    <Center w="100%">
      <Container w={420} my={100}>
        <Title ta="center">Login</Title>

        <Paper
          withBorder
          shadow="lg"
          p={30}
          mt={40}
          radius="md"
          style={{ border: "2px solid #15ABFF" }}
        >
          <TextInput
            label="Username/Email"
            placeholder="username or email"
            required
          />
          <PasswordInput
            label="Password"
            placeholder="password"
            required
            mt="lg"
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Link style={{ textDecoration: "none" }} to="/reset-password">
              <Anchor component="button" size="sm" c="#15ABFF">
                Forgot password?
              </Anchor>
            </Link>
          </Group>
          <Button fullWidth size="md" mt="xl" bg="#15ABFF">
            Sign in
          </Button>
        </Paper>
      </Container>
    </Center>
  );
};

export default LoginPage;
