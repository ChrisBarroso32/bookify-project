'use client';

import { useAuth } from "@clerk/nextjs";
import { PLANS, PLAN_LIMITS, resolvePlan } from "@/lib/subscription-constants";

export const useSubscription = () => {
    const { has, isLoaded, isSignedIn } = useAuth();

    if (!isLoaded || !isSignedIn || !has) {
        return {
            plan: PLANS.FREE,
            limits: PLAN_LIMITS[PLANS.FREE],
            isLoaded,
        };
    }

    // Same resolution as the server (lib/subscription.server.ts) so UI and enforcement agree
    const plan = resolvePlan(has);

    return {
        plan,
        limits: PLAN_LIMITS[plan],
        isLoaded: true,
    };
};
