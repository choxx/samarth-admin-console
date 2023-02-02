import {
  TextField,
  ReferenceField,
  TextInput,
  FunctionField,
  SelectInput,
} from "react-admin";
import { WithMyDistricts } from "../../components/withAccesses";
import { ListDataGridWithPermissions } from "../../components/lists";
import { BooleanField } from "react-admin";
import { getLocationDetails } from "../../utils/LocationDetailsHelper";
import { useEffect } from "react";

const SchoolList = () => {
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
    <SelectInput label="District" source="location#district" choices={districts} />,
    <SelectInput label="Block" source="location#block" choices={blocks} />,
    <SelectInput label="Cluster" source="location#cluster" choices={clusters} />,
  ];

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

  return (
    <WithMyDistricts>
      {(districts: any) => {
        return (
          <ListDataGridWithPermissions
            listProps={{
              filters: Filters,
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
      }}
    </WithMyDistricts>
  );
};
export default SchoolList;
