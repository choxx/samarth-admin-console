import {
  useNotify,
  Labeled,
  Edit,
  SimpleForm,
  FunctionField,
  TextInput,
  useRecordContext,
  useDataProvider,
  useResourceContext,
  useRedirect,
  useRefresh,
  useGetList,
  required,
  number,
  regex,
  minLength,
  maxLength,
  SelectArrayInput,
  SelectInput,
  NumberInput,
  ReferenceInput,
  Toolbar,
  SaveButton,
  useTheme,
} from "react-admin";
import { designationESamwaad, designationLevels } from "./designation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, MenuItem, Select, Typography } from "@mui/material";
import { useMutation, useQuery } from "react-query";
import { useController } from "react-hook-form";
import { useParams } from "react-router-dom";
import { ChangePasswordButton } from "../ChangePasswordButton";

const ApplicationId = "f0ddb3f6-091b-45e4-8c0f-889f89d4f5da";

const displayRoles = (a: any) => {
  const registration = a.registrations?.find(
    (r: any) => r.applicationId === ApplicationId
  );
  if (!registration) {
    return <span>-</span>;
  }
  const { roles } = registration;
  return roles?.map((role: any, index: number) => {
    return (
      <span
        style={{
          padding: "0.5rem 2rem",
          margin: "0rem 1rem 1rem 0rem",
          color: "#fff",
          borderRadius: "0.5rem",
          background: `${role == "Teacher" ? '#2A8E82' : role == "Principal" ? "#3E766D" : "#668E86"}`,
          display: "inline-block",
          fontSize: '1rem'
        }}
        key={index}
      >
        {role}
      </span>
    );
  });
};

export const SchoolUDISEInput = () => {
  const dataProvider = useDataProvider();
  const record = useRecordContext();
  const [value, setValue] = useState(record?.data?.udise);
  const resource = useResourceContext();
  const { data, isLoading, refetch } = useQuery(
    ["getSchoolByUDISE", record.id],
    () => dataProvider.getSchoolByUDISE(resource, value)
  );
  const i = useController({ name: "data.school" });
  useEffect(() => {
    refetch(value);
  }, [value]);
  useEffect(() => {
    i.field.onChange(data?.data?.id);
  }, [data]);
  return (
    <div style={{ marginTop: "20px", minWidth: "300px" }}>
      <Typography>
        {data?.data?.name
          ? `School: ${data?.data?.name}`
          : isLoading
            ? "Loading..."
            : "No School"}
      </Typography>
      <TextInput
        source={"data.udise"}
        label="UDISE"
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
};

// Input dropdown choices
const inputChoices = {
  designations: designationESamwaad.map((el) => {
    return { id: el.designation, name: el.designation };
  }),
  accountStatuses: ["ACTIVE", "DEACTIVATED", "PENDING", "REJECTED"].map(
    (el) => {
      return { id: el, name: el };
    }
  ),
  roles: ["Teacher", "Principal", "school"].map((el) => {
    return { id: el, name: el };
  }),
  employment: ["Permanent", "Contractual"].map((el) => {
    return { id: el, name: el };
  }),
};

// const SchoolModeUserForm = ({ record }: any) => {
//   return (
//     <>
//       <TextInput source="username" disabled={true} />
//       <TextInput source="firstName" label="Full Name" validate={inputConstraints.fullName} />
//       <TextInput source="mobilePhone" label="Mobile Phone" validate={inputConstraints.mobile} />
//       <SelectArrayInput source="roles" label="Roles" choices={inputChoices.roles} />
//       {/* <Labeled label="Roles">
//         <FunctionField
//           label="Role"
//           render={(record: any) => {
//             return DisplayRoles(record);
//           }}
//         />
//       </Labeled> */}

//       <SchoolUDISEInput />
//       <ChangePasswordButton record={record} />
//     </>
//   );
// };

// export const GQLForm = () => {
//   const record = useRecordContext();
//   const { data, isLoading, error, refetch } = useGetList("teacher", {
//     filter: { user_id: record.id },
//   });
//   console.log({ data });
//   const [designation, setDesignation] = useState("");
//   const [accountStatus, setAccountStatus] = useState("");
//   const [employment, setEmployment] = useState("");
//   useEffect(() => {
//     if (data?.length) {
//       console.log({ data });
//       setDesignation(data?.[0]?.designation);
//       setAccountStatus(data?.[0]?.account_status);
//       setEmployment(data?.[0]?.employment);
//       designationInput.field.onChange(data?.[0]?.designation);
//       accountStatusInput.field.onChange(data?.[0]?.account_status);
//       employmentStatusInput.field.onChange(data?.[0]?.employment);
//     }
//   }, [data]);
//   const designationInput = useController({ name: "designation" });
//   const accountStatusInput = useController({ name: "account_status" });
//   const employmentStatusInput = useController({ name: "employment" });

//   return (
//     <div>
//       <div style={{ marginTop: "20px", minWidth: "300px" }}>
//         <Labeled label={"Designation"}>
//           <Select
//             value={designation}
//             style={{ minWidth: "300px" }}
//             onChange={(e) => {
//               setDesignation(e.target.value);
//               designationInput.field.onChange(e.target.value);
//             }}
//           >
//             {designationESamwaad.map((d, index) => {
//               return (
//                 <MenuItem value={d.designation} key={index}>
//                   {d.designation}
//                 </MenuItem>
//               );
//             })}
//           </Select>
//         </Labeled>
//       </div>
//       <div style={{ marginTop: "20px", minWidth: "300px" }}>
//         <Labeled label={"Mode of Employment"}>
//           <Select
//             value={employment}
//             style={{ minWidth: "300px" }}
//             onChange={(e) => {
//               setEmployment(e.target.value);
//               employmentStatusInput.field.onChange(e.target.value);
//             }}
//           >
//             {["Permanent", "Contractual"].map((d, index) => {
//               return (
//                 <MenuItem value={d} key={index}>
//                   {d}
//                 </MenuItem>
//               );
//             })}
//           </Select>
//         </Labeled>
//       </div>
//       <div style={{ marginTop: "20px", minWidth: "300px" }}>
//         <Labeled label={"Account Status"}>
//           <Select
//             value={accountStatus}
//             style={{ minWidth: "300px" }}
//             onChange={(e) => {
//               setAccountStatus(e.target.value);
//               accountStatusInput.field.onChange(e.target.value);
//             }}
//           >
//             {["ACTIVE", "DEACTIVATED", "PENDING", "REJECTED"].map(
//               (d, index) => {
//                 return (
//                   <MenuItem value={d} key={index}>
//                     {d}
//                   </MenuItem>
//                 );
//               }
//             )}
//           </Select>
//         </Labeled>
//       </div>
//     </div>
//   );
// };
// const NonSchoolModeUserForm = (record: any) => {
//   return (
//     <>
//       <TextInput source="username" disabled={true} />
//       <TextInput source="firstName" label="Full Name" />
//       <SelectArrayInput source="roles" label="Roles" choices={inputChoices.roles} />
//       <TextInput source="mobilePhone" label="Mobile Phone" />
//       {/* <Labeled label="Roles">
//         <FunctionField
//           label="Role"
//           render={(record: any) => DisplayRoles(record)}
//         />
//       </Labeled> */}
//       <GQLForm />
//       <SchoolUDISEInput />
//       <ChangePasswordButton record={record} />
//     </>
//   );
// };
const UserForm = (props: any) => {
  const { schoolId, setExtraState } = props;
  const record = useRecordContext();
  const [theme] = useTheme();
  const [state, setState] = useState<any>({
    // Here we are putting only the index where user is registered in Shiksha.
    roles:
      record?.registrations?.[
        record?.registrations?.findIndex(
          (user: { applicationId: string }) =>
            user.applicationId == ApplicationId
        )
      ]?.roles,
  });
  const dataProvider = useDataProvider();
  useEffect(() => {
    dataProvider.getList("teacher", {
      pagination: { perPage: 1, page: 1 },
      sort: { field: "id", order: "asc" },
      filter: { user_id: record.id },
    }).then(res => {
      console.log(res.data)
      if (res?.data?.length > 0) {
        schoolId.current = res.data[0].school_id;
        setState({ ...state, designation: res.data[0].designation, accountStatus: res.data[0].account_status, modeOfEmployment: res.data[0].employment })
        setExtraState({ designation: res.data[0].designation, accountStatus: res.data[0].account_status, modeOfEmployment: res.data[0].employment })
      }
    })
  }, [])

  const udiseValidation = async (value: any) => {
    const res = await dataProvider.getList("school", {
      pagination: { perPage: 1, page: 1 },
      sort: { field: "id", order: "asc" },
      filter: { udise: value },
    });
    const schoolID = res?.data?.[0]?.id;
    if (!schoolID)
      return "Please enter a valid UDISE";

    schoolId.current = res.data[0].id;
    if (record?.registrations?.filter((el: any) => el.applicationId == ApplicationId)?.[0]?.roles.includes("school")) {
      const userRes = await dataProvider.getUserByUdise("e_samwaad_user", { id: state.udise });
      // console.log(schoolID, userRes.data);
      if (userRes?.data?.length)
        return "Cannot register more than one school user for this UDISE"
    }
    return undefined;
  };

  const designationValidation = async (value: any) => {
    if (!state.designation && !value) {
      return "Please select a designation";
    }
    return undefined;
  };
  const accStatusValidation = async (value: any) => {
    if (!state.accountStatus && !value)
      return "Please select account status";
    return undefined;
  };
  const employmentValidation = async (value: any) => {
    if (!state.accountStatus && !value)
      return "Please select employment type";
    return undefined;
  };

  // Input Constraints
  const inputConstraints = {
    userName: [
      required("Please provide username"),
      regex(/^[a-zA-Z0-9 ]*$/, "Name can only contain alphabets, numbers and spaces")
    ],
    udise: [
      required("Please provide UDISE"),
      number("The UDISE must be numeric"),
      udiseValidation,
    ],
    fullName: [
      required("Please provide fullname"),
      regex(
        /^[a-zA-Z0-9 ]*$/,
        "Name can only contain alphabets, numbers and spaces"
      ),
    ],
    mobile: [
      required("Please provide mobile number"),
      regex(/^\d+$/, "The phone number must be numeric"),
      minLength(10, "Mobile cannot be less than 10 digits"),
      maxLength(10, "Mobile cannot be more than 10 digits"),
    ],
    role: required("Please select a role"),
    designation: [designationValidation],
    accountStatus: [accStatusValidation],
    modeOfEmployment: [employmentValidation]
  };
  return (
    <>
      <TextInput
        onChange={(e) => setState({ ...state, userName: e.target.value })}
        source="username"
        label="User Name"
        disabled
        validate={inputConstraints.userName}
      />
      <TextInput
        onChange={(e) => setState({ ...state, fullName: e.target.value })}
        source="firstName"
        label="Name"
        validate={inputConstraints.fullName}
      />
      <TextInput
        onChange={(e) => setState({ ...state, mobile: e.target.value })}
        source="mobilePhone"
        label="Mobile Phone"
        validate={inputConstraints.mobile}
      />
      <FunctionField
        label="Role"
        render={() => {
          return (
            <span>
              {displayRoles(record)}
            </span>
          )
        }}
      />
      {/* <SelectArrayInput
        onChange={(e) => setState({ ...state, roles: e.target.value })}
        source="roles"
        defaultValue={record?.registrations?.[0].roles}
        choices={inputChoices.roles}
        label="Roles"
        validate={inputConstraints.role}

      /> */}

      {state.roles &&
        (state.roles.includes("Principal") ||
          state.roles.includes("Teacher")) && (
          <>
            <FunctionField
              render={(record: any) => {
                return <div style={{ position: 'relative' }}>
                  {!state.designationNew && state.designation && <div style={{ position: 'absolute', zIndex: 999, top: 9, left: 5, background: `${theme?.palette?.mode == 'dark' ? '#1d1d1d' : '#f5f5f5'}`, width: '80%', height: '50%', }}>
                    <div style={{ color: `${theme?.palette?.mode == 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.7)'}`, fontSize: '0.8rem', margin: '5px 0px 0px 5px' }}>Designation*</div>
                    <p style={{ color: `${theme?.palette?.mode == 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)'}`, fontSize: 16, margin: '0px 0px 0px 4px' }}>{state.designation}</p>
                  </div>}
                  <SelectInput
                    value={state.designation}
                    onChange={(e: any) =>
                      setState({ ...state, designationNew: e.target.value })
                    }
                    sx={{ width: '13.5rem !important', }}
                    source="designation"
                    label="Designation"
                    choices={inputChoices.designations}
                    validate={inputConstraints.designation}
                  />
                </div>
              }}
            />

            <FunctionField
              render={(record: any) => {
                return <div style={{ position: 'relative' }}>
                  {!state.accountStatusNew && state.accountStatus && <div style={{ position: 'absolute', zIndex: 999, top: 9, left: 5, background: `${theme?.palette?.mode == 'dark' ? '#1d1d1d' : '#f5f5f5'}`, width: '80%', height: '50%', }}>
                    <div style={{ color: `${theme?.palette?.mode == 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.7)'}`, fontSize: '0.8rem', margin: '5px 0px 0px 5px' }}>Account Status*</div>
                    <p style={{ color: `${theme?.palette?.mode == 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)'}`, fontSize: 16, margin: '0px 0px 0px 4px' }}>{state.accountStatus}</p>
                  </div>}
                  <SelectInput
                    value={state.accountStatus}
                    onChange={(e: any) =>
                      setState({ ...state, accountStatusNew: e.target.value })
                    }
                    sx={{ width: '13.5rem !important', }}
                    source="account_status"
                    label="Account Status"
                    choices={inputChoices.accountStatuses}
                    validate={inputConstraints.accountStatus}
                  />
                </div>
              }}
            />
            <FunctionField
              render={() => {
                return <div style={{ position: 'relative' }}>
                  {!state.modeOfEmploymentNew && state.modeOfEmployment && <div style={{ position: 'absolute', zIndex: 999, top: 9, left: 5, background: `${theme?.palette?.mode == 'dark' ? '#1d1d1d' : '#f5f5f5'}`, width: '80%', height: '50%', }}>
                    <div style={{ color: `${theme?.palette?.mode == 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.7)'}`, fontSize: '0.7rem', margin: '5px 0px 0px 5px' }}>Mode of employment*</div>
                    <p style={{ color: `${theme?.palette?.mode == 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)'}`, fontSize: 16, margin: '0px 0px 0px 4px' }}>{state.modeOfEmployment}</p>
                  </div>}
                  <SelectInput
                    value={state.modeOfEmployment}
                    onChange={(e: any) =>
                      setState({ ...state, modeOfEmploymentNew: e.target.value })
                    }
                    source="mode_of_employment"
                    sx={{ width: '13.5rem !important', }}
                    label="Mode of employment"
                    validate={inputConstraints.modeOfEmployment}
                    choices={inputChoices.employment}
                  />
                </div>
              }}
            />
          </>
        )}
      <TextInput
        onChange={(e) => setState({ ...state, udise: e.target.value })}
        source="data.udise"
        label="School UDISE"
        validate={inputConstraints.udise}
        defaultValue={record?.data?.udise}
      />

      <ChangePasswordButton record={record}></ChangePasswordButton>
      <br></br>
      <br></br>
    </>
  );
  // const roles = useMemo(() => {
  //   if (record?.registrations) {
  //     const registration = record.registrations?.find(
  //       (r: any) => r.applicationId === ApplicationId
  //     );
  //     return registration?.roles;
  //   }
  //   return null;
  // }, [record]);
  // const schoolMode = useMemo(() => {
  //   if (roles?.length === 1) {
  //     return !!roles
  //       ?.map((r: string) => r.toLowerCase())
  //       .find((r: string) => r === "school");
  //   }
  //   return false;
  // }, [roles]);
  // if (schoolMode) return <SchoolModeUserForm record={record} />;
  // return <NonSchoolModeUserForm record={record} />;
};

const UserEditToolbar = (props: any) => (
  <Toolbar {...props}>
    <SaveButton sx={{ backgroundColor: "green" }} />
  </Toolbar>
);

const UserEdit = () => {
  const notify = useNotify();
  const resource = useResourceContext();
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const params = useParams();
  const refresh = useRefresh();
  const schoolId = useRef<any>();
  const [extraState, setExtraState] = useState<any>({});
  const { mutate, isLoading } = useMutation(
    ["updateUser", params.id],
    (value) => dataProvider.updateUser(resource, value),
    {
      onSuccess: (data: any) => {
        refresh();
        redirect("/" + resource);
      },
      onError: (error: any) => {
        notify(error.toString(), { type: "error" });
      },
    }
  );

  return (
    <Edit>
      <SimpleForm
        toolbar={<UserEditToolbar />}
        onSubmit={(values) => {
          const _v: any = {
            mobilePhone: values["mobilePhone"],
            firstName: values["firstName"],
            fullName: values["firstName"],
            data: {
              phone: values["mobilePhone"],
              accountName: values["firstName"],
              school: schoolId.current,
              udise: values?.data.udise,
            },
            designation: values.designation ? values.designation : extraState.designation,
            id: values.id,
            account_status: values.account_status ? values.account_status : extraState.accountStatus,
            employment: values.mode_of_employment ? values.mode_of_employment : extraState.modeOfEmployment,
          };
          _v["gql"] = {
            designation: _v.designation ? _v.designation : extraState.designation,
            cadre: _v.designation ? _v.designation : extraState.designation,
            school_id: values?.data.school,
            account_status: _v.account_status ? _v.account_status : extraState.accountStatus,
            employment: _v.employment ? _v.employment : extraState.modeOfEmployment,
          };
          _v['hasuraMutations'] = [
            {
              applicationId: 'f0ddb3f6-091b-45e4-8c0f-889f89d4f5da',
              mutation: "updateTeacherDesignationSchoolStatusAndEmployment",
              payload: {
                user_id: values.id,
                account_status: values.account_status ? values.account_status : extraState.accountStatus || "",
                employment: values.mode_of_employment ? values.mode_of_employment : extraState.modeOfEmployment || "",
                designation: values.designation ? values.designation : extraState.designation || "",
                cadre: values.designation ? values.designation : extraState.designation || "",
                school_id: schoolId.current
              }
            }
          ]
          console.log(_v)
          mutate(_v);
          notify(`User updated successfully`, { type: "success" });
        }}
      >
        <UserForm schoolId={schoolId} setExtraState={setExtraState} />
      </SimpleForm>
    </Edit>
  );
};
export default UserEdit;
