import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { appStorage } from '../storage/appStorage';
import type { PrivacyDecision, PrivacyDecisionKind } from '../privacy/privacyEngine';

export interface PrivacyActivity {
  id: string;
  host: string;
  kind: PrivacyDecisionKind;
  action: PrivacyDecision['action'];
  timestamp: number;
}

export interface PrivacyTotals {
  requests: number;
  trackersBlocked: number;
  adsBlocked: number;
  cookiesBlocked: number;
  httpsUpgrades: number;
}

interface PrivacyState {
  totals: PrivacyTotals;
  topHosts: Record<string, number>;
  recentActivity: PrivacyActivity[];
  isHydrated: boolean;
  recordDecision: (decision: PrivacyDecision) => void;
  clearPrivacyData: () => void;
  setHydrated: (value: boolean) => void;
}

const defaultTotals: PrivacyTotals = {
  requests: 0,
  trackersBlocked: 0,
  adsBlocked: 0,
  cookiesBlocked: 0,
  httpsUpgrades: 0,
};

const MAX_ACTIVITY = 100;
const MAX_HOSTS = 30;

const incrementTotal = (totals: PrivacyTotals, kind: PrivacyDecisionKind) => {
  const next = { ...totals, requests: totals.requests + 1 };
  if (kind === 'tracker') next.trackersBlocked += 1;
  if (kind === 'ad') next.adsBlocked += 1;
  if (kind === 'cookie') next.cookiesBlocked += 1;
  if (kind === 'https') next.httpsUpgrades += 1;
  return next;
};

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set) => ({
      totals: defaultTotals,
      topHosts: {},
      recentActivity: [],
      isHydrated: false,
      recordDecision: (decision) =>
        set((state) => {
          const shouldRecord = decision.action !== 'allow' || decision.kind !== 'allowed';
          const hostCount = state.topHosts[decision.host] || 0;
          const nextHosts = { ...state.topHosts, [decision.host]: hostCount + 1 };
          const sortedHosts = Object.entries(nextHosts)
            .sort(([, left], [, right]) => right - left)
            .slice(0, MAX_HOSTS)
            .reduce<Record<string, number>>((accumulator, [host, count]) => {
              accumulator[host] = count;
              return accumulator;
            }, {});
          const nextActivity = shouldRecord
            ? [
                {
                  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                  host: decision.host,
                  kind: decision.kind,
                  action: decision.action,
                  timestamp: Date.now(),
                },
                ...state.recentActivity,
              ].slice(0, MAX_ACTIVITY)
            : state.recentActivity;
          return {
            totals: incrementTotal(state.totals, decision.kind),
            topHosts: sortedHosts,
            recentActivity: nextActivity,
          };
        }),
      clearPrivacyData: () => set({ totals: defaultTotals, topHosts: {}, recentActivity: [] }),
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: 'probaho-privacy-v1',
      storage: appStorage,
      version: 1,
      partialize: (state) => ({
        totals: state.totals,
        topHosts: state.topHosts,
        recentActivity: state.recentActivity,
      }),
      migrate: (persistedState) => {
        const persisted = persistedState as Partial<PrivacyState> | undefined;
        return {
          totals: { ...defaultTotals, ...(persisted?.totals || {}) },
          topHosts: persisted?.topHosts || {},
          recentActivity: Array.isArray(persisted?.recentActivity)
            ? persisted.recentActivity.slice(0, MAX_ACTIVITY)
            : [],
          isHydrated: false,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
