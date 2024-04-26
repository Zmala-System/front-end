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
  mutation UpdatePrisonerInfo($prisonerInput: PrisonerInput!) {
    updatePrisonerInfo(prisonerInput: $prisonerInput) {
      name
      dateOfImprisonment
      authorizedLocations
      deviceId
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



