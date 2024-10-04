import {
  Anchor,
  Button,
  Center,
  Container,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { loginRoute } from "../helper/api_routes";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(loginRoute, {
        username,
        password,
      });

      if (response.status === 200) {
        const { token } = response.data;
    
        localStorage.setItem("authToken", token);
        console.log("Login successful", response.data);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

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
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Username/Email"
              placeholder="username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <PasswordInput
              label="Password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              mt="lg"
            />
            <Group justify="space-between" mt="lg">
              <Link style={{ textDecoration: "none" }} to="/reset-password">
                <Anchor component="button" size="sm" c="#15ABFF">
                  Forgot password?
                </Anchor>
              </Link>
            </Group>
            <Button fullWidth size="md" mt="xl" bg="#15ABFF" type="submit">
              Sign in
            </Button>
          </form>
        </Paper>
      </Container>
    </Center>
  );
};

export default LoginPage;
