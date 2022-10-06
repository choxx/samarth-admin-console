import React from "react";
import {
  BooleanInput,
  Create,
  NumberInput,
  ReferenceField,
  ReferenceInput,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";

const SchoolCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <NumberInput source="enroll_count" />
        <BooleanInput source="is_active" />
        <TextInput source="latitude" />
        <ReferenceInput source="location_id" reference="location">
          <TextInput source="districts" />
        </ReferenceInput>
        <ReferenceInput source="location_id" reference="location">
          <TextInput source="block" />
        </ReferenceInput>
        <ReferenceInput source="location_id" reference="location">
          <TextInput source="cluster" />
        </ReferenceInput>
        <TextInput source="longitude" />
        <TextInput source="name" />
        <TextInput source="session" />
        <TextInput source="type" />
        <NumberInput source="udise" />
      </SimpleForm>
    </Create>
  );
};

export default SchoolCreate;
