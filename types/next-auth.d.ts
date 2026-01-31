import 'next-auth';

declare module 'next-auth' {
  interface User {
    slug?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      slug: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    slug?: string;
  }
}
