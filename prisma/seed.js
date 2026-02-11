const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const parties = [
    { name: 'Δημοκρατικός Συναγερμός (DISY)', slug: 'disy', logo: '', primaryColor: '#0B3D91' },
    { name: 'Ανορθωτικό Κόμμα Εργαζομένου Λαού (AKEL)', slug: 'akel', logo: '', primaryColor: '#D32F2F' },
    { name: 'Δημοκρατικό Κόμμα (DIKO)', slug: 'diko', logo: '', primaryColor: '#0F9D58' },
    { name: 'ΕΔΕΚ', slug: 'edek', logo: '', primaryColor: '#FFB300' },
    { name: 'ΕΛΑΜ', slug: 'elam', logo: '', primaryColor: '#222222' }
  ]

  for (const p of parties) {
    await prisma.party.upsert({
      where: { slug: p.slug },
      update: {},
      create: p
    })
  }

  // optionally create admin member if ADMIN_PHONE is set
  const adminPhone = process.env.ADMIN_PHONE
  if (adminPhone) {
    const admin = await prisma.member.upsert({
      where: { phone: adminPhone },
      update: { role: 'ADMIN' },
      create: { phone: adminPhone, role: 'ADMIN' }
    })
    console.log('Admin ensured:', admin.phone)
  }

  console.log('Seed complete')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
