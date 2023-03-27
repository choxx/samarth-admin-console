import {
  TextField,
  TextInput,
  SelectInput,
} from "react-admin";
import { ListDataGridWithPermissions } from "../../components/lists";
import { BooleanField } from "react-admin";
import { getLocationDetails } from "../../utils/LocationDetailsHelper";
import { useCallback, useEffect, useState } from "react";
import UserService from "../../utils/user.util";

const SchoolList = () => {
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
  const { districts, blocks, clusters } = getLocationDetails();

  const Filters = [
    <TextInput label="School Name" source="name@_ilike" alwaysOn key={"search"} />,
    <TextInput label="UDISE" source="udise" />,
    <SelectInput label="Type" source="type" choices={typeChoice} />,
    <SelectInput label="Session" source="session" choices={sessionChoices} />,
    <SelectInput label="Active" source="is_active" choices={activeChoices} />,
    <SelectInput label="District" source="location#district" choices={userLevel.district ? userLevel.district : districts} />,
    <SelectInput label="Block" source="location#block" choices={userLevel.block ? userLevel.block : blocks} />,
    <SelectInput label="Cluster" source="location#cluster" choices={clusters} />,
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
      if (Array.isArray(block)) {
        setFilterObj({ "location#block": block[0].name })
      }
      setUserLevel((prev: any) => ({
        ...prev,
        district,
        block
      }))
    } else {
      if (Array.isArray(district)) {
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
      {/* <FunctionField
              label="Session"
              render={(record: any) => {
                const obj = config.schoolSession.find(
                  (elem: any) => elem.id === record.session
                );
                return obj?.name;
              }}
            /> */}
      <BooleanField label="Active" source="is_active" />
    </ListDataGridWithPermissions>

  );
};
export default SchoolList;
