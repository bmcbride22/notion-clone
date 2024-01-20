import { eq } from "drizzle-orm";
import { storeSubscriptionPlans } from "src/config/subscriptions";
import { getUserAuth } from "src/lib/auth/utils";
import { db } from "src/server/db/index";
import { subscriptions } from "src/server/db/schema";
import { stripe } from "./index";

export async function getUserSubscriptionPlan() {
  const { session } = await getUserAuth();

  if (!session?.user) {
    throw new Error("User not found.");
  }

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id));

  if (!subscription)
    return {
      id: undefined,
      name: undefined,
      description: undefined,
      stripePriceId: undefined,
      price: undefined,
      stripeSubscriptionId: null,
      stripeCurrentPeriodEnd: null,
      stripeCustomerId: null,
      isSubscribed: false,
      isCanceled: false,
    };

  const isSubscribed =
    subscription.stripePriceId &&
    subscription.stripeCurrentPeriodEnd &&
    subscription.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now();

  const plan = isSubscribed
    ? storeSubscriptionPlans.find(
        (plan) => plan.stripePriceId === subscription.stripePriceId,
      )
    : null;

  let isCanceled = false;
  if (isSubscribed && subscription.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId,
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...plan,
    stripeSubscriptionId: subscription.stripeSubscriptionId,
    stripeCurrentPeriodEnd: subscription.stripeCurrentPeriodEnd,
    stripeCustomerId: subscription.stripeCustomerId,
    isSubscribed,
    isCanceled,
  };
}
