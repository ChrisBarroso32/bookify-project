import {auth} from "@clerk/nextjs/server";
import {PLANS, PLAN_LIMITS, PlanType, resolvePlan} from "@/lib/subscription-constants";

export const getUserPlan = async (): Promise<PlanType> => {
    const { has, userId } = await auth();

    if (!userId) return PLANS.FREE;

    return resolvePlan(has);
}

export const getPlanLimits = async () => {
    const plan = await getUserPlan();
    return PLAN_LIMITS[plan];
}
