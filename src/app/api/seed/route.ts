import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: Request) {

  await prisma.todo.deleteMany(); // delete * from todo
  await prisma.user.deleteMany(); // delete * from user

  try {
    const user = await prisma.user.create({
      data: {
        email: 'test1@google.com',
        password: bcrypt.hashSync('123456'),
        roles: ['admin', 'client', 'super-user'],
        todos: {
          create: [
            { description: 'Piedra del alma', complete: true },
            { description: 'Piedra del poder' },
            { description: 'Piedra del tiempo' },
            { description: 'Piedra del espacio' },
            { description: 'Piedra del realidad' },
          ]
        }
      }
    });
    
    return NextResponse.json({ message: 'Seed Executed' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error during seed', error: error });
  }

  /*
  try {
    await prisma.todo.createMany({
      data: [
        { description: 'Piedra del alma', complete: true },
        { description: 'Piedra del poder' },
        { description: 'Piedra del tiempo' },
        { description: 'Piedra del espacio' },
        { description: 'Piedra del realidad' },
      ]
    });

    return NextResponse.json({ message: 'Seed Executed' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error during seed', error: error });
  }*/
}