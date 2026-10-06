import { PricingTable } from "@clerk/nextjs";
import { getUserPlan } from "@/lib/subscription.server";
import { PLAN_LIMITS, PLANS } from "@/lib/subscription-constants";

const pricingTableAppearance = {
    variables: {
        colorPrimary: "#212a3b",
        colorBackground: "#ffffff",
        colorForeground: "#212a3b",
        colorMutedForeground: "#3d485e",
        fontFamily: "var(--font-mona-sans)",
        borderRadius: "0.75rem",
    },
};

const Page = async () => {
    const plan = await getUserPlan();
    const limits = PLAN_LIMITS[plan];

    const sessionsLabel = limits.maxSessionsPerMonth === Infinity
        ? "unlimited sessions"
        : `${limits.maxSessionsPerMonth} sessions/month`;

    return (
        <main className="clerk-subscriptions">
            <section className="flex flex-col gap-5 items-center">
                <h1 className="page-title-xl text-center">Choose Your Plan</h1>
                <p className="subtitle text-center max-w-2xl">
                    Upgrade to add more books, hold more conversations and talk longer with every book.
                </p>
                <p className="subscription-current-plan">
                    Current plan: <span className="capitalize font-semibold">{plan}</span>
                    {" · "}{limits.maxBooks} {limits.maxBooks === 1 ? "book" : "books"}
                    {" · "}{sessionsLabel}
                    {" · "}{limits.maxDurationPerSession} min/session
                </p>
            </section>

            <div className="clerk-pricing-table-wrapper">
                <PricingTable
                    highlightedPlan={PLANS.STANDARD}
                    appearance={pricingTableAppearance}
                    checkoutProps={{ appearance: pricingTableAppearance }}
                />
            </div>
        </main>
    )
}

export default Page
