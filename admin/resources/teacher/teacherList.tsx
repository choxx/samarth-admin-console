import {
  TextField, useRecordContext, NumberInput, useDataProvider, SelectInput, TextInput, downloadCSV,
  useNotify,
  TopToolbar,
  FilterButton,
  ExportButton,
  FunctionField
} from "react-admin";
import { ListDataGridWithPermissions } from "../../components/lists";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import * as _ from "lodash";
import { clientGQL } from "../../api-clients/users-client";

//@ts-ignore don't rearrange this line :)
import jsonExport from 'jsonexport/dist';


const statusChoices = [
  {
    id: "PENDING",
    name: "Pending",
    icon: "warning",
    color: "#FEC400",
  },
  {
    id: "REJECTED",
    name: "Rejected",
    icon: "pending_actions",
    color: "#F12B2C",
    templateId: "1007409368881000345",
    template:
      "Your registration request for e-Samvad has been rejected. Please contact your school head regarding this matter.\n\nSamagra Shiksha, Himachal Pradesh",
  },
  {
    id: "ACTIVE",
    name: "Active",
    icon: "inventory",
    color: "#29CC97",
    templateId: "1007578130357765332",
    template:
      "Your registration on e-Samvad has been approved. You can login to the app to access all the features.\n\nSamagra Shiksha, Himachal Pradesh",
  },
  {
    id: "DEACTIVATED",
    name: "Deactivated",
    icon: "real_estate_agent",
    color: "#cbcbcb",
  },
];

const ColoredChipField = (props: any) => {
  const record = useRecordContext();

  let data = statusChoices.find((elem) => elem.id === record[props.source]);
  return (
    <span
      style={{
        padding: "3px 10px",
        margin: "5px",
        color: "#fff",
        borderRadius: "0.5rem",
        background: `${data?.color}`,
        display: "inline-block",
        fontWeight: 'bold'
      }}
    >
      {data?.name}
    </span>
  );
};

const TeacherList = () => {

  const dataProvider = useDataProvider();
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [designationChoices, setDesignationChoices] = useState([]);
  const [teacherData, setTeacherData] = useState<any>({});
  let promiseMap = useRef<any>({});

  const {
    data: _districtData
  } = useQuery(["location", "getList", {}], () =>
    dataProvider.getList("location", {
      pagination: { perPage: 10000, page: 1 },
      sort: { field: "id", order: "asc" },
      filter: {},
    })
  );

  const getDesignationOptions = async () => {
    let res: any = await clientGQL(`
      query {
        teacher(distinct_on: designation) {
          designation
        }
      }    
    `);
    res = await res.json();
    if (res?.data?.teacher?.length)
      setDesignationChoices(res.data.teacher.map((el: any) => { return { id: el.designation, name: el.designation } }))
  }

  useEffect(() => { getDesignationOptions() }, [])

  // Hotfix to remove selected district when a filter is "closed".
  // const [tempState, setTempState] = useState(false);
  useEffect(() => {
    const docFilters = document.getElementsByClassName("filter-field");
    let de = false;
    let be = false;
    for (let i = 0; i < docFilters.length; i++) {
      if (docFilters[i].getAttribute('data-source') == 'school#location#district')
        de = true;
      if (docFilters[i].getAttribute('data-source') == 'school#location#district')
        be = true;
    }
    if (!de && selectedDistrict)
      setSelectedDistrict("")
  })

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
    console.log(records)
    const recordsForExports = records.map((rec: any) => {
      const recForExport = {
        'School Name': rec?.school?.name,
        'School UDISE': rec?.school?.udise,
        'Mode of Employment': rec?.employment,
        "Designation": rec?.designation,
        'District': rec?.school?.location?.district,
        'Block': rec?.school?.location?.block,
        'Cluster': rec?.school?.location?.cluster,
        'Account Status': rec?.account_status,
      }
      return recForExport;
    });
    jsonExport(recordsForExports, {
      headers: ['School Name', 'School UDISE', "Mode of Employment", "Designation", 'District', 'Block', 'Cluster', 'Account Status']
    }, (err: any, csv: any) => {
      if (err) notify(err.toString(), { type: 'warning' })
      downloadCSV(csv, 'Samarth Teachers');
    });
  };

  const Filters = [
    <NumberInput source="school#udise" label="UDISE" />,
    <SelectInput label="District" source="school#location#district" choices={districts}
      onChange={(e: any) => {
        setSelectedDistrict(e.target.value);
      }} />,
    <SelectInput label="Block" source="school#location#block" choices={blocks}
      onChange={(e: any) => {
        setSelectedBlock(e.target.value);
      }} />,
    <SelectInput label="Cluster" source="school#location#cluster" choices={clusters} />,
    <SelectInput label="Designation" source="designation" choices={designationChoices} />,
    <TextInput label="School Name" source="school#name@_ilike" />,
    <SelectInput label="Mode of Employment" source="employment" choices={['Contractual', 'Permanent'].map((el: any) => { return { id: el, name: el } })} />,
    <SelectInput label="Account Status" source="account_status" choices={['ACTIVE', 'DEACTIVATED', 'PENDING', 'REJECTED'].map((el: any) => { return { id: el, name: el } })} />,
  ]

  const ListActions = () => (
    <TopToolbar>
      <FilterButton />
      <ExportButton maxResults={30000} />
    </TopToolbar>
  );

  const getTeacherName = async (record: any) => {
    promiseMap.current[record.user_id] = true;
    const result: any = await dataProvider.getList('e_samwaad_user', {
      pagination: { perPage: 1, page: 1 },
      sort: { field: 'id', order: 'asc' },
      filter: { user_id: record.user_id }
    })
    if (result?.data?.[0])
      setTeacherData((prevData: any) => {
        return {
          ...prevData, [record.user_id]: {
            name: result?.data?.[0]?.firstName,
            mobile: result?.data?.[0]?.mobilePhone
          }
        }
      })
  }

  return (
    <ListDataGridWithPermissions dataGridProps={{ rowClick: "show" }} showExporter={true} listProps={{ filters: Filters, actions: <ListActions />, 'exporter': exporter }}>
      {/* <TextField source="id" /> */}
      <FunctionField
        label={"Name"}
        render={(record: any) => {
          if (!promiseMap.current[record.user_id])
            getTeacherName(record);
          else
            return <span>{teacherData?.[record.user_id]?.name || "----------------"}</span>
        }}
      />
      <FunctionField
        label={"Mobile"}
        render={(record: any) => {
          return <span>{teacherData?.[record.user_id]?.mobile || "----------------"}</span>
        }}
      />
      <TextField source="school.name" />
      <TextField source="school.udise" />
      <TextField label="Mode of employment" source="employment" />
      <TextField label="Designation" source="designation" />
      <ColoredChipField label="Account Status" source="account_status" />
    </ListDataGridWithPermissions>
  );
};
export default TeacherList;