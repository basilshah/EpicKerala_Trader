import 'next-auth';

declare module 'next-auth' {
  interface User {
    slug?: string;
    userType?: string;
    subscriptionTier?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      slug?: string;
      userType: string;
      subscriptionTier: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    slug?: string;
    userType?: string;
    subscriptionTier?: string;
  }
}
