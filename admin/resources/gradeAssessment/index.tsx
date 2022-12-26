import SchoolIcon from "@mui/icons-material/School";
import { ListGuesser } from "react-admin";
import GradeAssessmentEdit from "./GradeAssessmentEdit";
import GradeAssessmentList from "./GradeAssessmentList";
import GradeAssessmentShow from "./GradeAssessmentShow";

export default {
  list: GradeAssessmentList,
  edit: GradeAssessmentEdit,
  // show: GradeAssessmentShow,
  permissions: {
    // canEdit: ["Admin", "State Admin", "District Admin", "Block Admin", "School Admin"],
    canDelete: ["Admin", "State Admin", "District Admin", "Block Admin", "School Admin"],
    canCreate: ["Admin", "State Admin", "District Admin", "Block Admin", "School Admin"],
    canList: ["Admin", "State Admin", "District Admin", "Block Admin", "School Admin"],
  },
};
