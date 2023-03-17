import gql from "graphql-tag";

// Define the additional fields that we want.
export const EXTENDED_GRADE_ASSESSMENT_RECORD = gql`
  {    
    assessment {
      type
      assessment_type {
        name
        assessment_category {
          name
        }
      }
    }
    school {
        name
        udise
        location {
          block
          cluster
          district
        }
    }
  }
`;
