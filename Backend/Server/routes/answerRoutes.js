const express = require('express')
const { PrismaClient } = require('@prisma/client')

const answerRoutes = express.Router()
const prisma = new PrismaClient()

// Return answer based on question id
answerRoutes.get('/', async (request, response) => {
  const { questionId } = request.query

  if (!questionId) {
    return response.status(400).json({ message: 'Question ID is required!' })
  }

  try {
    const answer = await prisma.answer.findFirst({ where: { questionId } })

    return response.json({ answer })
  } catch (error) {
    console.error(error)
    response.status(500).json({ message: 'Something went wrong, try again!' })
  }
})

module.exports = answerRoutes
