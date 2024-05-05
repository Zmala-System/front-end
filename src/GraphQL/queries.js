import { gql } from "@apollo/client";

export const SubscripeToTopic = gql`
  subscription ($topicName: String!) {
    subscriptionTest(topicName: $topicName) # coming soon
  }
`;

export const GET_ALL_PRISONERS_QUERY = gql`
  query GetPrisoners {
    getPrisoners {
      id
      name
      deviceId
    }
  }
`;
