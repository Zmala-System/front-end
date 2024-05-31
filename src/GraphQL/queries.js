import { gql } from "@apollo/client";

export const SubscripeToTopic = gql`
  subscription LocationChangedPrisoner($deviceId: String!) {
    locationChangedPrisoner(deviceId: $deviceId) {
      id
      name
    }
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
    }
  }
`;
