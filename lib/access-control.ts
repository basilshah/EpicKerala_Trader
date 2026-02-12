import { Session } from 'next-auth';

/**
 * Check if user is signed in
 */
export function isSignedIn(session: Session | null): boolean {
  return !!session?.user;
}

/**
 * Check if user can view contact details (phone, email)
 * Only signed-in users can see contact information
 */
export function canViewContactDetails(session: Session | null): boolean {
  return isSignedIn(session);
}

/**
 * Check if user can submit RFQ
 * Only signed-in users can submit RFQs
 */
export function canSubmitRFQ(session: Session | null): boolean {
  return isSignedIn(session);
}

/**
 * Check if user is an exporter (seller)
 */
export function isExporter(session: Session | null): boolean {
  if (!session?.user) return false;
  const userType = session.user.userType?.toUpperCase();
  return userType === 'EXPORTER';
}
