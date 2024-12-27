const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')
const morgan = require('morgan')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { gql } = require('graphql-tag')

// Import routes for REST APIs
const userRoutes = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')
const settingsRoute = require('./routes/settingsRoute')
const boardRoutes = require('./routes/boardRoutes')
const subjectRoutes = require('./routes/subjectRoutes')
const chapterRoutes = require('./routes/chapterRoute')
const otpRoutes = require('./routes/otpRoute')
const suggestionRoutes = require('./routes/suggestionRoutes')
const questionRoutes = require('./routes/questionRoutes')
const answerRoutes = require('./routes/answerRoutes')

dotenv.config()
const app = express()
const PORT = 3000

// Middleware for parsing and CORS
app.use(bodyParser.json())
app.use(cors())

// Morgan Logging Middleware with Colorize
morgan.token('status-color', (req, res) => {
  const statusCode = res.statusCode
  if (statusCode >= 200 && statusCode < 300) {
    return `\x1b[32m${statusCode}\x1b[0m` // Green
  } else if (statusCode >= 400 && statusCode < 500) {
    return `\x1b[31m${statusCode}\x1b[0m` // Red
  } else if (statusCode >= 500) {
    return `\x1b[41m${statusCode}\x1b[0m` // Red background
  }
  return statusCode
})
app.use(morgan(':method :url :status-color - :response-time ms'))

// Custom Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// Define GraphQL Schema
const typeDefs = gql`
  type Query {
    hello: String
  }

  type Mutation {
    createQuestion(question: String!): String
  }
`

// Define GraphQL Resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
  },
  Mutation: {
    createQuestion: async (_, { question }) => {
      // Logic to add the question to your database
      console.log(`Received question: ${question}`)
      return `Question "${question}" saved successfully!`
    },
  },
}

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Start Apollo Server and integrate it with Express
;(async () => {
  await server.start()
  app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server))

  // Use REST API routes
  app.use('/api/user', userRoutes)
  app.use('/api/auth', authRoute)
  app.use('/api/settings', settingsRoute)
  app.use('/api/board', boardRoutes)
  app.use('/api/subject', subjectRoutes)
  app.use('/api/chapter', chapterRoutes)
  app.use('/api/otp', otpRoutes)
  app.use('/api/suggestion', suggestionRoutes)
  app.use('/api/question', questionRoutes)
  app.use('/api/answer', answerRoutes)

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
      status: 'failure',
      message: 'Something went wrong!',
    })
  })

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    console.log(
      `GraphQL playground available at http://localhost:${PORT}/graphql`
    )
  })
})()
