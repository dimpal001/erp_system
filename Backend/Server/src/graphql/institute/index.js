// src/graphql/user/index.js

import typeDefs from './typeDefs.js'
import resolvers from './resolvers.js'
import { getInstituteData, getDepartments } from './queries.js'

export { typeDefs, resolvers, getInstituteData, getDepartments }
