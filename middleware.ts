import { auth } from '@/lib/auth';

export default auth((req) => {
  // req.auth contains authenticated user info
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
