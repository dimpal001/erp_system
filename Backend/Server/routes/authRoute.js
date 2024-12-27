const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const authRoutes = express.Router()
const prisma = new PrismaClient()

const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000)
  return otp
}

// Register Route
authRoutes.post('/register', async (request, response) => {
  const { email, password } = request.body

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return response
        .status(200)
        .json({ message: 'Email is already registered!' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    })

    const otpCode = generateOtp()
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000)

    await prisma.otp.create({
      data: {
        code: otpCode.toString(),
        userId: user.id,
        expiresAt: expirationTime,
      },
    })

    response.status(200).json({
      message: 'OTP has been sent to the registered email address.',
      user,
    })
  } catch (error) {
    console.error(error)
    response.status(500).json({ message: 'Something went wrong, try again!' })
  }
})

// Login Route
authRoutes.post('/login', async (request, response) => {
  const { email, password } = request.body

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })
    if (!user) {
      return response.status(400).json({ message: 'Invalid credentials' })
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return response.status(400).json({ message: 'Invalid credentials' })
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    console.log(user)

    response.status(200).json({ message: 'Login successful', user, token })
  } catch (error) {
    response.status(500).json({ message: 'Server error' })
  }
})

module.exports = authRoutes
