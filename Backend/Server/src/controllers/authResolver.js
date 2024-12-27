const { loginUser } = require('../controllers/authController')

const resolvers = {
  Mutation: {
    loginUser: async (_, { email, password }) => {
      return await loginUser(email, password)
    },
  },
}

module.exports = resolvers
