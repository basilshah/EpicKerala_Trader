import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prismaClient from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const seller = await prismaClient.seller.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!seller) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          seller.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: seller.id,
          email: seller.email,
          name: seller.companyName,
          slug: seller.slug,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.slug = (user as any).slug;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).slug = token.slug as string;
      }
      return session;
    },
  },
});
