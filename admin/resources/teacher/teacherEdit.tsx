import { useEffect, useRef, useState } from "react";
import { client } from "../../api-clients/users-client";
import {
  TextInput,
  ReferenceInput,
  SelectInput,
  ReferenceField,
  useDataProvider,
  useNotify,
  useResourceContext,
  Button,
  TextField,
  FunctionField,
  FormDataConsumer,
  Edit,
  SimpleForm,
  useRedirect,
} from "react-admin";
import { useMutation, useQuery } from "react-query";
import { clientGQL } from "../../api-clients/users-client";
import { ChangePasswordTeacher } from "./ChangePasswordTeacher";
const ApplicationId = "1ae074db-32f3-4714-a150-cc8a370eafd1";

const displayRoles = (a: any) => {
  const registration = a.registrations?.find(
    (r: any) => r.applicationId === ApplicationId
  );
  if (!registration) {
    return <span>-</span>;
  }
  const { roles } = registration;
  return roles.map((role: any, index: number) => {
    return (
      <span
        style={{
          border: "1px solid rgba(224, 224, 224, 1)",
          padding: "5px",
          marginRight: "5px",
          marginBottom: "5px",
        }}
        key={index}
      >
        {role}
      </span>
    );
  });
};
const ChangePasswordButton = ({ record }: any) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const resource = useResourceContext();
  console.log(record); // Not Coming.

  const { mutate, isLoading } = useMutation(
    ["changePassword", record.id],

    () =>
      dataProvider.changePassword(resource, {
        loginId: record.record.username,
        password: resource === "e_samwaad_user" ? "himachal12345" : "1234abcd",
      }),

    {
      onSuccess: (data: any) => {
        notify(data?.data, { type: "success" });
      },
      onError: (error: any) => {
        notify(error.toString(), { type: "error" });
      },
    }
  );
  return (
    <Button
      variant={"contained"}
      sx={{ marginTop: "10px" }}
    // onClick={() => mutate()}
    // disabled={isLoading}
    >
      <>Change Password</>
    </Button>
  );
};

const TeacherEdit = ({ record }: any) => {
  const statusChoices = [
    {
      id: "PENDING",
      name: "Pending", //No Action Taken
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
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const schoolId = useRef<any>();
  const teacherId = useRef<any>();
  const faId = useRef<any>();
  const [faData, setFaData] = useState<any>();
  const udiseValidation = async (value: any) => {
    const res = await dataProvider.getList('school', {
      pagination: { perPage: 1, page: 1 },
      sort: { field: 'id', order: 'asc' },
      filter: { udise: value }
    });

    if (!res?.data?.[0]?.id)
      return "Please enter a valid UDISE";
    schoolId.current = res?.data?.[0]?.id;
    return undefined;
  };

  const onError = (err: any) => {
    if (err.toString() == 'Error: ra.notification.data_provider_error' && schoolId.current && teacherId.current) {
      clientGQL(`
      mutation {
        update_teacher(where: {id: {_eq: ${teacherId.current}}}, _set: {school_id: ${schoolId.current}}) {
          affected_rows
        }
      }
      `)
      if (faData.mobilePhone) {
        client.patch("/admin/updateUser/" + faId, faData);
      }
      notify(`Teacher edited successfully`, { type: 'success' });
      redirect(`/teacher`);
    } else {
      notify(`Unable to update teacher.`, { type: 'error' });
      redirect(`/teacher`);
    }
  }

  const onSuccess = () => {
    if (schoolId.current && teacherId.current)
      clientGQL(`
    mutation {
      update_teacher(where: {id: {_eq: ${teacherId.current}}}, _set: {school_id: ${schoolId.current}}) {
        affected_rows
      }
    }
    `)
    if (faData.mobilePhone) {
      client.patch("/admin/updateUser/" + faId.current, faData);
    }
    notify(`Teacher edited successfully`, { type: 'success' });
    redirect(`/teacher`);
  }

  const getTeacherFromFusionAuth = async () => {
    const result = await dataProvider.getList('e_samwaad_user', {
      pagination: { perPage: 1, page: 1 },
      sort: { field: 'id', order: 'asc' },
      filter: { user_id: faId.current }
    })
    if (result?.data?.[0]) {
      setFaData(result?.data?.[0]);
    } else {
      setFaData([])
    }
  }
  console.log(faData?.firstName)
  useEffect(() => {
    if (!faData && faId.current)
      getTeacherFromFusionAuth();
    return () => { faId.current = null; setFaData(null); schoolId.current = null; teacherId.current = null; }

  }, [])

  return (
    <Edit mutationOptions={{ onError, onSuccess }} mutationMode='pessimistic'>
      <SimpleForm>
        <TextInput disabled source="name" defaultValue={faData?.firstName} />
        <TextInput disabled source="id" />
        <TextInput source="school.name" label="School" disabled />
        <TextInput source="school.udise" label="UDISE" validate={[udiseValidation]} />
        {/* <TextInput source="school.udise" label="UDISE" validate={ } onChange={e => handleUdiseChange(Number(e.target.value))} /> */}
        <SelectInput label="Mode of employment" source="employment" choices={['Contractual', 'Permanent'].map(el => { return { id: el, name: el } })} />
        <TextInput label="Designation" source="designation" disabled />
        <SelectInput label="Account Status" source="account_status" choices={statusChoices} />
        <TextInput source="mobilePhone" defaultValue={faData?.mobilePhone} onChange={e => setFaData({ ...faData, mobilePhone: e.target.value })} />
        <FormDataConsumer>
          {({ formData }) => {
            if (!faId.current)
              faId.current = formData.user_id;
            teacherId.current = formData.id;
            if (faData?.mobilePhone) {
              formData.mobilePhone = faData.mobilePhone;
            }
            return <></>
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Edit>
  );
};
export default TeacherEdit;
