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
    // canEdit: ["Admin","State Admin"],
    canDelete: ["Admin"],
    canCreate: ["Admin","State Admin"],
    canList: ["Admin","State Admin"],
  },
};
