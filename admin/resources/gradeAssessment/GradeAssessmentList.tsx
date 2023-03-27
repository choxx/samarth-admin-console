import {
  TextField,
  ReferenceField,
  DateField,
  TextInput,
  useDataProvider,
  SearchInput,
  FunctionField,
  SelectInput,
  ReferenceInput,
  AutocompleteInput,
  BulkDeleteWithConfirmButton,
  BulkDeleteButton,
} from "react-admin";
import { ListDataGridWithPermissions } from "../../components/lists";
import { useQuery } from "react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import { assessmentTypeChoices, gradeNumberChoices } from "../../utils/InputChoicesHelper";
import { getLocationDetails } from "../../utils/LocationDetailsHelper";
import UserService from "../../utils/user.util";

const GradeAssessmentList = () => {

  const { districts, blocks, clusters } = getLocationDetails();
  const [filterObj, setFilterObj] = useState<any>({})
  const [userLevel, setUserLevel] = useState<any>({ district: false, block: false });

  const Filters = [
    <TextInput label="UDISE" source="school#udise" key={"search"} alwaysOn />,
    <SelectInput label="Grade Number" source="grade_number" key={"search"} choices={gradeNumberChoices} />,
    <SelectInput source="assessment#type" label="Assessment Type" choices={assessmentTypeChoices} />,
    <SelectInput source="school#location#district" label="District" choices={userLevel.district ? userLevel.district : districts} />,
    <SelectInput source="school#location#block" label="Block" choices={userLevel.block ? userLevel.block : blocks} />,
    <SelectInput source="school#location#cluster" label="Cluster" choices={clusters} />
  ];
  const handleInitialRender = useCallback(async () => {
    // Hotfix to remove 'Save current query...' and 'Remove all filters' option from filter list #YOLO
    const a = setInterval(() => {
      let x = document.getElementsByClassName('MuiMenuItem-gutters');
      for (let i = 0; i < x.length; i++) {
        if (x[i].textContent == 'Save current query...' || x[i].textContent == 'Remove all filters') {
          x[i].parentElement?.removeChild(x[i]);
        }
      }
    }, 50);

    let user = new UserService()
    let { district, block }: any = await user.getInfoForUserListResource()


    if (district && block) {
      if (Array.isArray(block)) {
        setFilterObj({ "school#location#block": block[0].name })
      }
      setUserLevel((prev: any) => ({
        ...prev,
        district,
        block
      }))
    } else {
      if (Array.isArray(district)) {
        setFilterObj({ "school#location#district": district[0].name })
      }
      setUserLevel((prev: any) => ({
        ...prev,
        district,
      }))
    }

    return (() => clearInterval(a))
  }, [])

  useEffect(() => {
    handleInitialRender()
  }, [handleInitialRender])

  return (
    <ListDataGridWithPermissions
      dataGridProps={{ rowClick: "show" }}
      listProps={{ filters: Filters, filter: filterObj }}
      withDelete={<BulkDeleteButton />}
    >
      <TextField source="id" />
      <TextField label={"Assessment"} source="assessment_id" />
      <TextField source="grade_number" />
      <TextField source="section" />
      <TextField source="school_id" />
      <TextField source="assessment.type" label="Assessment Type" />
      <TextField source="assessment.assessment_type.name" label="Assessment Name" />
      <TextField source="assessment.assessment_type.assessment_category.name" label="Assessment Category" />
      <TextField source="school.udise" label="UDISE" />
      <TextField source="school.location.district" label="District" />
      <TextField source="school.location.block" />
      <TextField source="school.location.cluster" />
      <TextField source="streams_id" />
    </ListDataGridWithPermissions>
  );
};
export default GradeAssessmentList;
