import { gql } from "@apollo/client";

export const SubscripeToTopic = gql`
  subscription ($topicName: String!) {
    subscriptionTest(topicName: $topicName)   # coming soon
  }
`;

export const GET_ALL_PROSENERS_QUERY = gql`
  query Query {
  getPrisoners {
    id
    name
    dateOfImprisonment
    authorizedLocations {
      latitude
      longitude
    }
    currentLocations {
      latitude
      longitude
    }
    deviceId
  }
}
`;
