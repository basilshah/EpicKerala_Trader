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

        // First, try to find as Importer
        const importer = await prismaClient.importer.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (importer) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            importer.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: importer.id,
            email: importer.email,
            name: importer.name,
            userType: 'IMPORTER',
            subscriptionTier: importer.subscriptionTier,
          };
        }

        // If not found, try as Seller (Exporter)
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
          userType: 'EXPORTER',
          subscriptionTier: 'N/A',
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
        token.userType = (user as any).userType;
        token.subscriptionTier = (user as any).subscriptionTier;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).slug = token.slug as string;
        (session.user as any).userType = token.userType as string;
        (session.user as any).subscriptionTier = token.subscriptionTier as string;
      }
      return session;
    },
  },
});
