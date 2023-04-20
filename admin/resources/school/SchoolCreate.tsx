import React, { useEffect, useMemo, useState } from "react";
import {
  BooleanInput,
  Create,
  FormDataConsumer,
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
import { clientGQL } from "../../api-clients/users-client";

const SchoolCreate = () => {
  const [data, setData] = useState<any>();

  useEffect(() => {

    return () => { setData(null) }
  }, [])

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

  const onError = async (err: any) => {
    console.log(err.toString())
    if (err.toString().includes('Uniqueness violation. duplicate key value violates unique constraint "location_pkey"')) {
      let locationRes: any = await clientGQL(`
        query locationQuery {
          location(where: {district: {_eq: "${data.district}"}, _and: {block: {_eq: "${data.block}"}, _and: {cluster: {_eq: "${data.cluster}"}}}}) {
            id
          }
        }
      `)
      let res = await locationRes.json();
      if (res?.data?.location?.[0]?.id) {
        let schoolRes: any = await clientGQL(`
        mutation insert_school($objects: [school_insert_input!]!) {
          data: insert_school(objects: $objects) {
            returning {
              enroll_count
              id
              is_active
              latitude
              longitude
              location_id
              name
              session
              type
              udise
              __typename
            }
            __typename
          }
        }
        `, {
          objects: {
            enroll_count: data.enroll_count ? data.enroll_count : null,
            is_active: data.is_active ? data.is_active : false,
            latitude: data.latitude ? data.latitude : null,
            longitude: data.longitude ? data.longitude : null,
            location_id: res.data.location[0].id,
            name: data.name ? data.name : null,
            session: data.session ? data.session : null,
            type: data.type ? data.type : null,
            udise: data.udise ? data.udise : null,
          }
        })
        schoolRes = await schoolRes.json();
        if (schoolRes?.data?.data?.returning?.[0]) {
          notify(`School created successfully`, { type: 'success' });
          redirect(`/school`);
        } else if (schoolRes.errors) {
          notify(`${schoolRes?.errors?.[0]?.message}`, { type: 'error' });
        }
      }
    } else {
      notify(`Unable to create school: ${err.toString()}`, { type: 'error' });
    }
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
    if (!districtData) {
      return [];
    }
    if (!selectedBlock && selectedDistrict) {
      return _.uniqBy(
        districtData.filter((d) => d.district === selectedDistrict),
        "cluster"
      ).map((a) => {
        return {
          id: a.cluster,
          name: a.cluster,
        };
      });
    }

    if (selectedBlock) {
      return _.uniqBy(
        districtData.filter((d) => d.block === selectedBlock),
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
  }, [selectedBlock, districtData, selectedDistrict]);


  return (
    <Create mutationOptions={{ onSuccess, onError }}>
      <SimpleForm>
        <TextInput source="name" validate={inputConstraints.fullName} onChange={e => setData((prevData: any) => ({ ...prevData, name: e.target.value }))} />
        <NumberInput source="udise" validate={required("Please enter a valid UDISE")} onChange={e => setData((prevData: any) => ({ ...prevData, udise: e.target.value }))} />
        <SelectInput label="District" source="location.data.district" onChange={(e: any) => {
          setSelectedDistrict(e.target.value);
          setSelectedBlock('');
          setSelectedCluster('');
          setData((prevData: any) => ({ ...prevData, district: e.target.value }))
        }} choices={districts} validate={inputConstraints.district} />
        <SelectInput label="Block" source="location.data.block" onChange={(e) => {
          setSelectedBlock(e.target.value);
          setSelectedCluster('');
          setData((prevData: any) => ({ ...prevData, block: e.target.value }))
        }} choices={blocks} validate={inputConstraints.block} />
        <SelectInput label="Cluster" source="location.data.cluster" onChange={(e) => { setSelectedCluster(e.target.value); setData((prevData: any) => ({ ...prevData, cluster: e.target.value })) }} choices={clusters} validate={inputConstraints.cluster} />
        <SelectInput source="session" label="Session" choices={["S", "W"].map(el => { return { id: el, name: el } })} validate={inputConstraints.session} onChange={e => setData((prevData: any) => ({ ...prevData, session: e.target.value }))} />
        <SelectInput source="type" label="Type" choices={["GPS", "GMS", "GHS", "GSSS"].map(el => { return { id: el, name: el } })} validate={inputConstraints.type} onChange={e => setData((prevData: any) => ({ ...prevData, type: e.target.value }))} />
        <BooleanInput source="is_active" onChange={e => setData((prevData: any) => ({ ...prevData, is_active: e.target.value }))} />
        <NumberInput source="latitude" onChange={e => setData((prevData: any) => ({ ...prevData, latitude: e.target.value }))} />
        <NumberInput source="longitude" onChange={e => setData((prevData: any) => ({ ...prevData, longitude: e.target.value }))} />
        <NumberInput source="enroll_count" onChange={e => setData((prevData: any) => ({ ...prevData, enroll_count: e.target.value }))} />
      </SimpleForm>
    </Create>
  );
};

export default SchoolCreate;
