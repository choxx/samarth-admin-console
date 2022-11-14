import React from "react";
import { DeleteWithConfirmButton, Edit, SaveButton, SimpleForm, Toolbar } from "react-admin";

const EditToolbar = (props: any) => (
  <Toolbar  {...props}>
    <SaveButton sx={{ backgroundColor: "green" }} />
    {props.allowDelete && <DeleteWithConfirmButton sx={{ marginLeft: 5 }} />}
  </Toolbar>
);
const EditWrapper = (props: any) => {
  return (
    <div>
      <Edit className="edit_wrapper" {...props} mutationMode={"pessimistic"}>
        <div className="edit_wrapper_layout">
          <SimpleForm toolbar={<EditToolbar allowDelete={props.allowDelete} />}>
            {props.children}
          </SimpleForm>
        </div>
      </Edit>
    </div>
  );
};

export default EditWrapper;
