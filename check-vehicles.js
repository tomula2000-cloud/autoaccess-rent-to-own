require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.vehicleOffer.findMany({
  select: { title: true, featuredImage: true },
  orderBy: { sortOrder: 'asc' }
}).then(vehicles => {
  const real = vehicles.filter(v => !v.featuredImage.includes('unsplash'));
  const placeholder = vehicles.filter(v => v.featuredImage.includes('unsplash'));
  console.log('REAL IMAGES:', real.length);
  real.forEach(v => console.log(' -', v.title));
  console.log('\nSTILL PLACEHOLDER:', placeholder.length);
  placeholder.forEach(v => console.log(' -', v.title));
  prisma.$disconnect();
});
