import {
  TextField,
  ReferenceField,
  DateField,
  TextInput,
  useDataProvider,
  FunctionField,
  SelectInput,
  ReferenceInput,
  AutocompleteInput,
} from "react-admin";
import { ListDataGridWithPermissions } from "../../components/lists";
import { useQuery } from "react-query";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import _ from "lodash";

const GradeAssessmentList = () => {
  const location = useLocation();
  const params: any = new Proxy(new URLSearchParams(location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  });
  const initialFilters = params.filter ? JSON.parse(params.filter) : null;

  const [selectUdise, setSelectUdise] = useState(initialFilters?.udise || "");
  const [selectedDistrict, setSelectedDistrict] = useState(
    initialFilters?.district || ""
  );

  const [selectedBlock, setSelectedBlock] = useState(
    initialFilters?.block || ""
  );

  const dataProvider = useDataProvider();
  const { data: _districtData } = useQuery(["lcoation", "getList", {}], () =>
    dataProvider.getList("location", {
      pagination: { perPage: 10000, page: 1 },
      sort: { field: "id", order: "asc" },
      filter: {},
    })
  );

  const {
    data: _schoolData,
    isLoading,
    error,
  } = useQuery(["school", "getList", {}], () =>
    dataProvider.getList("school", {
      pagination: { perPage: 10000, page: 1 },
      sort: { field: "id", order: "asc" },
      filter: {},
    })
  );
  const districtData = useMemo(() => {
    return _districtData?.data;
  }, [_districtData]);
  const districts = useMemo(() => {
    if (!districtData) {
      return [];
    }
    return _.uniqBy(districtData, "district").map((a) => {
      return {
        id: a.district,
        name: a.district,
      };
    });
  }, [districtData]);

  const displayDistrict = (a: any) => {
    const data = districtData?.filter((item: any, index: number) => {
      return item.id == a.id;
    })[0];

    return data?.district || "";
  };
  const displayBlock = (a: any) => {
    const data = districtData?.filter((item: any, index: number) => {
      return item.id == a.id;
    })[0];

    return data?.block || "";
  };
  const blocks = useMemo(() => {
    return _.uniqBy(districtData, "block").map((a) => {
      return {
        id: a.block,
        name: a.block,
      };
    });
  }, [districtData]);

  const schoolData = useMemo(() => {
    return _schoolData?.data;
  }, [_schoolData]);
  // console.log(schoolData, "schoolData");

  const school = useMemo(() => {
    if (!selectUdise || !schoolData) {
      return [];
    }
    return _.uniqBy(
      schoolData.filter((d) => d.udise === selectUdise),
      "udise"
    ).map((a) => {
      return {
        id: a.udise,
        name: a.udise,
      };
    });
  }, [selectUdise, schoolData]);
  const Filters = [
    <TextInput label="ID" source="id" alwaysOn />,
    <TextInput label="Grade Number" source="grade_number" key={"search"}/>
  ];
  return (
    <ListDataGridWithPermissions
      dataGridProps={{ rowClick: "show" }}
      listProps={{ filters: Filters }}
    >
      <TextField source="id" />
      <TextField label={"Assessment"} source="assessment_id" />
      <TextField source="grade_number" />
      <TextField source="section" />
      <TextField source="school_id" />
      <ReferenceField label="Udise" source="school_id" reference="school">
        <TextField source="udise" />
      </ReferenceField>
      <ReferenceField label="District" source="school_id" reference="school">
        <ReferenceField source="location_id" reference="location">
          <TextField source="district" />
        </ReferenceField>
      </ReferenceField>
      <ReferenceField label="Block" source="school_id" reference="school">
        <ReferenceField source="location_id" reference="location">
          <TextField source="block" />
        </ReferenceField>
      </ReferenceField>
      <ReferenceField label="Cluster" source="school_id" reference="school">
        <ReferenceField source="location_id" reference="location">
          <TextField source="cluster" />
        </ReferenceField>
      </ReferenceField>
      <TextField source="streams_id" />
      <DateField source="created" />
      <DateField source="updated" />
    </ListDataGridWithPermissions>
  );
};
export default GradeAssessmentList;
