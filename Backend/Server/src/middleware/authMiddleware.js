import jwt from 'jsonwebtoken'

export const authMiddleware = (req) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    throw new Error('Authorization header is missing')
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
  } catch (err) {
    throw new Error('Invalid or expired token')
  }
}
