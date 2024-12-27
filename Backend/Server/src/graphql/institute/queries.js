import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const getInstituteData = async (userId) => {
  try {
    const institute = await prisma.institution.findUnique({
      where: {
        id: userId,
      },
    })

    if (!institute) {
      throw new Error('Institute not found')
    }

    return institute
  } catch (error) {
    throw new Error(error.message)
  }
}

const getDepartments = async (institutionId) => {
  console.log(institutionId)
  try {
    const department = await prisma.department.findMany({
      where: {
        institutionId,
      },
      include: {
        institution: true,
      },
    })

    console.log(department)

    if (!department) {
      throw new Error('Department not found')
    }

    return department
  } catch (error) {
    throw new Error(error.message)
  }
}

export { getInstituteData, getDepartments }
