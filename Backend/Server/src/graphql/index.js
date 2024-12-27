import { ApolloServer } from '@apollo/server'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { mergeResolvers } from '@graphql-tools/merge'

import {
  typeDefs as authTypeDefs,
  resolvers as authResolvers,
} from './auth/index.js'
import {
  typeDefs as instituteTypeDefs,
  resolvers as instituteResolvers,
} from './institute/index.js'

const typeDefs = mergeTypeDefs([authTypeDefs, instituteTypeDefs])
const resolvers = mergeResolvers([authResolvers, instituteResolvers])

const myApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  await server.start()

  return server
}

export default myApolloServer
