const express = require('express')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const userRoute = express.Router()

const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000)
  return otp
}

// POST create a new user
userRoute.post('/update-user', async (request, response) => {
  const { fullName, boardId, classId, userId } = request.body
  try {
    if (!fullName || !boardId || !classId || !userId) {
      response.status(404).json({ message: 'All fields are required!' })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { fullName: fullName, boardId: boardId, classId: classId },
    })

    response.status(200).json({ message: 'User data has been updated' })
  } catch (error) {
    console.log(error)
    response.status(500).json({ message: 'Something went wrong, try again!' })
  }
})

module.exports = userRoute
