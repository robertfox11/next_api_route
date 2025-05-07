'use server';

import { getUserSessionServer } from "@/auth/components/actions/auth-action";
import prisma from "@/lib/prisma";
import { Todo } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


const sleep = (seconds: number = 0 ): Promise<boolean> => {
  
  return new Promise( (resolve) => {
    setTimeout(() => {
      resolve(true);
    }, seconds * 1000 );
  });

}



export const toggleTodo = async( id: string, complete: boolean ): Promise<Todo> => {
  
  //await sleep(1);
  const todo = await prisma.todo.findFirst({ where: { id } });

  if ( !todo ) {
    throw `Todo con id ${ id } no encontrado`;
  }

  const updatedTodo = await prisma.todo.update({ where: { id }, data:{ complete }});
  revalidatePath('/dashboard/server-accounts');//mantiene el cambio en cache 
  return updatedTodo;

}


export const createTodo = async( description: string, userId:string ) => {
  const todo = await prisma.todo.create({ data: { description, userId: '...' } });
  revalidatePath('/dashboard/server-accounts');

  return todo;
}
 
export const addTodo = async( description: string ) => {
    const user =  await getUserSessionServer();
    if (!user) {
     return NextResponse.json('No autorizado', {status: 401}) 
    }
  
    try {
  
      const todo = await prisma.todo.create({ data: { description, userId:user.id} })
      revalidatePath('/dashboard/server-accounts');
      
      return todo;
      
    } catch (error) {
      return {
        message: 'Error creando todo'
      }
    }
  
}



export const deleteCompleted = async():Promise<void> => {

    await prisma.todo.deleteMany({ where: { complete: true } });
    revalidatePath('/dashboard/server-accounts');
    
  }

/*export const deleteCompleted = async() => {
  await prisma.todo.deleteMany({ where: { complete: true }});
  revalidatePath('/dashboard/server-accounts');

}*/