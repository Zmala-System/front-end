import { gql } from "@apollo/client";

export const LOCATION_CHANGED_PRISONER = gql`
  subscription locationChangedPrisoner($deviceId: String!) {
    locationChangedPrisoner(deviceId: $deviceId)
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
