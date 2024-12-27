const typeDefs = `
  type Institute {
    id: String!
    name: String!
    type: String!
    address: String!
    contactEmail: String!
    contactPhone: String!
    instituteId: String!
  }

  type Department {
    id: String!
    name: String!
    institution: Institute!
  }

  type Query {
    getInstituteData: Institute
    getDepartments(institutionId: String!): [Department]
  }
`

export default typeDefs
