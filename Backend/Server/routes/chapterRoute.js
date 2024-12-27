const express = require('express')
const { PrismaClient } = require('@prisma/client')

const chapterRoutes = express.Router()
const prisma = new PrismaClient()

// All subjects based on class ID
chapterRoutes.get('/all', async (request, response) => {
  const { subjectId } = request.query

  try {
    const chapters = await prisma.chapter.findMany({
      where: { subjectId },
    })

    console.log(chapters)

    response.status(200).json({ message: 'All chapters', chapters })
  } catch (error) {
    console.error(error)
    response.status(500).json({ message: 'Something went wrong, try again!' })
  }
})

module.exports = chapterRoutes
