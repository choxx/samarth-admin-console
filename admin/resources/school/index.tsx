import SchoolIcon from "@mui/icons-material/School";

import SchoolList from "./SchoolList";
import SchoolEdit from "./SchoolEdit";
import SchoolShow from "./SchoolShow";
import SchoolCreate from "./SchoolCreate";

export default {
  list: SchoolList,
  edit: SchoolEdit,
  // show: SchoolShow,
  create: SchoolCreate,
  permissions: {
    canEdit: ["Admin", "State Admin", "District Admin", "Block Admin"],
    // canDelete: ["Admin"],
    canCreate: ["Admin", "State Admin", "District Admin"],
    canList: ["Admin", "State Admin", "District Admin", "Block Admin"],
  },
};
