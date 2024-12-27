const express = require('express')
const { PrismaClient } = require('@prisma/client')

const subjectRoutes = express.Router()
const prisma = new PrismaClient()

// All subjects based on class ID
subjectRoutes.get('/all', async (request, response) => {
  const { classId } = request.query

  try {
    const subjects = await prisma.subject.findMany({
      where: { classId },
    })

    console.log(subjects)

    response.status(200).json({ message: 'All subjects', subjects })
  } catch (error) {
    console.error(error)
    response.status(500).json({ message: 'Something went wrong, try again!' })
  }
})

module.exports = subjectRoutes
