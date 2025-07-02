import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  console.log('🔧 Creando usuario de prueba directamente...');

  try {
    // Eliminar usuario existente si existe
    await prisma.user.deleteMany({
      where: {
        email: 'test@render.com'
      }
    });

    // Crear password hasheado
    const hashedPassword = await bcrypt.hash('test123', 10);

    // Crear nuevo usuario
    const testUser = await prisma.user.create({
      data: {
        email: 'test@render.com',
        password: hashedPassword,
        name: 'Usuario Test Render',
        phone: '+34 999 888 777',
        address: 'Calle Test Render 123',
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('✅ Usuario de prueba creado exitosamente:');
    console.log('📧 Email: test@render.com');
    console.log('🔑 Password: test123');
    console.log('👤 Rol: ADMIN');
    console.log('🆔 ID:', testUser.id);

    // También crear un usuario regular
    const regularUser = await prisma.user.create({
      data: {
        email: 'user@render.com',
        password: hashedPassword,
        name: 'Usuario Regular Render',
        phone: '+34 888 777 666',
        address: 'Calle Usuario Render 456',
        role: 'USER',
        isActive: true,
      },
    });

    console.log('\n✅ Usuario regular creado exitosamente:');
    console.log('📧 Email: user@render.com');
    console.log('🔑 Password: test123');
    console.log('👤 Rol: USER');
    console.log('🆔 ID:', regularUser.id);

    console.log('\n🎉 Usuarios de prueba creados correctamente!');
    console.log('\n🔐 Credenciales para probar:');
    console.log('Admin: test@render.com / test123');
    console.log('Usuario: user@render.com / test123');

  } catch (error) {
    console.error('❌ Error creando usuarios de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
