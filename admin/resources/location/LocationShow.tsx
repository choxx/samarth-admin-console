import React from "react";
import { FunctionField, Show, SimpleShowLayout, TextField } from "react-admin";
import InputFlexWrapper from "../../StyleWrappers/InputFlexWrapper/InputFlexWrapper";
import ShowWrapper from "../../StyleWrappers/ShowWrapper/ShowWrapper";
import DownLabledInput from "../../components/utilities/DownLabledInput/DownLabledInput";

const LocationShow = () => {
  return (
    <ShowWrapper
      show={{
        val: "",
      }}
      simpleShowProp={{
        val: "",
      }}
    >
      <FunctionField
        render={(record: any) => {
          return (
            <>
              <InputFlexWrapper>
                <DownLabledInput i={record.id} label="Id" />
                <DownLabledInput i={record.district} label="District" />
                <DownLabledInput i={record.block} label="Block" />
                <DownLabledInput i={record.cluster} label="Cluster" />
              </InputFlexWrapper>
            </>
          );
        }}
      />
    </ShowWrapper>
  );
};

export default LocationShow;
