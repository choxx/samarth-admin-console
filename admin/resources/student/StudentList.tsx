import {
  ExportButton,
  FilterButton,
  NumberInput,
  Pagination,
  SelectArrayInput,
  TopToolbar,
  useDataProvider,
  downloadCSV,
  useNotify,
  BooleanInput
} from "react-admin";

// @ts-ignore don't rearrange this line :)
import jsonExport from 'jsonexport/dist';

import {
  BooleanField,
  Datagrid,
  List,
  NumberField,
  TextField,
  TextInput,
  SelectInput,
} from "react-admin";
import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import * as _ from "lodash";
import EditButtonWrapper from "../../components/styleWrappers/EditButtonWrapper";
import { streams_choices } from "./StudentStreams";
import UserService from "../../utils/user.util";


const StudentList = () => {
  const location = useLocation();
  const params: any = new Proxy(new URLSearchParams(location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  });
  const initialFilters = params.filter ? JSON.parse(params.filter) : null;
  const [selectedStatus, setSelectedStatus] = useState(
    initialFilters?.is_enabled || ""
  );
  const [selectedGrade, setSelectedGrade] = useState(
    initialFilters?.grade_number || ""
  );
  const [selectedStream, setSelectedStream] = useState(
    initialFilters?.stream_tag || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    initialFilters?.category || ""
  );
  const [selectedCwsn, setSelectedCwsn] = useState(
    initialFilters?.is_cwsn || ""
  );
  const [selectedGender, setSelectedGender] = useState(
    initialFilters?.gender || ""
  );

  const [selectedDistrict, setSelectedDistrict] = useState(
    initialFilters?.district || ""
  );
  const [selectedBlock, setSelectedBlock] = useState(
    initialFilters?.block || ""
  );

  const [userLevel, setUserLevel] = useState<any>({ district: false, block: false, cluster: false });
  const [defaultFilterValues, setDefaultFilterValues] = useState<any>({})
  const dataProvider = useDataProvider();

  const {
    data: _districtData
  } = useQuery(["location", "getList", {}], () =>
    dataProvider.getList("location", {
      pagination: { perPage: 10000, page: 1 },
      sort: { field: "id", order: "asc" },
      filter: {},
    })
  );

  const {
    data: _studentData
  } = useQuery(["student", "getList", {}], () =>
    dataProvider.getList("student", {
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
  const blocks = useMemo(() => {
    if (!districtData) {
      return [];
    }
    if (!selectedDistrict) {
      return _.uniqBy(
        districtData,
        "block"
      ).map((a) => {
        return {
          id: a.block,
          name: a.block,
        };
      });
    }
    return _.uniqBy(
      districtData.filter((d) => d.district === selectedDistrict),
      "block"
    ).map((a) => {
      return {
        id: a.block,
        name: a.block,
      };
    });
  }, [selectedDistrict, districtData]);

  const clusters = useMemo(() => {
    if (!districtData) {
      return [];
    }
    if (!selectedBlock) {
      return _.uniqBy(
        districtData,
        "cluster"
      ).map((a) => {
        return {
          id: a.cluster,
          name: a.cluster,
        };
      });
    }
    return _.uniqBy(
      districtData.filter((d) => d.block === selectedBlock),
      "cluster"
    ).map((a) => {
      return {
        id: a.cluster,
        name: a.cluster,
      };
    });
  }, [selectedBlock, districtData]);


  const studentData = useMemo(() => {
    return _studentData?.data;
  }, [_studentData]);

  const enabled = useMemo(() => {
    if (!studentData) {
      return [];
    }
    return _.uniqBy(studentData, "is_enabled").map((a) => {
      return {
        id: a.is_enabled,
        name: a.is_enabled,
      };
    });
  }, [studentData]);

  const grade = useMemo(() => {
    if (!studentData) {
      return [];
    }
    let grades = [];
    for (let i = 1; i <= 12; i++) {
      grades[i] = { id: i, name: i };
    }
    return grades;
  }, [selectedStatus, studentData]);

  const streams = useMemo(() => {
    if (!studentData) {
      return [];
    }
    return _.uniqBy(studentData, "stream_tag").map((a) => {
      return {
        id: a.stream_tag,
        name: a.stream_tag,
      };
    });
  }, [selectedGrade, studentData]);

  const category = useMemo(() => {
    if (!studentData) {
      return [];
    }
    return _.uniqBy(studentData, "category").map((a) => {
      return {
        id: a.category,
        name: a.category,
      };
    });
  }, [selectedStream, studentData]);

  const cwsn = useMemo(() => {
    if (!studentData) {
      return [];
    }
    return _.uniqBy(studentData, "is_cwsn").map((a) => {
      return {
        id: a.is_cwsn,
        name: a.is_cwsn,
      };
    });
  }, [selectedCategory, studentData]);

  const gender = useMemo(() => {
    if (!studentData) {
      return [];
    }
    return _.uniqBy(studentData, "gender").map((a) => {
      return {
        id: a.gender,
        name: a.gender,
      };
    });
  }, [selectedCwsn, studentData]);

  const Filters = [
    <NumberInput label="ID" source="id" alwaysOn />,
    <BooleanInput source="is_enabled" alwaysOn />,
    <TextInput label="UDISE" source="school#udise" key="search" />,
    <TextInput label="School Name" source="school#name@_ilike" key={"search"} />,
    <TextInput label="Student Name" source="name@_ilike" key={"search"} />,
    <SelectArrayInput
      label="Grade"
      onChange={(e) => {
        setSelectedStatus(null);
        setSelectedGrade(e.target.value);
        setSelectedStream(null);
        setSelectedCategory(null);
        setSelectedCwsn(null);
        setSelectedGender(null);
      }}
      source="grade_number"
      choices={grade}
    />,
    <SelectArrayInput
      label="Stream"
      onChange={(e) => {
        setSelectedStatus(null);
        setSelectedGrade(null);
        setSelectedStream(e.target.value);
        setSelectedCategory(null);
        setSelectedCwsn(null);
        setSelectedGender(null);
      }}
      source="stream_tag"
      choices={streams_choices}
      isRequired={true}
    />,
    <SelectInput
      label="Category"
      onChange={(e) => {
        setSelectedStatus(null);
        setSelectedGrade(null);
        setSelectedStream(null);
        setSelectedCategory(e.target.value);
        setSelectedCwsn(null);
        setSelectedGender(null);
      }}
      value={selectedCategory}
      source="category"
      choices={category}
      isRequired={true}
    />,
    <SelectInput
      label="CWSN"
      onChange={(e) => {
        setSelectedStatus(null);
        setSelectedGrade(null);
        setSelectedStream(null);
        setSelectedCategory(null);
        setSelectedCwsn(e.target.value);
        setSelectedGender(null);
      }}
      value={selectedCwsn}
      source="is_cwsn"
      choices={cwsn}
      isRequired={true}
    />,
    <SelectArrayInput
      label="Gender"
      onChange={(e) => {
        setSelectedStatus(null);
        setSelectedGrade(null);
        setSelectedStream(null);
        setSelectedCategory(null);
        setSelectedCwsn(null);
        setSelectedGender(e.target.value);
      }}
      source="gender"
      choices={gender}
      isRequired={true}
    />,
    <SelectInput label="District" source="school#location#district" choices={userLevel?.district ? userLevel?.district : districts}

      onChange={(e: any) => {
        setSelectedDistrict(e.target.value);
        setSelectedBlock(null);
      }} />,
    <SelectInput label="Block" source="school#location#block"
      choices={userLevel?.block ? userLevel?.block : blocks}
      onChange={(e: any) => {
        setSelectedBlock(e.target.value);
      }} />,
    <SelectInput label="Cluster" source="school#location#cluster" choices={clusters} />,
  ];
  const StudentPagination = () => (
    <Pagination rowsPerPageOptions={[10, 50, 75, 100]} />
  );


  const ListActions = () => (
    <TopToolbar>
      <FilterButton />
      <ExportButton maxResults={30000} />
    </TopToolbar>
  );


  const notify = useNotify();
  const exporter = (records: any) => {
    const recordsForExports = records.map((rec: any) => {
      const recForExport = {
        'Name': rec?.name,
        'Student ID': rec?.admission_number,
        "Father's Name": rec?.father_name,
        "Mother's Name": rec?.mother_name,
        'Class': rec?.grade_number,
        'Section': rec?.section,
        'Stream': rec?.stream_tag,
        'Mobile': rec?.phone,
        'Gender': rec?.gender,
        'CWSN': rec?.is_cwsn ? "Yes" : "No",
        'Category': rec?.category
      }
      return recForExport;
    });
    jsonExport(recordsForExports, {
      headers: ['Name', 'Student ID', "Father's Name", "Mother's Name", 'Class', 'Section', 'Stream', 'Mobile', 'Gender', 'CWSN', 'Category']
    }, (err: any, csv: any) => {
      if (err) notify(err.toString(), { type: 'warning' })
      downloadCSV(csv, 'Samarth Students');
    });
  };


  // Hotfix to remove 'Save current query...' and 'Remove all filters' option from filter list #YOLO

  const forUseEffect = useCallback(async () => {
    const a = setInterval(() => {
      let x = document.getElementsByClassName('MuiMenuItem-gutters');
      for (let i = 0; i < x.length; i++) {
        if (x[i].textContent == 'Save current query...' || x[i].textContent == 'Remove all filters') {
          x[i].parentElement?.removeChild(x[i]);
        }
      }
    }, 50);


    // Hotfix to remove selected district when a filter is "closed".
    // const [tempState, setTempState] = useState(false);
    const docFilters = document.getElementsByClassName("filter-field");
    let de = false;
    for (let i = 0; i < docFilters.length; i++) {
      if (docFilters[i].getAttribute('data-source') == 'school#location#district')
        de = true;
    }
    if (!de && selectedDistrict) {
      setSelectedDistrict("")
    }


    let user = new UserService()
    let { district, block }: any = await user.getInfoForUserListResource()



    if (Array.isArray(district) && Array.isArray(block)) {
      setSelectedDistrict(district[0].name)
      setSelectedBlock(block[0].name)
      setDefaultFilterValues({
        school: {
          format: "hasura-raw-query",
          location: {
            district: { _eq: String(district[0].name) },
            block: { _eq: String(block[0].name) },
          }
        },
      })

      setUserLevel((prev: any) => ({
        ...prev,
        district,
        block
      }))
    } else {
      if (Array.isArray(district)) {
        setSelectedDistrict(district[0].name)
        setDefaultFilterValues({
          school: {
            format: "hasura-raw-query",
            location: {
              district: { _eq: district[0].name },
            }
          },
        })
      }
      setUserLevel((prev: any) => ({
        ...prev,
        district,
      }))
    }


    return (() => clearInterval(a))
  }, [])

  useEffect(() => {
    forUseEffect()
  }, [forUseEffect])


  return (
    <List filters={Filters} exporter={exporter}
      filter={selectedDistrict && selectedBlock ? (
        {
          school: {
            format: "hasura-raw-query",
            location: {
              district: { _eq: selectedDistrict },
              block: { _eq: selectedBlock },
            }
          }
        }
      ) : (
        {
          school: {
            format: "hasura-raw-query",
            location: {
              district: { _eq: selectedDistrict },
              block: { _eq: selectedBlock },
            }
          }
        }
      )}
      pagination={<StudentPagination />} actions={<ListActions />}>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="father_name" />
        <TextField source="school.name" label="School" />
        <TextField source="school.udise" label="UDISE" />
        <NumberField source="grade_number" />
        <TextField source="stream_tag" />
        <BooleanField source="is_cwsn" label={"CWSN"} />
        <TextField source="gender" label={"Gender"} />
        <TextField source="school.location.district" label="District" />
        <TextField source="school.location.block" label="Block" />
        <TextField source="school.location.cluster" label="Cluster" />
        <BooleanField source="is_enabled" label={"Enabled"} />
        <EditButtonWrapper />
      </Datagrid>
    </List>
  );
};
export default StudentList;
