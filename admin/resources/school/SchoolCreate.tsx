import React, { useEffect, useMemo, useState } from "react";
import {
  BooleanInput,
  Create,
  maxLength,
  NumberField,
  NumberInput,
  regex,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  useDataProvider,
  useNotify,
  useRedirect,
} from "react-admin";
import { useQuery } from "react-query";
import * as _ from "lodash";

const SchoolCreate = () => {
  // Input Constraints
  const inputConstraints = {
    // userName: [required("Please provide username"), number("The username must be numeric")],
    // udise: [required("Please provide UDISE"), number("The UDISE must be numeric"), udiseSchoolCheck],
    fullName: [required("Please provide fullname"), regex(/^[a-zA-Z0-9 ]*$/, "Name can only contain alphabets, numbers and spaces")],
    // mobile: [required("Please provide mobile number"), number("Mobile must be numeric"), minLength(10), maxLength(10)],
    session: required("Please select session"),
    district: required("Please select a district"),
    block: required("Please select a block"),
    cluster: required("Please select a cluster"),
    type: required("Please select type"),
    coord: [required("Please enter a valid co-ordinate"), regex(/^[1-9]\d*(\.\d+)?$/, "Please enter a valid co-ordinate")]
  }
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify(`School added successfully`);
    redirect(`/school`);
  };

  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('');
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
    }).sort((a: any, b: any) => { return a.name < b.name ? -1 : 1 });;
  }, [districtData]);

  const blocks = useMemo(() => {
    if (!selectedDistrict || !districtData) {
      return [];
    }

    return _.uniqBy(
      districtData.filter((d) => d.district === selectedDistrict),
      "block"
    ).map((a) => {
      return {
        id: a.block,
        name: a.block,
      };
    }).sort((a: any, b: any) => { return a.name < b.name ? -1 : 1 });;
  }, [selectedDistrict, districtData]);

  const clusters = useMemo(() => {
    if (!selectedBlock || !districtData) {
      return [];
    }
    return _.uniqBy(
      districtData.filter((d) => d.block === selectedBlock),
      "cluster"
    ).map((a) => {
      return {
        id: a.cluster,
        name: a.cluster,
      };
    }).sort((a: any, b: any) => { return a.name < b.name ? -1 : 1 });;
  }, [selectedBlock, districtData]);


  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <TextInput source="name" validate={inputConstraints.fullName} />
        <NumberInput source="udise" validate={required("Please enter a valid UDISE")} />
        <SelectInput label="District" source="location.data.district" onChange={(e: any) => {
          setSelectedDistrict(e.target.value);
          setSelectedBlock('');
          setSelectedCluster('');
        }} choices={districts} validate={inputConstraints.district} />
        <SelectInput label="Block" source="location.data.block" onChange={(e) => {
          setSelectedBlock(e.target.value);
          setSelectedCluster('');
        }} choices={blocks} validate={inputConstraints.block} />
        <SelectInput label="Cluster" source="location.data.cluster" onChange={(e) => setSelectedCluster(e.target.value)} choices={clusters} validate={inputConstraints.cluster} />
        <SelectInput source="session" label="Session" choices={["S", "W"].map(el => { return { id: el, name: el } })} validate={inputConstraints.session} />
        <SelectInput source="type" label="Type" choices={["GPS", "GMS", "GHS", "GSSS"].map(el => { return { id: el, name: el } })} validate={inputConstraints.type} />
        <BooleanInput source="is_active" />
        <TextInput source="latitude" />
        <TextInput source="longitude" />
        <TextInput source="enroll_count" />
      </SimpleForm>
    </Create>
  );
};

export default SchoolCreate;
