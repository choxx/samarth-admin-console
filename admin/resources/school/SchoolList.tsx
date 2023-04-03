import {
  TextField,
  TextInput,
  SelectInput,
  useDataProvider,
} from "react-admin";
import { ListDataGridWithPermissions } from "../../components/lists";
import { BooleanField } from "react-admin";
import *  as _ from "lodash"
import { useCallback, useEffect, useMemo, useState } from "react";
import UserService from "../../utils/user.util";
import { useQuery } from "react-query"

const SchoolList = () => {

  const params: any = new Proxy(new URLSearchParams(location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  });
  const initialFilters = params.filter ? JSON.parse(params.filter) : null;


  const [selectedDistrict, setSelectedDistrict] = useState(
    initialFilters?.district || ""
  );

  const [selectedBlock, setSelectedBlock] = useState(
    initialFilters?.block || ""
  );
  const [selectedCluster, setSelectedCluster] = useState(
    initialFilters?.cluster || ""
  );

  const dataProvider = useDataProvider();

  const {
    data: _districtData,
    isLoading,
    error,
  } = useQuery(["location", "getList", {}], () =>
    dataProvider.getList("location", {
      pagination: { perPage: 10000, page: 1 },
      sort: { field: "id", order: "asc" },
      filter: {},
    })
  )

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

  const [filterObj, setFilterObj] = useState<any>({})
  const [userLevel, setUserLevel] = useState<any>({ district: false, block: false });
  const typeChoice = [
    { id: "GPS", name: "GPS" },
    { id: "GMS", name: "GMS" },
    { id: "GHS", name: "GHS" },
    { id: "GSSS", name: "GSSS" },
  ];
  const sessionChoices = [
    { id: "S", name: "S" },
    { id: "W", name: "W" },
  ];
  const activeChoices = [
    { id: true, name: true },
    { id: false, name: false },
  ];

  const Filters = [
    <TextInput label="School Name" source="name@_ilike" alwaysOn key={"search"} />,
    <TextInput label="UDISE" source="udise" />,
    <SelectInput label="Type" source="type" choices={typeChoice} />,
    <SelectInput label="Session" source="session" choices={sessionChoices} />,
    <SelectInput label="Active" source="is_active" choices={activeChoices} />,
    <SelectInput
      label="District"
      onChange={(e: any) => {
        setSelectedDistrict(e.target.value);
        setSelectedBlock(null);
        setSelectedCluster(null);
      }}
      source="location#district"
      choices={userLevel?.district ? userLevel?.district : districts}
    />,
    <SelectInput
      label="Block"
      onChange={(e) => {
        setSelectedBlock(e.target.value);
        setSelectedCluster(null);
      }}
      value={selectedBlock}
      source="location#block"
      choices={userLevel?.block ? userLevel?.block : blocks}

    />,
    <SelectInput
      label="cluster"
      onChange={(e) => setSelectedCluster(e.target.value)}
      value={selectedCluster}
      source="location#cluster"
      choices={clusters}
    />,
  ];


  const handleInitialRendering = useCallback(async () => {

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

      if (Array.isArray(district)) {
        setSelectedDistrict(district[0].name)
      }

      if (Array.isArray(block)) {
        setSelectedBlock(block[0].name)
        setFilterObj({ "location#block": block[0].name })
      }
      setUserLevel((prev: any) => ({
        ...prev,
        district,
        block
      }))
    } else {
      if (Array.isArray(district)) {
        setSelectedDistrict(district[0].name)
        setFilterObj({ "location#district": district[0].name })

      }
      setUserLevel((prev: any) => ({
        ...prev,
        district,
      }))
    }

    return (() => clearInterval(a))
  }, [])



  useEffect(() => {
    handleInitialRendering()
  }, [handleInitialRendering])

  return (

    <ListDataGridWithPermissions
      listProps={{
        filters: Filters,
        filter: filterObj
      }}
      showExporter={true}
    >
      <TextField label="UDISE" source="udise" />
      <TextField label="Name" source="name" />
      <TextField label="Type" source="type" />
      <TextField label="Session" source="session" />
      <TextField label="District" source="location.district" />
      <TextField label="Block" source="location.block" />
      <TextField label="Cluster" source="location.cluster" />

      <BooleanField label="Active" source="is_active" />
    </ListDataGridWithPermissions>

  );
};
export default SchoolList;
