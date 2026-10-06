'use server';

import {auth} from "@clerk/nextjs/server";
import {EndSessionResult, SessionCheckResult, StartSessionResult} from "@/types";
import {connectToDatabase} from "@/database/mongoose";
import VoiceSession from "@/database/models/voice-session.model";
import {getCurrentBillingPeriodStart, PLAN_LIMITS} from "@/lib/subscription-constants";
import {getUserPlan} from "@/lib/subscription.server";

// Counts the sessions started in the current calendar-month billing period
const checkSessionLimit = async (clerkId: string): Promise<SessionCheckResult> => {
    const plan = await getUserPlan();
    const limits = PLAN_LIMITS[plan];

    const currentCount = await VoiceSession.countDocuments({
        clerkId, 
        billingPeriodStart: getCurrentBillingPeriodStart(),
    });

    const allowed = currentCount < limits.maxSessionsPerMonth;

    return {
        allowed,
        currentCount,
        limit: limits.maxSessionsPerMonth,
        plan,
        maxDurationMinutes: limits.maxDurationPerSession,
        error: allowed
            ? undefined
            : `You have used all ${limits.maxSessionsPerMonth} voice sessions for this month on your ${plan} plan. Please upgrade to continue.`,
    };
}

export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {
    try {
        const { userId } = await auth();

        if (!userId || userId !== clerkId) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectToDatabase();

        const check = await checkSessionLimit(userId);

        if (!check.allowed) {
            return { success: false, error: check.error, isBillingError: true };
        }

        const session = await VoiceSession.create({
            clerkId: userId,
            bookId,
            startedAt: new Date(),
            billingPeriodStart: getCurrentBillingPeriodStart(),
            durationSeconds: 0,
        });

        return {
            success: true,
            sessionId: session._id.toString(),
            maxDurationMinutes: check.maxDurationMinutes,
        }
    } catch (e) {
        console.error('Error starting voice session', e);
        return { success: false, error: 'Failed to start voice session. Please try again later.' }
    }
}

export const endVoiceSession = async (sessionId: string, durationSeconds: number): Promise<EndSessionResult> => {
    try {
        const { userId } = await auth();

        if (!userId) return { success: false, error: 'Unauthorized' };

        await connectToDatabase();

        // Scope by clerkId so users can only close their own sessions
        const result = await VoiceSession.findOneAndUpdate({ _id: sessionId, clerkId: userId }, {
            endedAt: new Date(),
            durationSeconds,
        });

        if(!result) return { success: false, error: 'Voice session not found.' }

        return { success: true }
    } catch (e) {
        console.error('Error ending voice session', e);
        return { success: false, error: 'Failed to end voice session. Please try again later.' }
    }
}
