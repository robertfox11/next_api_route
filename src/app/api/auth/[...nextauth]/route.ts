import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';

import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInEmailPassword } from '@/auth/components/actions/auth-action';

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
    CredentialsProvider({
      //login  autenticacion normal manual 
      name: "Credentials",
      credentials: {
        email: { label: "Correo electrónico", type: "email", placeholder: "usuario@google.com" },
        password: { label: "Contraseña", type: "password", placeholder: '******' }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = await signInEmailPassword(credentials!.email, credentials!.password );
  
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } 

        return null;
      }
    }),
  ],
  session: {
    strategy: 'jwt'
  },

  callbacks: {

    async signIn({ user, account, profile, email, credentials }) {
       console.log({user});//podemos bloquear en usuario en particular realizando un validación
      return true;
    },

    async jwt({ token, user, account, profile }) {
      // console.log({ token });//obtenemos el token para la autenticación, comprobamos el email 
      const dbUser = await prisma.user.findUnique({ where: { email: token.email ?? 'no-email' } });
      if ( dbUser?.isActive === false ) {
        //bloquear el usuario
        throw Error('Usuario no está activo');
      }

      token.roles = dbUser?.roles ?? ['no-roles'];//si no existe el roles le damos el role por defecto
      token.id    = dbUser?.id ?? 'no-uuid';//no tiene uuidd

      return token;
    },

    async session({ session, token, user }) {
      //session del usuario y el token debemos regresar la sesión modificada
      console.log({ token })
      if ( session && session.user ) {
        session.user.roles = token.roles;
        session.user.id = token.id;

      }

      return session;
    }

  }
}



const handler = NextAuth(authOptions)
export {handler as GET, handler as POST};