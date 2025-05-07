import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';

import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

//integramos con la autenticaacion con githu
export const authOptions:NextAuthOptions ={
  adapter: PrismaAdapter(prisma) as Adapter, // <- ✅ esto es necesario

    // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
  ],
  //adapter: PrismaAdapter(prisma) as Adapter,
}



const handler = NextAuth(authOptions)
export {handler as GET, handler as POST};