import * as React from "react";
import { AppBar, Logout, ToggleThemeButton, UserMenu, useTranslate, defaultTheme } from "react-admin";
import { Link } from "react-router-dom";
import {
    MenuItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import Avatar from '@mui/material/Avatar';
import SettingsIcon from "@mui/icons-material/Settings";
import { forwardRef } from "react";
import { darkTheme, lightTheme } from "./themes";
// import { darkTheme, lightTheme } from "./themes";



// eslint-disable-next-line react/display-name
// const ConfigurationMenu = forwardRef((props, ref) => {
//     const translate = useTranslate();
//     return (
//         <MenuItem
//             component={Link}
//             // @ts-ignore
//             ref={ref}
//             {...props}
//             to="/configuration"
//         >
//             <ListItemIcon>
//                 <SettingsIcon />
//             </ListItemIcon>
//             <ListItemText>{translate("pos.configuration")}</ListItemText>
//         </MenuItem>
//     );
// });

const CustomUserMenu = (props: any) => (
    <UserMenu {...props} >
        <Logout />
    </UserMenu >
);

const CustomAppBar = (props: any) => {
    return (
        <>
            <AppBar
                {...props}
                elevation={1}
                userMenu={<CustomUserMenu />}
            >
                <img id="samarth-logo" style={{ height: '3rem', padding: 5 }} src="https://himachal.nic.in/WriteReadData/l892s/16_l892s/samarth-logo-v9---lowres-22244626.png" />
                <Typography sx={{ flex: 1 }} />
                <ToggleThemeButton
                    lightTheme={lightTheme}
                    darkTheme={darkTheme}
                />
            </AppBar>
            <style>
                {`
                    .RaUserMenu-avatar {
                        display: none !important;
                    }
                `}
            </style>
        </>
    );
};

export default CustomAppBar;
