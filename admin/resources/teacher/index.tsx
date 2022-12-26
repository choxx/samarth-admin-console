import SchoolIcon from "@mui/icons-material/School";
import TeacherEdit from "./teacherEdit";
import TeacherList from "./teacherList";
import TeacherShow from "./teacherShow";


export default {
  list: TeacherList,
  edit: TeacherEdit,
  // show: TeacherShow,
  icon: SchoolIcon,
  permissions: {
    canEdit: ["Admin", "School Admin"],
    canDelete: ["Admin", "School Admin"],
    canCreate: ["Admin", "School Admin"],
    canList: ["Admin", "School Admin"],
  },
};
