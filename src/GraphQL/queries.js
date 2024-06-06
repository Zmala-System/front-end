import { gql } from "@apollo/client";

export const LOCATION_CHANGED_PRISONER = gql`
  subscription locationChangedPrisoner {
    locationChangedPrisoner
  }
`;
export const GET_ALL_PRISONERS_QUERY = gql`
  query GetPrisoners {
    getPrisoners {
      id
      name
      deviceId
      dateOfImprisonment
      authorizedLocations {
        latitude
        longitude
      }
      currentLocations {
        latitude
        longitude
      }
      battery
      alerts
    }
  }
`;
