import SchoolIcon from "@mui/icons-material/School";

import SchoolList from "./SchoolList";
import SchoolEdit from "./SchoolEdit";

export default {
  list: SchoolList,
  // edit: null,
  icon: SchoolIcon,
  permissions: {
    canEdit: ['Admin'],
    canDelete: ['Admin'],
    canCreate: ['Admin'],
    canList: ['Admin'],
  }
};
