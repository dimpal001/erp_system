import { getInstituteData, getDepartments } from './queries.js'

const resolvers = {
  Query: {
    getInstituteData: async (_, __, { user }) => {
      if (!user) {
        throw new Error('Unauthorized access')
      }

      return getInstituteData(user.id)
    },

    getDepartments: async (_, { institutionId }, { user }) => {
      if (!user) {
        throw new Error('Unauthorized access')
      }

      return getDepartments(institutionId)
    },
  },
}

export default resolvers
