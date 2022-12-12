import {
  TextInput,
  useDataProvider,
  BooleanInput,
  regex,
  SelectInput,
  FunctionField,
  ReferenceInput,
  useNotify,
  useRedirect,
  Edit,
  SimpleForm,
  Toolbar,
  SaveButton,
  FormDataConsumer
} from "react-admin";
import EditWrapper from "../../components/styleWrappers/EditWrapper";
import { streams_choices } from "./StudentStreams";
import { useQuery } from "react-query";
import { useMemo, useState, useEffect, useRef } from "react";
import * as _ from "lodash";
import CustomTextField from "../../components/styleWrappers/CustomTextField";
import { clientGQL } from "../../api-clients/users-client";

const categoryMap: any = {
  "OT": "Other",
  "GE": "General",
  "SC": "Scheduled Cast",
  "OB": "Other Backward Class",
  "ST": "Scheduled Tribes"
}

// const streamMap: any = {
//   1: "first",
//   2: "second",
//   3: "third",
//   4: "fourth",
//   5: "fifth",
//   6: "sixth",
//   7: "seventh",
//   8: "eigth",
//   9: "ninth",
//   10: "tenth",
//   11: "Arts",
//   12: "Arts"
// }

const StudentEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const {
    data: _studentData,
    isLoading,
    error,
  } = useQuery(["student", "getList", {}], () =>
    dataProvider.getList("student", {
      pagination: { perPage: 10000, page: 1 },
      sort: { field: "id", order: "asc" },
      filter: {},
    })
  );

  const {
    data: _schoolData,
  } = useQuery(["sschool", "getList", {}], () =>
    dataProvider.getList("school", {
      pagination: { perPage: 10000, page: 1 },
      sort: { field: "id", order: "asc" },
      filter: {},
    })
  );

  const studentData = useMemo(() => {
    return _studentData?.data;
  }, [_studentData]);

  const category = useMemo(() => {
    if (!studentData) {
      return [];
    }
    return _.uniqBy(studentData, "category").map((a) => {
      return {
        id: a.category,
        name: categoryMap[a.category],
      };
    });
  }, [studentData]);

  const sections = useMemo(() => {
    if (!studentData) {
      return [];
    }
    return _.uniqBy(studentData, "section").map((a) => {
      return {
        id: a.section,
        name: a.section,
      };
    });
  }, [studentData])

  const firstRender = useRef(true);
  const [schoolName, setSchoolName] = useState("");
  const [udise, setUdise] = useState(0);
  const studentId = useRef();
  const schoolId = useRef();
  const [reRender, setReRender] = useState(false);
  const fetchSchoolData = async (udise: any) => {
    return await dataProvider.getList('school', {
      pagination: { perPage: 10000, page: 1 },
      sort: { field: 'id', order: 'asc' },
      filter: { udise: udise }
    })
  }

  useEffect(() => {
    fetchSchoolData(udise).then(res => {
      if (res?.data?.[0]?.name) {
        setSchoolName(res?.data?.[0]?.name);
        schoolId.current = res?.data?.[0].id;
      } else {
        setSchoolName("Invalid UDISE");
        schoolId.current = undefined;
      }
    })
  }, [udise])

  const validateName = (value: any) => {
    if (/[\u0900-\u097F]/.test(value))
      return undefined;
    if (!(/^([A-Za-z\s/]*)$/.test(value)))
      return "Name should contain only letters, spaces and slashes.";
    return undefined;
  };
  // const validateMotherName = regex(/^([A-Za-z\s/]*)$/, 'Mother Name should contain only letters, spaces and slashes.');
  const grade = () => {
    let grades = [];
    for (let i = 1; i <= 12; i++) {
      grades[i] = { id: i, name: i };
    }
    return grades;
  }

  const onError = (err: any) => {
    if (err.toString() == 'Error: ra.notification.data_provider_error' && schoolId.current && studentId.current) {
      clientGQL(`
      mutation {
        update_student(where: {id: {_eq: ${studentId.current}}}, _set: {school_id: ${schoolId.current}}) {
          affected_rows
        }
      }
      `)
      notify(`Student updated successfully`, { type: 'success' });
      redirect(`/student`);
    } else {
      notify(`Unable to update student.`, { type: 'error' });
      redirect(`/student`);
    }
  }

  const onSuccess = () => {
    if (studentId.current && schoolId.current)
      clientGQL(`
      mutation {
        update_student(where: {id: {_eq: ${studentId.current}}}, _set: {school_id: ${schoolId.current}}) {
          affected_rows
        }
      }
      `)
    notify(`Student updated successfully`, { type: 'success' });
    redirect(`/student`);
  }

  console.log(studentId.current, schoolId.current);

  // const forceRender = () => {
  //   setReRender(true);
  //   setTimeout(() => {
  //     setReRender(false);
  //   }, 100)
  // }

  return (
    <Edit mutationMode="pessimistic" mutationOptions={{ onSuccess, onError }}>
      <SimpleForm toolbar={<EditToolbar />}>
        <span>Student Details</span>
        <TextInput source="id" disabled />
        <TextInput source="name" validate={[validateName]} />
        <FunctionField
          render={(record: any) => {
            return (
              <CustomTextField label="School Name" i={schoolName} customStyle={{ marginBottom: "15px", minWidth: "13rem", height: "3rem" }} />
            )
          }} />
        <FunctionField
          render={(record: any) => {
            useEffect(() => {
              if (firstRender.current) {
                setUdise(record?.school?.udise);
                firstRender.current = false;
                return;
              }
            })
            return (
              <TextInput source="school.udise" label="UDISE" onChange={e => {
                setUdise(Number(e.target.value));
              }} />
            )
          }} />
        <TextInput source="father_name" validate={[validateName]} />
        <TextInput source="mother_name" validate={[validateName]} />
        <SelectInput source="gender" choices={[{ id: "M", name: "M" }, { id: "F", name: "F" }, { id: "N", name: "N" }]} />
        <SelectInput source="grade_number" choices={grade()} />
        {!reRender && <SelectInput source="stream_tag" choices={streams_choices} />}
        <SelectInput source="section" choices={sections} />
        <TextInput source="phone" />
        <SelectInput source="category" choices={category} />
        <BooleanInput source="is_cwsn" />
        <BooleanInput source="is_enabled" />
        <FunctionField render={(record: any) => { studentId.current = record.id; return <></> }} />
        {/* {reRender && <FormDataConsumer>
          {({ formData }) => {
            formData.stream_tag = streamMap[Number(formData.grade_number)]
            return <></>
          }}
        </FormDataConsumer>} */}
      </SimpleForm>
    </Edit>
  );
};

const EditToolbar = (props: any) => (
  <Toolbar  {...props}>
    <SaveButton sx={{ backgroundColor: "green" }} />
  </Toolbar>
);

export default StudentEdit;
