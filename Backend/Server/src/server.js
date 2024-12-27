import express from 'express'
import { expressMiddleware } from '@apollo/server/express4'
import myApolloServer from './graphql/index.js'
import jwt from 'jsonwebtoken'

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

async function init() {
  const app = express()
  const PORT = process.env.PORT || 4000

  app.use(express.json())

  app.get('/', (req, res) => {
    res.json({ message: `Server is running on ${PORT}` })
  })

  const server = await myApolloServer()

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        try {
          const token = req.headers['token']
          if (!token) {
            throw new Error('Authorization token required')
          }

          const user = verifyToken(token)
          console.log('Decoded user:', user)
          return { user }
        } catch (error) {
          console.error('Context error:', error.message)
          throw new Error('Unauthorized access')
        }
      },
    })
  )

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

init()
