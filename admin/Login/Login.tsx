import * as React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import styles from './login.module.css';

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CircularProgress,
  TextField
} from "@mui/material";
import {
  Form,
  required,
  TextInput,
  useTranslate,
  useLogin,
  useNotify,
} from "react-admin";

import Box from "@mui/material/Box";
import { loginPreCheck } from "./utils";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const translate = useTranslate();

  const notify = useNotify();
  const login = useLogin();
  const location = useLocation();
  const handleSubmit = async (auth: FormValues) => {
    localStorage.clear();
    //@ts-ignore
    const isCorrect = await loginPreCheck(auth?.username, auth?.password);
    if (isCorrect) {
      setLoading(true);
      login(
        auth,
        location.state ? (location.state as any).nextPathname : "/"
      ).catch((error: Error) => {
        setLoading(false);
        notify(
          typeof error === "string"
            ? error
            : typeof error === "undefined" || !error.message
              ? "ra.auth.sign_in_error"
              : error.message,
          {
            type: "warning",
            messageArgs: {
              _:
                typeof error === "string"
                  ? error
                  : error && error.message
                    ? error.message
                    : undefined,
            },
          }
        );
      });
    } else {
      notify(`Invalid Credentials`, { type: "error" });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <Form onSubmit={handleSubmit} noValidate>
          <Card className={styles.loginCard} sx={{ borderRadius: 2, padding: '3.5rem 3rem', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px' }}>
            <div className={styles.cardHeader}>
              Samarth Admin Login
              <div className={styles.blueBar}></div>
            </div>

            <Box sx={{ padding: "0 1em 1em 1em" }}>
              <Box sx={{ marginTop: "2em" }}>
                <TextInput
                  autoFocus
                  source="username"
                  label={translate("ra.auth.username")}
                  disabled={loading}
                  validate={required()}
                  fullWidth
                  variant="standard"
                />
              </Box>
              <Box >
                <TextInput
                  source="password"
                  label={translate("ra.auth.password")}
                  type="password"
                  disabled={loading}
                  validate={required()}
                  variant="standard"
                  fullWidth
                />
              </Box>
            </Box>
            <CardActions sx={{ padding: "0 1em 1em 1em" }}>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                fullWidth
                sx={{ background: "#2855b5", padding: '0.7rem' }}
                onMouseEnter={(e: any) => e.target.style.background = "#1c3a7a"}
                onMouseLeave={(e: any) => e.target.style.background = "#2855b5"}
              >
                {loading && <CircularProgress size={25} thickness={2} />}
                {translate("ra.auth.sign_in")}
              </Button>
            </CardActions>
          </Card>
        </Form>
      </div>
      <div className={styles.loginVector}>
        <img src="https://himachal.nic.in/WriteReadData/l892s/16_l892s/samarth-logo-v9---lowres-22244626.png" />
      </div>
    </div>

  );
};

Login.propTypes = {
  authProvider: PropTypes.func,
  previousRoute: PropTypes.string,
};

export default Login;

interface FormValues {
  username?: string;
  password?: string;
}
