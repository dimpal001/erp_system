const express = require('express')
const { PrismaClient } = require('@prisma/client')

const suggestionRoutes = express.Router()
const prisma = new PrismaClient()

// 10 suggestion route
suggestionRoutes.get('/all', async (request, response) => {
  const { query, subjectId, chapterId } = request.body

  if (!query) {
    return response.status(400).json({ message: 'Query is required!' })
  }

  try {
    const questions = await prisma.question.findMany({
      where: {
        content: {
          contains: query,
          mode: 'insensitive',
        },
        subjectId: subjectId ? subjectId : undefined,
        chapterId: chapterId ? chapterId : undefined,
      },
      take: 10,
    })

    return response.json({ questions })
  } catch (error) {
    console.error(error)
    response.status(500).json({ message: 'Something went wrong, try again!' })
  }
})

module.exports = suggestionRoutes
