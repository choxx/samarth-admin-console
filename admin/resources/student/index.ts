import SchoolIcon from "@mui/icons-material/School";

import StudentList from "./StudentList";
import StudentEdit from "./StudentEdit";
import StudentShow from "./StudentShow";

export default {
  list: StudentList,
  edit: StudentEdit,
  // show: StudentShow,
  permissions: {
    canEdit: ["Admin","State Admin","District Admin", "Block Admin"],
    // canDelete: ["Admin"],
    // canCreate: ["Admin"],
    canList: ["Admin","State Admin","District Admin", "Block Admin"],
  },
};
