const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('User not found')

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new Error('Invalid password')

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  })

  return { token, user }
}

module.exports = { loginUser }
