import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.news.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alice Rahman',
        email: 'alice@example.com',
        password: hashedPassword,
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Karim Hossain',
        email: 'karim@example.com',
        password: hashedPassword,
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Nusrat Jahan',
        email: 'nusrat@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Mrinmoy Poit',
        email: 'mrinmoy@gmail.com',
        password: hashedPassword,
        role: 'USER',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create news articles
  const news1 = await prisma.news.create({
    data: {
      title: 'Local Startup Wins Innovation Award',
      body: 'A Dhaka-based startup has won an international innovation award for AI-driven solutions. The company has been recognized for its groundbreaking work in artificial intelligence and machine learning technologies that are transforming industries across South Asia.',
      authorId: users[1].id, // Karim
    },
  });

  const news2 = await prisma.news.create({
    data: {
      title: 'Breaking: Major Tech Conference Announced',
      body: 'The biggest technology conference in South Asia will be held in Dhaka next month. Industry leaders from around the world are expected to attend this prestigious event that will showcase the latest innovations in technology.',
      authorId: users[3].id, // Mrinmoy
    },
  });

  const news3 = await prisma.news.create({
    data: {
      title: 'Climate Action: New Green Initiative Launched',
      body: 'Environmental activists have launched a new green initiative aimed at reducing carbon emissions in urban areas. The program focuses on sustainable transportation and renewable energy adoption.',
      authorId: users[0].id, // Alice
    },
  });

  console.log('✅ Created 3 news articles');

  // Create comments
  await prisma.comment.create({
    data: {
      text: 'This is fantastic news! Congratulations to the team.',
      newsId: news1.id,
      userId: users[3].id, // Mrinmoy
    },
  });

  await prisma.comment.create({
    data: {
      text: 'Looking forward to attending this conference!',
      newsId: news2.id,
      userId: users[0].id, // Alice
    },
  });

  await prisma.comment.create({
    data: {
      text: 'Great initiative! We need more environmental programs like this.',
      newsId: news3.id,
      userId: users[1].id, // Karim
    },
  });

  console.log('✅ Created 3 comments');
  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Test credentials:');
  console.log('   Email: alice@example.com');
  console.log('   Email: karim@example.com');
  console.log('   Email: nusrat@example.com (ADMIN)');
  console.log('   Email: mrinmoy@gmail.com');
  console.log('   Password: password123 (for all users)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
