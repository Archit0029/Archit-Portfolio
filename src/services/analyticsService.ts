import { doc, onSnapshot, runTransaction, type Unsubscribe } from 'firebase/firestore';
import { getFirebaseServices } from '../config/firebase';

export type AnalyticsMetric = 'visits' | 'profileViews' | 'downloads' | 'shares';

export type AnalyticsCounts = Record<AnalyticsMetric, number>;

export const initialAnalyticsCounts: AnalyticsCounts = {
  visits: 0,
  profileViews: 0,
  downloads: 0,
  shares: 0,
};

const localCountsKey = 'portfolio.analytics.counts.v1';
const sessionEventsKey = 'portfolio.analytics.session.v1';
const analyticsSubscribers = new Set<(counts: AnalyticsCounts) => void>();

function normalizeCounts(data: Partial<AnalyticsCounts> | null | undefined): AnalyticsCounts {
  return {
    visits: Number.isFinite(data?.visits) ? Math.max(0, Number(data?.visits)) : 0,
    profileViews: Number.isFinite(data?.profileViews) ? Math.max(0, Number(data?.profileViews)) : 0,
    downloads: Number.isFinite(data?.downloads) ? Math.max(0, Number(data?.downloads)) : 0,
    shares: Number.isFinite(data?.shares) ? Math.max(0, Number(data?.shares)) : 0,
  };
}

function getBrowserStorage(type: 'localStorage' | 'sessionStorage'): Storage | null {
  if (typeof window === 'undefined') return null;

  try {
    return window[type];
  } catch {
    return null;
  }
}

function readLocalCounts(): AnalyticsCounts {
  const storage = getBrowserStorage('localStorage');
  if (!storage) return initialAnalyticsCounts;

  try {
    return normalizeCounts(JSON.parse(storage.getItem(localCountsKey) ?? 'null'));
  } catch {
    return initialAnalyticsCounts;
  }
}

function writeLocalCounts(counts: AnalyticsCounts) {
  getBrowserStorage('localStorage')?.setItem(localCountsKey, JSON.stringify(counts));
}

function incrementLocalCount(metric: AnalyticsMetric) {
  const counts = readLocalCounts();
  const nextCounts = { ...counts, [metric]: counts[metric] + 1 };
  writeLocalCounts(nextCounts);
  analyticsSubscribers.forEach((subscriber) => subscriber(nextCounts));
  return nextCounts;
}

function claimSessionEvent(event: string) {
  const storage = getBrowserStorage('sessionStorage');
  if (!storage) return true;

  try {
    const events = JSON.parse(storage.getItem(sessionEventsKey) ?? '[]');
    if (Array.isArray(events) && events.includes(event)) return false;
    storage.setItem(sessionEventsKey, JSON.stringify([...(Array.isArray(events) ? events : []), event]));
  } catch {
    return true;
  }

  return true;
}

export function subscribeToAnalytics(onChange: (counts: AnalyticsCounts) => void): Unsubscribe {
  analyticsSubscribers.add(onChange);
  const { firestore } = getFirebaseServices();
  if (!firestore) {
    onChange(readLocalCounts());
    return () => analyticsSubscribers.delete(onChange);
  }

  const analyticsRef = doc(firestore, 'analytics', 'portfolio');
  const unsubscribe = onSnapshot(
    analyticsRef,
    (snapshot) => {
      const counts = snapshot.exists() ? normalizeCounts(snapshot.data() as Partial<AnalyticsCounts>) : initialAnalyticsCounts;
      onChange(counts);
    },
    (error) => {
      console.error('Analytics subscription error:', error);
      onChange(readLocalCounts());
    },
  );
  return () => {
    analyticsSubscribers.delete(onChange);
    unsubscribe();
  };
}

export async function incrementAnalytics(metric: AnalyticsMetric) {
  const { firestore } = getFirebaseServices();
  if (!firestore) {
    incrementLocalCount(metric);
    return;
  }

  try {
    const analyticsRef = doc(firestore, 'analytics', 'portfolio');
    await runTransaction(firestore, async (transaction) => {
      const snapshot = await transaction.get(analyticsRef);
      const counts = snapshot.exists()
        ? normalizeCounts(snapshot.data() as Partial<AnalyticsCounts>)
        : initialAnalyticsCounts;
      transaction.set(analyticsRef, { ...counts, [metric]: counts[metric] + 1 });
    });
  } catch (error) {
    console.error('Analytics update error:', error);
    incrementLocalCount(metric);
  }
}

export async function incrementAnalyticsOnce(metric: AnalyticsMetric, event: string) {
  if (!claimSessionEvent(event)) return;
  await incrementAnalytics(metric);
}
