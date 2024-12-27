import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

const generateInstituteId = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = ''
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    id += characters[randomIndex]
  }

  const existingInstitute = await prisma.institution.findUnique({
    where: {
      instituteId: id,
    },
  })
  if (existingInstitute) {
    return generateInstituteId()
  }
  return id
}

const generateToken = (institute) => {
  const payload = {
    instituteId: institute.instituteId,
    id: institute.id,
    name: institute.name,
    type: institute.type,
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const resolvers = {
  Mutation: {
    createInstitute: async (
      _,
      { name, type, address, contactEmail, contactPhone, password }
    ) => {
      try {
        if (
          !name ||
          !type ||
          !address ||
          !contactEmail ||
          !contactPhone ||
          !password
        ) {
          throw new Error('Missing required fields')
        }

        if (name.length > 100) {
          throw new Error('Name must be less than 100 characters')
        }
        if (address.length > 255) {
          throw new Error('Address must be less than 255 characters')
        }
        if (type.length > 50) {
          throw new Error('Type must be less than 50 characters')
        }
        if (contactEmail.length > 100) {
          throw new Error('Email must be less than 100 characters')
        }
        if (contactPhone.length > 15) {
          throw new Error('Phone number must be less than 15 characters')
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailPattern.test(contactEmail)) {
          throw new Error('Invalid email format')
        }

        const phonePattern = /^[0-9]{10}$/
        if (!phonePattern.test(contactPhone)) {
          throw new Error('Invalid phone number format')
        }

        const passwordPattern =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/
        if (!passwordPattern.test(password)) {
          throw new Error(
            'Password must be 8-16 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
          )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newId = await generateInstituteId()

        const institute = await prisma.institution.create({
          data: {
            name,
            type,
            address,
            contactEmail,
            contactPhone,
            password: hashedPassword,
            instituteId: newId,
          },
        })

        return {
          id: institute.id,
          name: institute.name,
          type: institute.type,
          address: institute.address,
          contactEmail: institute.contactEmail,
          contactPhone: institute.contactPhone,
          instituteId: institute.instituteId,
        }
      } catch (error) {
        throw new Error(error?.message)
      }
    },

    login: async (_, { instituteId, password }) => {
      try {
        const institute = await prisma.institution.findUnique({
          where: { instituteId },
        })

        if (!institute) {
          throw new Error('No institute found with this ID')
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          institute.password
        )
        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        const token = generateToken(institute)

        return {
          name: institute.name,
          type: institute.type,
          address: institute.address,
          contactEmail: institute.contactEmail,
          contactPhone: institute.contactPhone,
          id: institute.id,
          instituteId: institute.instituteId,
          token,
        }
      } catch (error) {
        throw new Error(error?.message)
      }
    },
  },
}

export default resolvers
