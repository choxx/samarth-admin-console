import {
  ExportButton,
  FilterButton,
  Labeled,
  NumberInput,
  Pagination,
  ReferenceInput,
  SearchInput,
  SelectArrayInput,
  ShowButton,
  TopToolbar,
  useDataProvider,
  useListContext,
  downloadCSV,
  useNotify,
  BooleanInput
} from "react-admin";

//@ts-ignore don't rearrange this line :)
import jsonExport from 'jsonexport/dist';

import {
  BooleanField,
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
  TextInput,
  SelectInput,
} from "react-admin";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import * as _ from "lodash";
import { isBoolean } from "lodash";
import EditButtonWrapper from "../../components/styleWrappers/EditButtonWrapper";
import { streams_choices } from "./StudentStreams";


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

  // Hotfix to remove selected district when a filter is "closed".
  // const [tempState, setTempState] = useState(false);
  useEffect(() => {
    const docFilters = document.getElementsByClassName("filter-field");
    let de = false;
    for (let i = 0; i < docFilters.length; i++) {
      if (docFilters[i].getAttribute('data-source') == 'school#location#district')
        de = true;
    }
    if (!de && selectedDistrict)
      setSelectedDistrict("")
  })

  // useEffect(() => {
  //   setTimeout(() => setTempState(!tempState), 500)
  // })

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
    <SelectInput label="District" source="school#location#district" choices={districts}
      onChange={(e: any) => {
        setSelectedDistrict(e.target.value);
        setSelectedBlock(null);
      }} />,
    <SelectInput label="Block" source="school#location#block" choices={blocks}
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
  // Hotfix to remove 'Save current query...' and 'Remove all filters' option from filter list #YOLO
  useEffect(() => {
    const a = setInterval(() => {
      let x = document.getElementsByClassName('MuiMenuItem-gutters');
      for (let i = 0; i < x.length; i++) {
        if (x[i].textContent == 'Save current query...' || x[i].textContent == 'Remove all filters') {
          x[i].parentElement?.removeChild(x[i]);
        }
      }
    }, 50);

    return (() => clearInterval(a))
  }, [])
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


  return (
    <List filters={Filters} exporter={exporter} pagination={<StudentPagination />} actions={<ListActions />}>
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
        {/* <TextField source="school.location.district" label="District" />
        <TextField source="school.location.block" label="Block" />
        <TextField source="school.location.cluster" label="Cluster" /> */}
        <BooleanField source="is_enabled" label={"Enabled"} />
        <EditButtonWrapper />
      </Datagrid>
    </List>
  );
};
export default StudentList;
