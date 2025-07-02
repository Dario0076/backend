const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// URL de conexión a la base de datos de Render
const DATABASE_URL = 'postgresql://gestionpedidosdb_user:c6tI45Faxo8ft889S1I1WQ5efbhLXdYv@dpg-d1ibgr2li9vc73fp486g-a.oregon-postgres.render.com/gestionpedidosdb';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function createUsersInRender() {
  try {
    console.log('🔗 Conectando a la base de datos de Render...');
    
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión exitosa a Render DB');
    
    // Verificar usuarios existentes
    const existingUsers = await prisma.user.findMany({
      select: { email: true, role: true }
    });
    console.log('👥 Usuarios existentes:', existingUsers);
    
    // Crear contraseñas hasheadas
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    
    // Crear usuario administrador (solo si no existe)
    const adminEmail = 'admin@admin.com';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (!existingAdmin) {
      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          password: adminPassword,
          name: 'Administrador',
          phone: '+34 666 777 888',
          address: 'Calle Admin 123',
          role: 'ADMIN',
          isActive: true,
        },
      });
      console.log('👑 Usuario admin creado:', admin.email);
    } else {
      console.log('👑 Usuario admin ya existe:', adminEmail);
    }
    
    // Crear usuario regular (solo si no existe)
    const userEmail = 'user@user.com';
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail }
    });
    
    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          email: userEmail,
          password: userPassword,
          name: 'Usuario Demo',
          phone: '+34 666 123 456',
          address: 'Calle Usuario 456',
          role: 'USER',
          isActive: true,
        },
      });
      console.log('👤 Usuario regular creado:', user.email);
    } else {
      console.log('👤 Usuario regular ya existe:', userEmail);
    }
    
    // Crear usuario admin alternativo (solo si no existe)
    const adminAltEmail = 'admin@test.com';
    const existingAdminAlt = await prisma.user.findUnique({
      where: { email: adminAltEmail }
    });
    
    if (!existingAdminAlt) {
      const adminAlt = await prisma.user.create({
        data: {
          email: adminAltEmail,
          password: adminPassword,
          name: 'Admin Test',
          phone: '+34 666 999 999',
          address: 'Calle Test 999',
          role: 'ADMIN',
          isActive: true,
        },
      });
      console.log('👑 Usuario admin alternativo creado:', adminAlt.email);
    } else {
      console.log('👑 Usuario admin alternativo ya existe:', adminAltEmail);
    }
    
    // Verificar usuarios finales
    const totalUsers = await prisma.user.count();
    const finalUsers = await prisma.user.findMany({
      select: { email: true, role: true, isActive: true }
    });
    console.log(`✅ Total de usuarios en DB: ${totalUsers}`);
    console.log('📋 Usuarios finales:', finalUsers);
    
    console.log('\n🎉 ¡PROCESO COMPLETADO EN RENDER!');
    console.log('\n📧 Credenciales de prueba:');
    console.log('👑 Admin 1: admin@admin.com / admin123');
    console.log('👑 Admin 2: admin@test.com / admin123');
    console.log('👤 Usuario: user@user.com / user123');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexión cerrada');
  }
}

createUsersInRender();
