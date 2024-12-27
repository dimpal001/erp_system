const express = require('express')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const otpRoute = express.Router()

const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000)
  return otp
}

// Verify OTP
otpRoute.post('/verify', async (req, res) => {
  const { userId, otp } = req.body
  try {
    const otpRecord = await prisma.otp.findFirst({
      where: { userId, code: otp },
    })

    if (!otpRecord || new Date() > new Date(otpRecord.expiresAt)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    await prisma.otp.delete({
      where: { id: otpRecord.id },
    })

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    })

    res.status(200).json({ message: 'OTP verified successfully' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong, try again!' })
  }
})

// Resend OTP
otpRoute.post('/resend', async (req, res) => {
  const { userId } = req.body
  try {
    const newOtp = generateOtp()
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000)

    await prisma.otp.deleteMany({
      where: { userId },
    })

    await prisma.otp.create({
      data: {
        code: newOtp.toString(),
        userId,
        expiresAt: expirationTime,
      },
    })

    res.status(200).json({ message: 'OTP resent successfully' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong, try again!' })
  }
})

module.exports = otpRoute
