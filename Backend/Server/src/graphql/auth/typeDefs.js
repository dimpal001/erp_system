const typeDefs = `
  type Query {
    _: Boolean
  }

  type Mutation {
    createInstitute(
      name: String!,
      type: String!,
      address: String!,
      contactEmail: String!,
      contactPhone: String!,
      password: String!
    ): AuthResponse

    login(
      instituteId: String!,
      password: String!
    ): AuthResponseWithToken
  }

  type AuthResponse {
    name: String!,
    type: String!,
    address: String!,
    contactEmail: String!,
    contactPhone: String!,
    id: String!,
    instituteId: String!
  }

  type AuthResponseWithToken {
    name: String!,
    type: String!,
    address: String!,
    contactEmail: String!,
    contactPhone: String!,
    id: String!,
    instituteId: String!,
    token: String!
  }
`
export default typeDefs
