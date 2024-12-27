const express = require('express')
const { PrismaClient } = require('@prisma/client')

const questionRoutes = express.Router()
const prisma = new PrismaClient()

// Return questions based on chapter id
questionRoutes.get('/chapter', async (request, response) => {
  const { chapterId } = request.body

  if (!chapterId) {
    return response.status(400).json({ message: 'Chapter ID is required!' })
  }

  try {
    const questions = await prisma.question.findMany({ where: { chapterId } })

    return response.json({ questions })
  } catch (error) {
    console.error(error)
    response.status(500).json({ message: 'Something went wrong, try again!' })
  }
})

// Return questions based on subject id
questionRoutes.get('/subject', async (request, response) => {
  const { subjectId } = request.query

  if (!subjectId) {
    return response.status(400).json({ message: 'Subject ID is required!' })
  }

  try {
    const questions = await prisma.question.findMany({ where: { subjectId } })

    return response.json({ questions })
  } catch (error) {
    console.error(error)
    response.status(500).json({ message: 'Something went wrong, try again!' })
  }
})

module.exports = questionRoutes
