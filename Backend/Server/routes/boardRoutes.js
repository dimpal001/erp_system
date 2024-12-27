const express = require('express')
const { PrismaClient } = require('@prisma/client')

const boardRoutes = express.Router()
const prisma = new PrismaClient()

// Register Route to get all board data
boardRoutes.get('/all', async (request, response) => {
  try {
    const boards = await prisma.board.findMany()

    response.status(200).json(boards)
  } catch (error) {
    console.error(error)
    response.status(500).json({ message: 'Server error' })
  }
})

// Route to get all classes of a specific board by boardId
boardRoutes.get('/:boardId/classes', async (request, response) => {
  const { boardId } = request.params

  try {
    const classes = await prisma.class.findMany({
      where: {
        boardId: boardId,
      },
    })

    if (classes.length > 0) {
      response.status(200).json(classes)
    } else {
      response.status(404).json({ message: 'No classes found for this board' })
    }
  } catch (error) {
    console.error(error)
    response.status(500).json({ message: 'Server error' })
  }
})

module.exports = boardRoutes
