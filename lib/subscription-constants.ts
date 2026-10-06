// Plan slugs must match the plans configured in the Clerk Dashboard (Billing → Plans).
// Users without a paid subscription are on the free tier.
export const PLANS = {
    FREE: 'free',
    STANDARD: 'standard',
    PRO: 'pro',
} as const;

export type PlanType = typeof PLANS[keyof typeof PLANS];

export interface PlanLimits {
    maxBooks: number;
    maxSessionsPerMonth: number;
    maxDurationPerSession: number; // in minutes
    hasSessionHistory: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    [PLANS.FREE]: {
        maxBooks: 1,
        maxSessionsPerMonth: 5,
        maxDurationPerSession: 5,
        hasSessionHistory: false,
    },
    [PLANS.STANDARD]: {
        maxBooks: 10,
        maxSessionsPerMonth: 100,
        maxDurationPerSession: 15,
        hasSessionHistory: true,
    },
    [PLANS.PRO]: {
        maxBooks: 100,
        maxSessionsPerMonth: Infinity,
        maxDurationPerSession: 60,
        hasSessionHistory: true,
    },
};

// Checks plans from highest to lowest so the best active plan wins.
// `has` is Clerk's authorization helper (from auth() on the server or useAuth() on the client).
export const resolvePlan = (has: (params: { plan: string }) => boolean): PlanType => {
    if (has({ plan: PLANS.PRO })) return PLANS.PRO;
    if (has({ plan: PLANS.STANDARD })) return PLANS.STANDARD;
    return PLANS.FREE;
};

// Billing periods are tracked by calendar month (UTC), so session counts reset on the 1st.
export const getCurrentBillingPeriodStart = (): Date => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
};
