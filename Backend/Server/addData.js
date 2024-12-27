const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const subjectId = 'cm4d7fhz3000xtd6vp0b0dbqh';

const chapters = [
  { name: 'nature and purpose of business' },
  { name: 'forms of business organizations' },
  { name: 'private, public, and global enterprises' },
  { name: 'business services' },
  { name: 'emerging modes of business' },
  { name: 'social responsibility of business and business ethics' },
  { name: 'formation of a company' },
  { name: 'sources of business finance' },
  { name: 'small business' },
  { name: 'internal trade' },
  { name: 'international business' },
];

const seedChapters = async () => {
  try {
    console.log('Seeding chapters for class 11 business studies...');

    for (const chapter of chapters) {
      await prisma.chapter.create({
        data: {
          name: chapter.name,
          subjectId: subjectId,
        },
      });
    }

    console.log('class 11 business studies chapters seeded successfully!');
  } catch (error) {
    console.error('Error seeding chapters:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seedChapters();

