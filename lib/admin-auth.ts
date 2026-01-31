import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key');

export async function adminAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token');

    if (!token) {
      return null;
    }

    const verified = await jwtVerify(token.value, secret);
    const payload = verified.payload;

    if (payload.type !== 'admin') {
      return null;
    }

    return {
      user: {
        id: payload.id as string,
        email: payload.email as string,
        name: payload.name as string,
        role: payload.role as string,
      },
    };
  } catch (error) {
    console.error('Admin auth error:', error);
    return null;
  }
}
