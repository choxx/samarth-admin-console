import SchoolIcon from "@mui/icons-material/School";

import StudentList from "./StudentList";
import StudentEdit from "./StudentEdit";
import StudentShow from "./StudentShow";

export default {
  list: StudentList,
  edit: StudentEdit,
  // show: StudentShow,
  permissions: {
    canEdit: ["Admin", "State Admin", "District Admin", "Block Admin", "School Admin"],
    canDelete: ["Admin", "State Admin", "District Admin", "Block Admin", "School Admin"],
    canCreate: ["Admin", "State Admin", "District Admin", "Block Admin", "School Admin"],
    canList: ["Admin", "State Admin", "District Admin", "Block Admin", "School Admin"],
  },
};
