import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($loginAdminInput: LoginAdminInput!) {
    loginAdmin(loginAdminInput: $loginAdminInput) {
      userId
      token
      tokenExpiration
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation RegisterMutation($registerAdminInput: RegisterAdminInput!) {
    registerAdmin(registerAdminInput: $registerAdminInput) {
      userId
      token
      tokenExpiration
    }
  }
`;

export const CREATE_PRISONER_MUTATION = gql`
  mutation createPrisoner($prisonerInput: PrisonerInput!) {
    createPrisoner(prisonerInput: $prisonerInput) {
      id
      name
      dateOfImprisonment
      authorizedLocations {
        latitude
        longitude
      }
      deviceId
    }
  }
`;

export const UPDATE_PRISONER_INFO_MUTATION=gql`
  mutation UpdatePrisonerInfo($DeviceId: String!, $prisonerInput: PrisonerInput!) {
    updatePrisonerInfo(DeviceId: $DeviceId, prisonerInput: $prisonerInput) {
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

export const DELETE_PRISONER_MUTATION=gql`
mutation DeletePrisoner($deviceId: String!) {
  deletePrisoner(deviceId: $deviceId) {
    id
    deviceId
    name
    authorizedLocations {
      latitude
      longitude
    }
    currentLocations {
      latitude
      longitude
    }
    dateOfImprisonment
  }
}
`;



export const ADD_PRISONER_LOCATION_MUTATION=gql`
mutation AddPrisonerLocation($deviceId: String!, $authorizedLocations: [[LocationInput]]) {
  addPrisonerLocation(deviceId: $deviceId, authorizedLocations: $authorizedLocations) {
    id
    deviceId
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
  }
}
`;


