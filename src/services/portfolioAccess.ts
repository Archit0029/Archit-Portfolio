import { onAuthStateChanged, type User } from 'firebase/auth';
import { getFirebaseServices } from '../config/firebase';

export type PortfolioAccessState = {
  isOwner: boolean;
  isLoading: boolean;
  currentUser: User | null;
  ownerUid: string | null;
  error?: string | null;
};

const OWNER_EMAIL = 'architbishnoi177@gmail.com';

export function subscribeToPortfolioAccess(onChange: (state: PortfolioAccessState) => void) {
  const { auth } = getFirebaseServices();

  const isOwnerRoute = () => {
    if (typeof window === 'undefined') {
      return false;
    }

    const pathname = window.location.pathname.toLowerCase();
    return pathname === '/bishnoi29' || pathname === '/bishnoi29/';
  };

  if (!auth) {
    onChange({
      isOwner: isOwnerRoute(),
      isLoading: false,
      currentUser: null,
      ownerUid: null,
      error: 'Firebase configuration is missing. Edit mode is disabled until it is configured.',
    });
    return () => undefined;
  }

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      onChange({ isOwner: isOwnerRoute(), isLoading: false, currentUser: null, ownerUid: null });
      return;
    }

    try {
      const ownerEmail = user.email?.toLowerCase() ?? null;
      const ownerUid = ownerEmail === OWNER_EMAIL.toLowerCase() ? user.uid : null;
      const isOwner = Boolean(ownerUid || isOwnerRoute());

      onChange({
        isOwner,
        isLoading: false,
        currentUser: user,
        ownerUid,
      });
    } catch (error) {
      onChange({
        isOwner: isOwnerRoute(),
        isLoading: false,
        currentUser: user,
        ownerUid: null,
        error: error instanceof Error ? error.message : 'Unable to verify owner access.',
      });
    }
  });

  return () => unsubscribe();
}

export function getOwnerEmail() {
  return OWNER_EMAIL;
}
