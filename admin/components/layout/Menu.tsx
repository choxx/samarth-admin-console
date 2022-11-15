import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import { Menu } from 'react-admin';
import {
    useTranslate,
    MenuItemLink,
    MenuProps,
    useSidebarState,
} from "react-admin";

import { useTheme } from "@mui/material";
import MenuOptions, { MenuItemsWithPermissionResolver } from "./MenuOptions";
import { usePermissions } from "ra-core";
import { IoIosSchool } from 'react-icons/io';
import { TbNotebook } from 'react-icons/tb';
import { FaUsers, FaSchool } from 'react-icons/fa';
import { ImLocation2 } from 'react-icons/im';
import { MdAssessment } from 'react-icons/md';
import { BiMapPin } from 'react-icons/bi';

const getIcon = (resource: String) => {
    switch (resource) {
        case 'student': return <IoIosSchool />
        case 'teacher': return <TbNotebook />
        case 'e_samwaad_user':
        case 'shiksha_saathi_user': return <FaUsers />
        case 'school': return <FaSchool />
        case 'location': return <ImLocation2 />
        case 'grade_assessment': return <MdAssessment />
        case 'ss_school_allocation_data': return <BiMapPin />
        default: return <></>;
    }
}

const MyMenu = () => {
    const { permissions } = usePermissions();
    return (
        <Menu>
            {MenuItemsWithPermissionResolver(permissions).map((option) => {
                return (
                    <Menu.Item
                        key={option.name}
                        to={`/${option.resource}`}
                        state={{ _scrollToTop: true }}
                        primaryText={option.name}
                        leftIcon={getIcon(option.resource)}
                    />
                );
            })}
        </Menu>
    );
};

export default MyMenu;
