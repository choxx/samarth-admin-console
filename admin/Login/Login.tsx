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
  PasswordInput,
  useTranslate,
  useLogin,
  useNotify,
} from "react-admin";

import Box from "@mui/material/Box";
import { loginPreCheck } from "./utils";
const CryptoJS = require("crypto-js");

const Login = () => {
  const [loading, setLoading] = useState(false);
  const translate = useTranslate();

  const notify = useNotify();
  const login = useLogin();
  const location = useLocation();
  const handleSubmit = async (auth: FormValues) => {
    localStorage.clear();
    //@ts-ignore
    const loginRes = await loginPreCheck(auth?.username, auth?.password);
    if (loginRes?.data?.responseCode === "OK") {
      setLoading(true);
      login(
        auth,
        location.state ? (location.state as any).nextPathname : "/"
      ).catch((error: Error) => {
        setLoading(false);
        console.log("ERROR--->", error)
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
      notify(loginRes?.data?.params?.errMsg, { type: "error" });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginVector}>
        <img src={'/loginBg.jpeg'} />
        <div className={styles.logoContainer}>
          <div className={styles.logoImages}>
            <img src={'/hpLogo.png'} />
            <img src={'/samarthLogo.png'} />
            <img src={'/ssaLogo.png'} />
          </div>
          <p>e-Samwad/Shiksha Saathi</p>
          <p>Admin Management Panel</p>
        </div>
      </div>
      <div className={styles.loginContainer}>
        <Form onSubmit={handleSubmit} noValidate>
          <Card className={styles.loginCard} sx={{ borderRadius: 2, padding: '3rem 0rem', boxShadow: 'none' }}>
            <div className={styles.cardHeader}>
              Login
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
                  variant="outlined"
                />
              </Box>
              <Box >
                <PasswordInput
                  source="password"
                  label={translate("ra.auth.password")}
                  disabled={loading}
                  validate={required()}
                  variant="outlined"
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
                sx={{ background: "#2855b5", padding: '0.7rem', marginTop: -2 }}
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
